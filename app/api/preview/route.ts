import { NextResponse } from "next/server";
import { createSession, type PreviewFile } from "@/lib/previewStore";

export async function POST(req: Request) {
  const body = (await req.json()) as { files: PreviewFile[] };
  if (!body.files?.length) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }
  const id = createSession(body.files);
  const entry = body.files.find((f) => /index\.html?$/i.test(f.path))?.path
    ?? body.files.find((f) => /\.html?$/i.test(f.path))?.path
    ?? "index.html";
  const normalized = entry.replace(/\\/g, "/").replace(/^\.?\//, "");
  return NextResponse.json({ id, url: `/api/preview/${id}/${normalized}` });
}
