"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  path: string;
  content: string;
}

const ACCEPT = [".html", ".htm", ".css", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"];

export function Dropzone({
  files,
  onChange,
}: {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  async function addFiles(list: FileList | File[]) {
    const arr = Array.from(list);
    const read = await Promise.all(
      arr.map(
        (f) =>
          new Promise<UploadedFile>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ path: f.name, content: String(reader.result ?? "") });
            reader.readAsText(f);
          }),
      ),
    );
    // de-dupe by path (last wins)
    const map = new Map(files.map((f) => [f.path, f]));
    for (const f of read) map.set(f.path, f);
    onChange(Array.from(map.values()));
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); void addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className={cn(
          "grid cursor-pointer place-items-center rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        <UploadCloud className="mb-2 h-7 w-7 text-muted-foreground" />
        <p className="text-sm font-medium">Kéo-thả file HTML / CSS / JS vào đây, hoặc bấm để chọn</p>
        <p className="text-xs text-muted-foreground">{ACCEPT.join(", ")}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT.join(",")}
          className="hidden"
          onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f) => (
            <li key={f.path} className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-sm">
              <span className="font-mono">{f.path}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onChange(files.filter((x) => x.path !== f.path)); }}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Xoá ${f.path}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
