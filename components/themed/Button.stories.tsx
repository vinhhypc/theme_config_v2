import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const VARIANTS = ["primary", "secondary", "ghost", "outline", "destructive"] as const;
const SIZES = ["sm", "md", "lg"] as const;

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem button tự đổi màu, bo góc, hiệu ứng hover…",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "inline-radio", options: SIZES },
    disabled: { control: "boolean" },
    children: { control: "text", name: "Label" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

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
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </Row>
  ),
};

/** Các kích thước. */
export const Sizes: Story = {
  render: (args) => (
    <Row>
      {SIZES.map((s) => (
        <Button key={s} {...args} size={s}>
          {s.toUpperCase()}
        </Button>
      ))}
    </Row>
  ),
};

/** Trạng thái bình thường và bị khoá. */
export const States: Story = {
  render: (args) => (
    <Row>
      <Button {...args}>Default</Button>
      <Button {...args} disabled>
        Disabled
      </Button>
    </Row>
  ),
};
