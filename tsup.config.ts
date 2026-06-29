import { defineConfig } from "tsup";

/**
 * Builds the publishable component library (Model A — single npm package).
 *
 * Entry is the barrel at components/themed/index.ts. Run from the repo root so
 * esbuild reads the root tsconfig.json and resolves the `@/*` path alias; the
 * token layer (lib/config, lib/tokens) is bundled in, so the package only needs
 * React as a peer dependency. Output lands in the publishable package folder.
 */
export default defineConfig({
  entry: { index: "components/themed/index.ts" },
  outDir: "packages/theme-ui/dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ["react", "react-dom"],
  // All themed providers/components are client components.
  banner: { js: '"use client";' },
  // Match the dist package.json `type: module`: .js = ESM, .cjs = CJS.
  outExtension({ format }) {
    return { js: format === "esm" ? ".js" : ".cjs" };
  },
});
