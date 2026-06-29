import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Calendar bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem lịch tự đổi màu, bo góc, hiệu ứng hover…",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

/** Lịch cơ bản — chọn ngày, chuyển tháng. */
export const Playground: Story = {};

/** Quản lý ngày được chọn từ bên ngoài (controlled). */
export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
        <Calendar value={date} onChange={setDate} />
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Đã chọn: {date ? date.toLocaleDateString("vi-VN") : "—"}
        </span>
      </div>
    );
  },
};
