import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip bám theo design config đang chọn. Rê chuột hoặc focus vào phần tử để xem popover. Đổi preset / sáng-tối ở thanh công cụ phía trên.",
      },
    },
  },
  argTypes: {
    text: { control: "text" },
  },
  args: {
    text: "Đây là chú thích.",
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Rê chuột vào nút để xem tooltip. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 40 }}>
      <Tooltip {...args}>
        <Button variant="outline">Rê chuột vào tôi</Button>
      </Tooltip>
    </div>
  ),
};
