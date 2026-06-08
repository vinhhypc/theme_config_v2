import { NextResponse } from "next/server";
import { getFile } from "@/lib/previewStore";

const MIME: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  jsx: "application/javascript; charset=utf-8",
  ts: "application/javascript; charset=utf-8",
  tsx: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  ico: "image/x-icon",
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string; path: string[] }> | { id: string; path: string[] } },
) {
  const p = await context.params;
  const filePath = p.path.join("/");
  const content = getFile(p.id, filePath);
  if (content === null) {
    return new NextResponse(`Not found: ${p.id}/${filePath}`, { status: 404 });
  }
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME[ext] ?? "text/plain; charset=utf-8";
  return new NextResponse(content, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
