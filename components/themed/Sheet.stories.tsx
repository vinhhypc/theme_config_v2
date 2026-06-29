import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sheet } from "./Sheet";
import { Button } from "./Button";

const meta: Meta<typeof Sheet> = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sheet (drawer) bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem panel tự đổi nền, đổ bóng, bo góc…",
      },
    },
  },
  argTypes: {
    side: { control: "inline-radio", options: ["right", "left"] },
  },
  args: { side: "right" },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

/** Bấm để mở; bấm nền hoặc Esc để đóng. */
export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Mở Sheet</Button>
        <Sheet {...args} open={open} onClose={() => setOpen(false)} title="Cài đặt nhanh">
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Nội dung của sheet nằm ở đây. Bấm ra nền tối hoặc nhấn Esc để đóng.
          </p>
          <Button variant="outline" onClick={() => setOpen(false)}>Đóng</Button>
        </Sheet>
      </>
    );
  },
};
