import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "./Button";

const VARIANTS = ["elevated", "outlined", "flat"] as const;

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Card bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem card tự đổi nền, bo góc, đổ bóng, hiệu ứng hover…",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    title: { control: "text" },
  },
  args: {
    variant: "elevated",
    title: "Tiêu đề thẻ",
    children: "Nội dung mô tả ngắn cho thẻ, bám theo token màu chữ phụ.",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {
  args: { footer: <Button size="sm">Hành động</Button> },
};

/** Tất cả các biến thể. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {VARIANTS.map((v) => (
        <Card key={v} variant={v} title={v} footer={<Button size="sm" variant="outline">Chi tiết</Button>}>
          Thẻ kiểu {v}.
        </Card>
      ))}
    </div>
  ),
};
