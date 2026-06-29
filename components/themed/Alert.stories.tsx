import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const VARIANTS = ["success", "warning", "error", "info"] as const;

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Alert bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem alert tự đổi màu nền, viền…",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    title: { control: "text", name: "Title" },
    children: { control: "text", name: "Body" },
  },
  args: {
    variant: "info",
    title: "Thông báo",
    children: "Đây là nội dung của cảnh báo bám theo design config hiện tại.",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {};

/** Tất cả các biến thể (variant). */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      {VARIANTS.map((v) => (
        <Alert key={v} {...args} variant={v} title={v.toUpperCase()}>
          Đây là cảnh báo dạng {v}.
        </Alert>
      ))}
    </div>
  ),
};

/** Không có tiêu đề — chỉ nội dung. */
export const BodyOnly: Story = {
  args: { title: undefined, children: "Cảnh báo chỉ có nội dung, không tiêu đề." },
};
