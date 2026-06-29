import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const VARIANTS = ["solid", "neutral", "success", "warning", "error", "info"] as const;

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Badge bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem badge tự đổi màu, bo góc…",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    children: { control: "text", name: "Label" },
  },
  args: {
    children: "Badge",
    variant: "solid",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    {children}
  </div>
);

/** Tất cả các biến thể (variant). */
export const Variants: Story = {
  render: (args) => (
    <Row>
      {VARIANTS.map((v) => (
        <Badge key={v} {...args} variant={v}>
          {v}
        </Badge>
      ))}
    </Row>
  ),
};
