import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Serve /public so the configured web fonts (/fonts/**) resolve in stories.
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
  async viteFinal(viteConfig) {
    const { default: tsconfigPaths } = await import("vite-tsconfig-paths");
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tsconfigPaths()];
    return viteConfig;
  },
};

export default config;
