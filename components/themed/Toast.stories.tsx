import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const VARIANTS = ["info", "success", "warning", "error"] as const;

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toast bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem toast tự đổi nền, viền, đổ bóng, bo góc…",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    title: { control: "text" },
    children: { control: "text", name: "Message" },
  },
  args: {
    variant: "info",
    title: "Đã lưu thay đổi",
    children: "Cấu hình của bạn đã được lưu thành công.",
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {
  render: (args) => <Toast {...args} onClose={() => {}} />,
};

/** Tất cả các biến thể. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      {VARIANTS.map((v) => (
        <Toast key={v} variant={v} title={v.toUpperCase()} onClose={() => {}}>
          Thông báo dạng {v}.
        </Toast>
      ))}
    </div>
  ),
};
