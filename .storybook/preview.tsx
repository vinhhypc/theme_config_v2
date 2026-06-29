import React from "react";
import type { Preview } from "@storybook/react";
import type { ThemeStyle } from "@/lib/config/types";
import { applyPreset, presets } from "@/lib/config/presets";
import { ThemedSurface } from "@/components/themed/ThemedSurface";

// Load the configured web fonts so font-family tokens render correctly.
import "../app/fonts.css";

const presetItems = presets.map((p) => ({ value: p.id, title: p.label }));

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    layout: "fullscreen",
  },

  // Toolbar switches: the standalone Storybook can't read the app's live store,
  // so config is chosen here via the 5 built-in presets + light/dark.
  globalTypes: {
    preset: {
      description: "Design config preset",
      defaultValue: "modern",
      toolbar: {
        title: "Preset",
        icon: "paintbrush",
        items: presetItems,
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Light / dark",
      defaultValue: "light",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Sáng", icon: "sun" },
          { value: "dark", title: "Tối", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const preset = (context.globals.preset as ThemeStyle) ?? "modern";
      const mode = (context.globals.mode as "light" | "dark") ?? "light";
      const config = applyPreset(preset);
      return (
        <ThemedSurface config={config} mode={mode}>
          <Story />
        </ThemedSurface>
      );
    },
  ],
};

export default preview;
