import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const ITEMS = [
  {
    id: "1",
    title: "Design config là gì?",
    content:
      "Là bộ token (màu, bo góc, khoảng cách, font, hiệu ứng) mà toàn bộ component đọc theo để tự đổi giao diện.",
  },
  {
    id: "2",
    title: "Component có tự đổi theme không?",
    content:
      "Có. Đổi preset hoặc chế độ sáng-tối ở thanh công cụ phía trên, accordion sẽ cập nhật ngay lập tức.",
  },
  {
    id: "3",
    title: "Có mở nhiều mục cùng lúc được không?",
    content: "Được — bật prop `multiple` để cho phép nhiều panel mở đồng thời.",
  },
];

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accordion bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem accordion tự đổi màu, bo góc, hiệu ứng…",
      },
    },
  },
  argTypes: {
    multiple: { control: "boolean" },
  },
  args: {
    items: ITEMS,
    multiple: false,
    defaultOpen: ["1"],
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

/** Thử nghiệm tự do — chỉnh props ở panel Controls. */
export const Playground: Story = {};

/** Mở một mục tại một thời điểm (mặc định). */
export const Single: Story = {
  args: { multiple: false },
};

/** Cho phép mở nhiều mục cùng lúc. */
export const Multiple: Story = {
  args: { multiple: true, defaultOpen: ["1", "2"] },
};
