"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Check, Copy, FileDown, FileText, Eye, Code2 } from "lucide-react";
import { useConfigStore } from "@/store/configStore";
import { generateAllMarkdown } from "@/lib/markdown";
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { MarkdownView } from "@/components/MarkdownView";
import { slugify } from "@/lib/utils";

export function ExportPanel() {
  const config = useConfigStore((s) => s.config);
  const validate = useConfigStore((s) => s.validate);

  // Lock one timestamp per render so all files agree (acceptance criterion #2).
  const [generatedAt] = useState(() => new Date().toISOString());
  const errors = useMemo(() => validate(), [validate, config]);

  const files = useMemo(
    () => generateAllMarkdown(config, { date: generatedAt }),
    [config, generatedAt],
  );

  const [active, setActive] = useState(files[0].filename);
  const [mode, setMode] = useState<"preview" | "source">("preview");
  const [copied, setCopied] = useState<string | null>(null);

  const current = files.find((f) => f.filename === active) ?? files[0];

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  }

  async function downloadZip() {
    const zip = new JSZip();
    const folder = zip.folder("design-system")!;
    for (const f of files) folder.file(f.filename, f.content);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${slugify(config.meta.name)}-design-system.zip`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          <Check className="h-3.5 w-3.5 text-green-600" /> {files.length} file · v{config.meta.version}
        </span>
        <span className="text-xs text-muted-foreground">đồng bộ</span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={() => copy(current.content, "single")}>
            {copied === "single" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Sao chép file
          </Button>
          <Button size="sm" onClick={downloadZip}>
            <FileDown className="h-4 w-4" /> Tải .zip
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="border-b border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Config có {errors.length} lỗi hợp lệ: {errors[0]}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <div className="flex flex-wrap gap-1.5">
          {files.map((f) => (
            <button
              key={f.filename}
              onClick={() => setActive(f.filename)}
              className={
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors " +
                (active === f.filename ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")
              }
            >
              <FileText className="h-3.5 w-3.5" /> {f.filename}
            </button>
          ))}
        </div>

        <Tabs defaultValue="preview" value={mode} onValueChange={(v) => setMode(v as "preview" | "source")}>
          <TabsList>
            <TabsTrigger value="preview">
              <span className="inline-flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> Hiển thị</span>
            </TabsTrigger>
            <TabsTrigger value="source">
              <span className="inline-flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> Mã nguồn</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border bg-card p-4">
          {mode === "preview" ? (
            <MarkdownView content={current.content} />
          ) : (
            <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed">{current.content}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
