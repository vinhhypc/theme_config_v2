import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input, Field } from "./Input";

const VARIANTS = ["outline", "filled", "underline"] as const;

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Input bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem input tự đổi nền, viền, bo góc…",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: VARIANTS },
    error: { control: "boolean" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "outline",
    placeholder: "you@example.com",
    error: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {
  render: (args) => <div style={{ maxWidth: 320 }}><Input {...args} /></div>,
};

/** Các biến thể, kèm nhãn. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, maxWidth: 320 }}>
      {VARIANTS.map((v) => (
        <Field key={v} label={v}>
          <Input variant={v} placeholder={`Kiểu ${v}`} />
        </Field>
      ))}
      <Field label="Lỗi">
        <Input error placeholder="Trường bị lỗi" />
      </Field>
      <Field label="Bị khoá">
        <Input disabled placeholder="Disabled" />
      </Field>
    </div>
  ),
};
