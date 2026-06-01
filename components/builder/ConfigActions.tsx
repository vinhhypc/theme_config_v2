"use client";

import { useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { useConfigStore } from "@/store/configStore";
import { presets } from "@/lib/config/presets";
import { parseDesignConfig } from "@/lib/config/schema";
import { Button } from "@/components/ui";
import { cn, slugify } from "@/lib/utils";

export function ConfigActions() {
  const config = useConfigStore((s) => s.config);
  const loadPreset = useConfigStore((s) => s.loadPreset);
  const setConfig = useConfigStore((s) => s.setConfig);
  const reset = useConfigStore((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function flash(text: string) {
    setMsg(text);
    window.setTimeout(() => setMsg(null), 2500);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(config.meta.name)}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File) {
    try {
      const text = await file.text();
      const parsed = parseDesignConfig(JSON.parse(text));
      if (!parsed.ok) {
        flash(`Config không hợp lệ: ${parsed.errors[0]}`);
        return;
      }
      setConfig(parsed.config as never);
      flash("Đã tải config.");
    } catch {
      flash("Không đọc được file JSON.");
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Preset nhanh</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.description}
              onClick={() => loadPreset(p.id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                config.theme.style === p.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={exportJson}>
          <Download className="h-4 w-4" /> Lưu JSON
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" /> Mở JSON
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { reset(); flash("Đã đặt lại mặc định."); }}>
          <RotateCcw className="h-4 w-4" /> Đặt lại
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importJson(f);
            e.target.value = "";
          }}
        />
      </div>

      {msg ? <p className="text-xs text-muted-foreground">{msg}</p> : null}
    </div>
  );
}
