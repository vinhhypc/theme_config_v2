import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const ITEMS = [
  { id: "dashboard", label: "Tổng quan" },
  { id: "projects", label: "Dự án" },
  { id: "team", label: "Thành viên" },
  { id: "settings", label: "Cài đặt" },
];

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem menu tự đổi nền, màu mục đang chọn, bo góc…",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

/** Chọn mục để xem trạng thái active. */
export const Playground: Story = {
  render: () => {
    const [active, setActive] = useState("dashboard");
    return <Sidebar title="Menu" items={ITEMS} activeId={active} onSelect={setActive} />;
  },
};
