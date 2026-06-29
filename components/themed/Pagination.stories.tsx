import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pagination bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem nút trang tự đổi màu, bo góc…",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

/** Ít trang — hiện đầy đủ. */
export const Playground: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} total={5} onChange={setPage} />;
  },
};

/** Nhiều trang — rút gọn bằng dấu “…”. */
export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(6);
    return <Pagination page={page} total={20} onChange={setPage} />;
  },
};
