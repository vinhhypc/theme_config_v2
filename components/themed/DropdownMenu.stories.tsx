import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dropdown Menu bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem menu tự đổi nền, bo góc, hiệu ứng hover…",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

/** Bấm nút để mở menu; bấm ra ngoài hoặc Esc để đóng. */
export const Playground: Story = {
  render: () => (
    <div style={{ paddingBottom: 160 }}>
      <DropdownMenu
        trigger="Tuỳ chọn ▾"
        items={[
          { id: "edit", label: "Chỉnh sửa" },
          { id: "dup", label: "Nhân bản" },
          { id: "del", label: "Xoá" },
        ]}
      />
    </div>
  ),
};
