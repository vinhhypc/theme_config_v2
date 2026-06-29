import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, type TableColumn } from "./Table";
import { Badge, type BadgeVariant } from "./Badge";

interface Row {
  name: string;
  role: string;
  status: "active" | "pending" | "blocked";
}

const STATUS_VARIANT: Record<Row["status"], BadgeVariant> = {
  active: "success",
  pending: "warning",
  blocked: "error",
};

const COLUMNS: TableColumn<Row>[] = [
  { key: "name", header: "Tên" },
  { key: "role", header: "Vai trò" },
  {
    key: "status",
    header: "Trạng thái",
    render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>,
  },
];

const DATA: Row[] = [
  { name: "Ada Lovelace", role: "Admin", status: "active" },
  { name: "Alan Turing", role: "Editor", status: "pending" },
  { name: "Grace Hopper", role: "Viewer", status: "blocked" },
];

const meta: Meta<typeof Table<Row>> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Table bám theo design config đang chọn. Đổi preset / sáng-tối ở thanh công cụ phía trên để xem bảng tự đổi viền, màu header, hiệu ứng hover hàng…",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table<Row>>;

/** Bảng dữ liệu mẫu, ô trạng thái dùng Badge. */
export const Playground: Story = {
  render: () => <Table columns={COLUMNS} data={DATA} rowKey={(r) => r.name} />,
};
