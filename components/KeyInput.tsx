"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useKeyStore } from "@/store/keyStore";
import { Input } from "@/components/ui";

/**
 * Optional OpenAI key input. Stored client-side only and sent via the
 * `x-openai-key` header — it overrides the server `.env` default.
 */
export function KeyInput() {
  const key = useKeyStore((s) => s.openaiKey);
  const setKey = useKeyStore((s) => s.setOpenaiKey);
  const [show, setShow] = useState(false);

  return (
    <div className="grid gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium">
        <KeyRound className="h-3.5 w-3.5" /> OpenAI API key (tuỳ chọn)
      </label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-… (để trống sẽ dùng key của server)"
          className="pr-10 font-mono"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={show ? "Ẩn key" : "Hiện key"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Chỉ lưu trong trình duyệt của bạn. Không bao giờ ghi log. Dùng để ghi đè key mặc định của server.
      </p>
    </div>
  );
}
