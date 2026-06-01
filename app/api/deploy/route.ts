import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createDeployment, getDeploymentStatus } from "@/lib/vercel";
import { errorResponse, HttpError } from "@/lib/api-error";

export const runtime = "nodejs";

const bodySchema = z.object({
  projectName: z.string().min(1),
  files: z.array(z.object({ path: z.string(), content: z.string() })).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      throw new HttpError(400, "bad_request", parsed.error.issues[0]?.message ?? "Invalid request body");
    }
    const { projectName, files } = parsed.data;
    const result = await createDeployment(projectName, files);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}

/** Poll deployment status: GET /api/deploy?id=<deploymentId>. */
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) throw new HttpError(400, "bad_request", "Missing ?id");
    const result = await getDeploymentStatus(id);
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
