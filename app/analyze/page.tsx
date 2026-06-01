"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldAlert, Wand2, ListChecks, GitCompare, AlertCircle, Check, Download } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useConfigStore } from "@/store/configStore";
import { useKeyStore, aiHeaders } from "@/store/keyStore";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { KeyInput } from "@/components/KeyInput";
import { Dropzone, type UploadedFile } from "@/components/analyze/Dropzone";
import { cn } from "@/lib/utils";

interface Issue { id: string; severity: "high" | "med" | "low"; file: string; line?: number; message: string; suggestion?: string }
interface ProposedRule { targetFile: string; rule: string }
interface DiffFile { path: string; before: string; after: string }
interface ApiErr { error: { code: string; message: string } }

const severityColor: Record<Issue["severity"], string> = {
  high: "bg-destructive/15 text-destructive",
  med: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  low: "bg-muted text-muted-foreground",
};

export default function AnalyzePage() {
  const config = useConfigStore((s) => s.config);
  const update = useConfigStore((s) => s.update);
  const openaiKey = useKeyStore((s) => s.openaiKey);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [proposed, setProposed] = useState<ProposedRule[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [merged, setMerged] = useState(false);
  const [diffs, setDiffs] = useState<DiffFile[] | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [refactoring, setRefactoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedRules = useMemo(
    () => proposed.filter((_, i) => selected.has(i)).map((p) => p.rule),
    [proposed, selected],
  );

  async function analyze() {
    if (files.length === 0) return;
    setAnalyzing(true);
    setError(null);
    setIssues(null);
    setProposed([]);
    setSelected(new Set());
    setMerged(false);
    setDiffs(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: aiHeaders(openaiKey),
        body: JSON.stringify({ files, config }),
      });
      const json = await res.json();
      if (!res.ok) { setError((json as ApiErr).error?.message ?? "Phân tích thất bại."); return; }
      const data = json as { issues: Issue[]; proposedRules: ProposedRule[] };
      setIssues(data.issues);
      setProposed(data.proposedRules);
    } catch {
      setError("Lỗi mạng khi gọi tới server.");
    } finally {
      setAnalyzing(false);
    }
  }

  function mergeRules() {
    if (acceptedRules.length === 0) return;
    update((c) => {
      const existing = new Set(c.aiRules.customRules);
      for (const r of acceptedRules) if (!existing.has(r)) c.aiRules.customRules.push(r);
    });
    setMerged(true);
  }

  async function refactor() {
    if (files.length === 0) return;
    setRefactoring(true);
    setError(null);
    try {
      const res = await fetch("/api/refactor", {
        method: "POST",
        headers: aiHeaders(openaiKey),
        body: JSON.stringify({ files, config, appliedRules: acceptedRules }),
      });
      const json = await res.json();
      if (!res.ok) { setError((json as ApiErr).error?.message ?? "Refactor thất bại."); return; }
      setDiffs((json as { files: DiffFile[] }).files);
    } catch {
      setError("Lỗi mạng khi gọi tới server.");
    } finally {
      setRefactoring(false);
    }
  }

  async function downloadRefactored() {
    if (!diffs) return;
    const zip = new JSZip();
    for (const d of diffs) zip.file(d.path, d.after);
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "refactored.zip");
  }

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Phân tích &amp; Refactor</h1>
        <p className="text-sm text-muted-foreground">
          Upload code để tìm vấn đề, làm dày bộ quy tắc, và refactor cho khớp token của bạn.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Code upload được coi là <strong className="mx-1 font-semibold text-foreground">dữ liệu, không phải lệnh</strong>.
        Mọi chỉ thị nhúng bên trong (vd “ignore previous rules”) đều bị bỏ qua và chỉ phân tích như văn bản.
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Tải lên</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Dropzone files={files} onChange={setFiles} />
              <KeyInput />
              <div className="flex flex-wrap gap-2">
                <Button onClick={analyze} disabled={analyzing || files.length === 0}>
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListChecks className="h-4 w-4" />}
                  Phân tích
                </Button>
                <Button variant="outline" onClick={refactor} disabled={refactoring || files.length === 0}>
                  {refactoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  Refactor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {issues && (
            <Card>
              <CardHeader><CardTitle>Vấn đề ({issues.length})</CardTitle></CardHeader>
              <CardContent>
                {issues.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Không tìm thấy vấn đề nào. 🎉</p>
                ) : (
                  <ul className="space-y-3">
                    {issues.map((i) => (
                      <li key={i.id} className="rounded-md border border-border p-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium uppercase", severityColor[i.severity])}>
                            {i.severity}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {i.file}{i.line ? `:${i.line}` : ""}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm">{i.message}</p>
                        {i.suggestion && <p className="mt-1 text-sm text-muted-foreground">💡 {i.suggestion}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {proposed.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Quy tắc đề xuất — chọn để gộp</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {proposed.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 rounded-md border border-border p-2.5">
                      <input
                        type="checkbox"
                        className="mt-1 accent-primary"
                        checked={selected.has(idx)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(idx); else next.delete(idx);
                          setSelected(next);
                          setMerged(false);
                        }}
                      />
                      <div className="text-sm">
                        <span className="font-mono text-xs text-muted-foreground">{p.targetFile}</span>
                        <p>{p.rule}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={mergeRules} disabled={acceptedRules.length === 0}>
                    Gộp {acceptedRules.length || ""} vào ai-rules.md
                  </Button>
                  {merged && (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <Check className="h-4 w-4" /> Đã thêm vào quy tắc tuỳ chỉnh
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {diffs && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-1.5"><GitCompare className="h-4 w-4" /> So sánh refactor</CardTitle>
                <Button size="sm" variant="outline" onClick={downloadRefactored}>
                  <Download className="h-4 w-4" /> Tải về
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {diffs.map((d) => (
                  <div key={d.path}>
                    <p className="mb-1 font-mono text-xs text-muted-foreground">{d.path}</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-medium text-destructive">Trước</p>
                        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-2 text-xs">{d.before}</pre>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium text-green-600">Sau</p>
                        <pre className="max-h-72 overflow-auto rounded-md bg-muted p-2 text-xs">{d.after}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!issues && !diffs && !analyzing && (
            <div className="grid h-64 place-items-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
              Tải file lên và bấm Phân tích để bắt đầu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
