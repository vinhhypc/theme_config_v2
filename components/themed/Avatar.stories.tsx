import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const SIZES = ["sm", "md", "lg"] as const;
const VARIANTS = ["primary", "accent", "soft"] as const;

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Avatar bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem avatar tự đổi màu nền.",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    variant: { control: "select", options: VARIANTS },
    name: { control: "text", name: "Name (initials)" },
    src: { control: "text", name: "Image URL" },
  },
  args: {
    size: "md",
    variant: "primary",
    name: "Nguyễn Văn A",
    src: "",
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    {children}
  </div>
);

/** Các kích thước. */
export const Sizes: Story = {
  render: (args) => (
    <Row>
      {SIZES.map((s) => (
        <Avatar key={s} {...args} size={s} />
      ))}
    </Row>
  ),
};

/** Các biến thể màu. */
export const Variants: Story = {
  render: (args) => (
    <Row>
      {VARIANTS.map((v) => (
        <Avatar key={v} {...args} variant={v} />
      ))}
    </Row>
  ),
};

/** Hiển thị ảnh thay cho chữ viết tắt. */
export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/100?img=12",
    name: "User",
  },
};
