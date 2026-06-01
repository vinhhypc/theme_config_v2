"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

export interface GenFile {
  path: string;
  content: string;
}

/**
 * Render generated files in a sandboxed Sandpack iframe.
 * Chooses a template based on the target stack.
 */
export function SandpackPreview({ files, stack }: { files: GenFile[]; stack: string }) {
  const isStatic = stack === "html-css" || files.some((f) => f.path.endsWith(".html"));

  if (isStatic) {
    const map: Record<string, string> = {};
    for (const f of files) map["/" + f.path.replace(/^\//, "")] = f.content;
    if (!map["/index.html"]) {
      // Fallback: synthesise a host page that imports styles.css.
      map["/index.html"] = `<!doctype html><html><head><link rel="stylesheet" href="styles.css"></head><body>${files[0]?.content ?? ""}</body></html>`;
    }
    return (
      <Sandpack
        template="static"
        files={map}
        options={{ showTabs: true, editorHeight: 560, showLineNumbers: true }}
        theme="auto"
      />
    );
  }

  // React template
  const map: Record<string, string> = {};
  for (const f of files) map["/" + f.path.replace(/^\//, "")] = f.content;

  const entry =
    map["/App.js"] ??
    map["/App.jsx"] ??
    map["/App.tsx"] ??
    Object.entries(map).find(([p]) => /\.(jsx?|tsx?)$/.test(p))?.[1];
  if (entry && !map["/App.js"]) map["/App.js"] = entry;

  const isAntd = stack === "antd";
  const dependencies: Record<string, string> = isAntd
    ? { antd: "latest" }
    : { clsx: "latest" };
  // antd ships its own styles; other stacks (incl. shadcn) render via Tailwind CDN.
  const externalResources = isAntd ? [] : ["https://cdn.tailwindcss.com"];

  return (
    <Sandpack
      template="react"
      files={map}
      customSetup={{ dependencies }}
      options={{ showTabs: true, editorHeight: 560, showLineNumbers: true, externalResources }}
      theme="auto"
    />
  );
}
