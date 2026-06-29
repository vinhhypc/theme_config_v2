import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Checkbox bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem checkbox tự đổi màu, bo góc…",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/** Có trạng thái nội bộ — bấm để bật/tắt. */
export const Playground: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox checked={checked} onCheckedChange={setChecked}>
        Đồng ý điều khoản
      </Checkbox>
    );
  },
};

/** Các trạng thái. */
export const States: Story = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Checkbox checked={a} onCheckedChange={setA}>Đã chọn</Checkbox>
        <Checkbox checked={b} onCheckedChange={setB}>Chưa chọn</Checkbox>
        <Checkbox checked disabled onCheckedChange={() => {}}>Khoá (đã chọn)</Checkbox>
        <Checkbox checked={false} disabled onCheckedChange={() => {}}>Khoá (chưa chọn)</Checkbox>
      </div>
    );
  },
};
