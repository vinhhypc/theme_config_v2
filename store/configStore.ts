"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DesignConfig, ThemeStyle } from "@/lib/config/types";
import { defaultConfig, cloneConfig } from "@/lib/config/defaults";
import { applyPreset } from "@/lib/config/presets";
import { parseDesignConfig } from "@/lib/config/schema";

/** A deep-partial patch path setter helper type. */
type Updater = (config: DesignConfig) => void;

interface ConfigState {
  config: DesignConfig;
  /** Apply a mutation to a draft copy (keeps store immutable-ish). */
  update: (fn: Updater) => void;
  /** Replace the whole config (e.g. after import/load). */
  setConfig: (config: DesignConfig) => void;
  /** Fill from a style preset, preserving meta. */
  loadPreset: (style: ThemeStyle) => void;
  /** Reset to factory default. */
  reset: () => void;
  /** Validate the current config; returns errors (empty = valid). */
  validate: () => string[];
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: cloneConfig(defaultConfig),

      update: (fn) =>
        set((state) => {
          const next = cloneConfig(state.config);
          fn(next);
          return { config: next };
        }),

      setConfig: (config) => set({ config: cloneConfig(config) }),

      loadPreset: (style) =>
        set((state) => {
          const next = applyPreset(style, state.config);
          // keep the user's meta (name/version/description) but record the style
          next.meta = { ...state.config.meta };
          next.theme.style = style;
          return { config: next };
        }),

      reset: () => set({ config: cloneConfig(defaultConfig) }),

      validate: () => {
        const res = parseDesignConfig(get().config);
        return res.ok ? [] : res.errors;
      },
    }),
    {
      name: "designsync.config.v1",
      version: 1,
      // Guard against corrupt/old persisted data: fall back to default if invalid.
      merge: (persisted, current) => {
        const candidate = (persisted as { config?: unknown })?.config;
        const res = parseDesignConfig(candidate);
        return {
          ...current,
          config: res.ok ? (res.config as DesignConfig) : current.config,
        };
      },
    },
  ),
);
