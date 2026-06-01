"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, RefreshCw, Rocket, AlertCircle, ExternalLink } from "lucide-react";
import { useConfigStore } from "@/store/configStore";
import { effectiveStack } from "@/lib/config/types";
import { slugify } from "@/lib/utils";
import { useKeyStore, aiHeaders } from "@/store/keyStore";
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@/components/ui";
import { KeyInput } from "@/components/KeyInput";
import { SandpackPreview, type GenFile } from "@/components/preview/SandpackPreview";

interface ApiErr { error: { code: string; message: string } }

export default function PreviewPage() {
  const config = useConfigStore((s) => s.config);
  const openaiKey = useKeyStore((s) => s.openaiKey);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<GenFile[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // deploy state
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<string | null>(null);
  const [deployId, setDeployId] = useState<string | null>(null);
  const [deployErr, setDeployErr] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: aiHeaders(openaiKey),
        body: JSON.stringify({ config, prompt, stack: effectiveStack(config) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as ApiErr).error?.message ?? "Sinh code thất bại.");
        return;
      }
      setFiles((json as { files: GenFile[] }).files);
    } catch {
      setError("Lỗi mạng khi gọi tới server.");
    } finally {
      setLoading(false);
    }
  }

  async function deploy() {
    if (!files) return;
    const ok = window.confirm(
      "Deploy bản preview này lên Vercel? Thao tác này tạo tài nguyên thật trên tài khoản của bạn.",
    );
    if (!ok) return;
    setDeploying(true);
    setDeployErr(null);
    setDeployUrl(null);
    setDeployStatus("queued");
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: slugify(config.meta.name), files }),
      });
      const json = await res.json();
      if (!res.ok) {
        setDeployErr((json as ApiErr).error?.message ?? "Deploy thất bại.");
        setDeployStatus(null);
        return;
      }
      const d = json as { deploymentId: string; url: string; status: string };
      setDeployUrl(d.url);
      setDeployStatus(d.status);
      setDeployId(d.deploymentId);
    } catch {
      setDeployErr("Lỗi mạng khi deploy.");
      setDeployStatus(null);
    } finally {
      setDeploying(false);
    }
  }

  // Poll deploy status until ready/error.
  useEffect(() => {
    if (!deployId || deployStatus === "ready" || deployStatus === "error") return;
    const t = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/deploy?id=${deployId}`);
        const json = await res.json();
        if (res.ok) {
          setDeployStatus((json as { status: string }).status);
          if ((json as { url: string }).url) setDeployUrl((json as { url: string }).url);
        }
      } catch {
        /* keep polling */
      }
    }, 3000);
    return () => window.clearInterval(t);
  }, [deployId, deployStatus]);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Xem trước</h1>
        <p className="text-sm text-muted-foreground">
          Sinh một màn hình từ design system của bạn qua OpenAI, sau đó chạy trong sandbox hoặc deploy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Muốn dựng gì</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="vd: Trang landing có hero, 3 card tính năng và form đăng ký. Để trống sẽ tạo trang showcase đủ component."
                rows={4}
              />
              <KeyInput />
              <div className="flex items-center gap-2">
                <Button onClick={generate} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : files ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {files ? "Tạo lại" : "Tạo giao diện"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Thao tác này gọi OpenAI và có thể tốn phí (~1–3k token). Dùng key của bạn nếu có, nếu không thì dùng key server.
              </p>
            </CardContent>
          </Card>

          {files && (
            <Card>
              <CardHeader><CardTitle>Deploy</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={deploy} disabled={deploying}>
                  {deploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                  Deploy lên Vercel
                </Button>
                {deployStatus && (
                  <p className="text-sm">
                    Trạng thái: <span className="font-medium">{deployStatus}</span>
                  </p>
                )}
                {deployUrl && (
                  <a href={deployUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary underline">
                    {deployUrl} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {deployErr && (
                  <p className="flex items-start gap-1.5 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {deployErr}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="min-w-0">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {!files && !loading && (
            <div className="grid h-96 place-items-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
              <div>
                <Sparkles className="mx-auto mb-2 h-6 w-6" />
                Chưa có bản xem trước. Bấm <span className="font-medium">Tạo giao diện</span> để tạo.
              </div>
            </div>
          )}
          {loading && (
            <div className="grid h-96 place-items-center rounded-lg border border-border text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Đang tạo…</div>
            </div>
          )}
          {files && !loading && <SandpackPreview files={files} stack={effectiveStack(config)} />}
        </div>
      </div>
    </div>
  );
}
