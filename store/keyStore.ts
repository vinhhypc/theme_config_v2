"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KeyState {
  /** User-provided OpenAI key, kept only on the client and sent via header. */
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
}

export const useKeyStore = create<KeyState>()(
  persist(
    (set) => ({
      openaiKey: "",
      setOpenaiKey: (openaiKey) => set({ openaiKey }),
    }),
    { name: "designsync.keys.v1" },
  ),
);

/** Build request headers, attaching the user key when present. */
export function aiHeaders(openaiKey: string): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (openaiKey.trim()) headers["x-openai-key"] = openaiKey.trim();
  return headers;
}
