import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient, openAIModel, stripFence } from "@/lib/openai";
import { generateAiEntrypoint } from "@/lib/markdown";
import { designConfigSchema } from "@/lib/config/schema";
import { effectiveStack } from "@/lib/config/types";
import { errorResponse, HttpError } from "@/lib/api-error";

export const runtime = "nodejs";

const bodySchema = z.object({
  config: designConfigSchema,
  prompt: z.string().optional(),
  stack: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      throw new HttpError(400, "bad_request", parsed.error.issues[0]?.message ?? "Invalid request body");
    }
    const { config, prompt } = parsed.data;
    const client = getOpenAIClient(req.headers.get("x-openai-key"));

    const entrypoint = generateAiEntrypoint(config);
    const stack = parsed.data.stack ?? effectiveStack(config);
    const userTask =
      prompt?.trim() ||
      "Build a showcase page that demonstrates every component (buttons, inputs, card, badges, and a sample form) so the design system can be reviewed at a glance.";

    const system = [
      "You are a senior frontend engineer. Generate a small, self-contained app for a code sandbox.",
      "Follow the provided design system EXACTLY: reference tokens only, no hard-coded hex/px.",
      "",
      entrypoint,
      "",
      "OUTPUT FORMAT: Respond ONLY with JSON of the form",
      '{ "files": [ { "path": "App.jsx", "content": "..." }, { "path": "styles.css", "content": "..." } ] }',
      stack === "html-css"
        ? "For html-css, produce index.html and styles.css that run standalone."
        : stack === "antd"
          ? "For Ant Design v6: produce an App.jsx default export that wraps the UI in <ConfigProvider theme={themeConfig}> using the theme tokens from the entrypoint, and builds the screen with antd components imported from 'antd'. Do NOT use Tailwind. No styles.css needed."
          : stack === "shadcn"
            ? "For shadcn/ui: produce a SELF-CONTAINED App.jsx using React + Tailwind classes bound to the shadcn CSS variables, plus a styles.css containing the shadcn :root variables from the entrypoint. Do NOT import from '@/components/ui' (not available in the sandbox) — inline small components instead."
            : "For React/Tailwind, produce an App.jsx default export plus a styles.css containing the :root token variables. Assume Tailwind is available.",
      "Keep it under ~250 lines total. No external network calls.",
    ].join("\n");

    const completion = await client.chat.completions.create({
      model: openAIModel(),
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: userTask },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let files: { path: string; content: string }[] = [];
    try {
      const obj = JSON.parse(stripFence(raw));
      files = Array.isArray(obj.files) ? obj.files : [];
    } catch {
      throw new HttpError(502, "bad_model_output", "The model did not return valid JSON.");
    }
    if (files.length === 0) {
      throw new HttpError(502, "empty_output", "The model returned no files.");
    }

    return NextResponse.json({ files });
  } catch (err) {
    return errorResponse(err);
  }
}
