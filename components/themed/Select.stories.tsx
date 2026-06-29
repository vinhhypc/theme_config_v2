import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { Field } from "./Input";

const OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const VARIANTS = ["outline", "filled", "underline"] as const;

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Select bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem select tự đổi nền, viền, bo góc…",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: VARIANTS },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    options: OPTIONS,
    variant: "outline",
    error: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {
  render: (args) => <div style={{ maxWidth: 320 }}><Select {...args} /></div>,
};

/** Các biến thể, kèm nhãn. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 320 }}>
      {VARIANTS.map((v) => (
        <Field key={v} label={v}>
          <Select variant={v} options={OPTIONS} />
        </Field>
      ))}
    </div>
  ),
};
