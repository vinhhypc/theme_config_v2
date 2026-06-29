"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { DesignConfig } from "@/lib/config/types";
import { ThemedSurface } from "@/components/themed/ThemedSurface";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/themed/Button";
import { Accordion } from "@/components/themed/Accordion";
import { Alert, type AlertVariant } from "@/components/themed/Alert";
import { Avatar, type AvatarSize, type AvatarVariant } from "@/components/themed/Avatar";
import { Badge, type BadgeVariant } from "@/components/themed/Badge";
import { Calendar } from "@/components/themed/Calendar";
import { Card, type CardVariant } from "@/components/themed/Card";
import { Checkbox } from "@/components/themed/Checkbox";
import { DropdownMenu } from "@/components/themed/DropdownMenu";
import { Input as ThemedInput, Field as ThemedField } from "@/components/themed/Input";
import { Pagination } from "@/components/themed/Pagination";
import { Select as ThemedSelect } from "@/components/themed/Select";
import { Sidebar } from "@/components/themed/Sidebar";
import { Sheet } from "@/components/themed/Sheet";
import { Table, type TableColumn } from "@/components/themed/Table";
import { Toast, type ToastVariant } from "@/components/themed/Toast";
import { Tooltip } from "@/components/themed/Tooltip";
import { Field, Input, Select, Switch } from "@/components/ui";
import { Section } from "@/components/builder/controls";

type Mode = "light" | "dark";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "outline", "destructive"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];
const BADGE_VARIANTS: BadgeVariant[] = ["solid", "neutral", "success", "warning", "error", "info"];
const ALERT_VARIANTS: AlertVariant[] = ["success", "warning", "error", "info"];
const AVATAR_SIZES: AvatarSize[] = ["sm", "md", "lg"];
const AVATAR_VARIANTS: AvatarVariant[] = ["primary", "accent", "soft"];
const CARD_VARIANTS: CardVariant[] = ["elevated", "outlined", "flat"];
const TOAST_VARIANTS: ToastVariant[] = ["info", "success", "warning", "error"];

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Tổng quan" },
  { id: "projects", label: "Dự án" },
  { id: "team", label: "Thành viên" },
  { id: "settings", label: "Cài đặt" },
];

interface UserRow {
  name: string;
  role: string;
  status: "active" | "pending" | "blocked";
}

const STATUS_BADGE: Record<UserRow["status"], BadgeVariant> = {
  active: "success",
  pending: "warning",
  blocked: "error",
};

const TABLE_COLUMNS: TableColumn<UserRow>[] = [
  { key: "name", header: "Tên" },
  { key: "role", header: "Vai trò" },
  { key: "status", header: "Trạng thái", render: (r) => <Badge variant={STATUS_BADGE[r.status]}>{r.status}</Badge> },
];

const TABLE_DATA: UserRow[] = [
  { name: "Ada Lovelace", role: "Admin", status: "active" },
  { name: "Alan Turing", role: "Editor", status: "pending" },
  { name: "Grace Hopper", role: "Viewer", status: "blocked" },
];

const ACCORDION_ITEMS = [
  {
    id: "1",
    title: "Design config là gì?",
    content:
      "Là bộ token (màu, bo góc, khoảng cách, font, hiệu ứng) mà toàn bộ component đọc theo để tự đổi giao diện.",
  },
  {
    id: "2",
    title: "Component có tự đổi theme không?",
    content: "Có. Đổi cấu hình bên trái, component trong thư viện này sẽ cập nhật ngay lập tức.",
  },
  {
    id: "3",
    title: "Có mở nhiều mục cùng lúc được không?",
    content: "Được — accordion ở đây cho phép nhiều panel mở đồng thời.",
  },
];

/**
 * In-app "Storybook" — an interactive component gallery that renders real
 * components using the *live* design config from the store (passed in as
 * `config`). Each component sits in its own collapsible section. Mirrors the
 * Live Preview's token resolution, so what you see here matches the exported
 * design system.
 */
export function ComponentGallery({ config }: { config: DesignConfig }) {
  const canToggle = config.theme.mode === "both";
  const [mode, setMode] = useState<Mode>(config.theme.mode === "dark" ? "dark" : "light");
  const effectiveMode: Mode =
    config.theme.mode === "dark" ? "dark" : config.theme.mode === "light" ? "light" : mode;

  // Button playground controls (Storybook-style "Controls" panel).
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>(config.components.button.defaultSize);
  const [disabled, setDisabled] = useState(false);
  const [label, setLabel] = useState("Button");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Interactive state for the other showcases.
  const [agree, setAgree] = useState(true);
  const [notify, setNotify] = useState(false);
  const [page, setPage] = useState(2);
  const [navItem, setNavItem] = useState("dashboard");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Thư viện component</h3>
          <p className="text-xs text-muted-foreground">
            Component dựng theo config hiện tại — đổi cấu hình bên trái sẽ cập nhật ngay.
          </p>
        </div>
        {canToggle && (
          <button
            type="button"
            onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            {effectiveMode === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {effectiveMode === "dark" ? "Sáng" : "Tối"}
          </button>
        )}
      </div>

      {/* Each component in its own collapsible section. */}
      <div className="overflow-hidden rounded-lg border border-border">
        <Section title="Button" description="Thử nghiệm trực tiếp với panel điều khiển bên phải." defaultOpen>
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <ThemedSurface config={config} mode={effectiveMode}>
              <div style={{ display: "grid", placeItems: "center", minHeight: 120 }}>
                <Button variant={variant} size={size} disabled={disabled}>
                  {label || "Button"}
                </Button>
              </div>
            </ThemedSurface>

            <div className="space-y-3 rounded-lg border border-border bg-background p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Controls</p>
              <Field label="Label">
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Button" />
              </Field>
              <Field label="Variant">
                <Select
                  value={variant}
                  options={VARIANTS.map((v) => ({ value: v, label: v }))}
                  onChange={(e) => setVariant(e.target.value as ButtonVariant)}
                />
              </Field>
              <Field label="Size">
                <Select
                  value={size}
                  options={SIZES.map((s) => ({ value: s, label: s }))}
                  onChange={(e) => setSize(e.target.value as ButtonSize)}
                />
              </Field>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium">Disabled</span>
                <Switch checked={disabled} onCheckedChange={setDisabled} />
              </div>
            </div>
          </div>

          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-5, 20px)" }}>
              <GalleryBlock title="Variants">
                {VARIANTS.map((v) => (
                  <Button key={v} variant={v}>
                    {v}
                  </Button>
                ))}
              </GalleryBlock>
              <GalleryBlock title="Sizes">
                {SIZES.map((s) => (
                  <Button key={s} size={s}>
                    {s.toUpperCase()}
                  </Button>
                ))}
              </GalleryBlock>
              <GalleryBlock title="States">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </GalleryBlock>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Accordion" description="Cho phép mở nhiều mục cùng lúc.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <Accordion items={ACCORDION_ITEMS} multiple defaultOpen={["1"]} />
          </ThemedSurface>
        </Section>

        <Section title="Alert" description="Cảnh báo trạng thái theo 4 sắc thái.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)", maxWidth: 520 }}>
              {ALERT_VARIANTS.map((v) => (
                <Alert key={v} variant={v} title={v.toUpperCase()}>
                  Đây là cảnh báo dạng {v}.
                </Alert>
              ))}
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Avatar" description="Theo kích thước, màu, hoặc hiển thị ảnh.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-5, 20px)" }}>
              <GalleryBlock title="Sizes">
                {AVATAR_SIZES.map((s) => (
                  <Avatar key={s} size={s} name="Nguyễn Văn A" />
                ))}
              </GalleryBlock>
              <GalleryBlock title="Variants">
                {AVATAR_VARIANTS.map((v) => (
                  <Avatar key={v} variant={v} name="AB" />
                ))}
              </GalleryBlock>
              <GalleryBlock title="Image">
                <Avatar src="https://i.pravatar.cc/100?img=12" name="User" />
                <Avatar size="lg" src="https://i.pravatar.cc/100?img=32" name="User" />
              </GalleryBlock>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Badge" description="Nhãn trạng thái nhỏ gọn.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <GalleryBlock title="Variants">
              {BADGE_VARIANTS.map((v) => (
                <Badge key={v} variant={v}>
                  {v}
                </Badge>
              ))}
            </GalleryBlock>
          </ThemedSurface>
        </Section>

        <Section title="Calendar" description="Chọn ngày, chuyển tháng.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)", justifyItems: "start" }}>
              <Calendar value={selectedDate} onChange={setSelectedDate} />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Đã chọn: {selectedDate ? selectedDate.toLocaleDateString("vi-VN") : "—"}
              </span>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Card" description="Thẻ nội dung, 3 biến thể.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-3, 12px)" }}>
              {CARD_VARIANTS.map((v) => (
                <Card key={v} variant={v} title={v} footer={<Button size="sm" variant="outline">Chi tiết</Button>}>
                  Thẻ kiểu {v}.
                </Card>
              ))}
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Checkbox" description="Ô chọn, có trạng thái.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)" }}>
              <Checkbox checked={agree} onCheckedChange={setAgree}>Đồng ý điều khoản</Checkbox>
              <Checkbox checked={notify} onCheckedChange={setNotify}>Nhận thông báo</Checkbox>
              <Checkbox checked disabled onCheckedChange={() => {}}>Khoá (đã chọn)</Checkbox>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Dropdown Menu" description="Bấm để mở; Esc / bấm ngoài để đóng.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ minHeight: 200 }}>
              <DropdownMenu
                trigger="Tuỳ chọn ▾"
                items={[
                  { id: "edit", label: "Chỉnh sửa" },
                  { id: "dup", label: "Nhân bản" },
                  { id: "del", label: "Xoá" },
                ]}
              />
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Input" description="Ô nhập, 3 biến thể + trạng thái lỗi.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)", maxWidth: 320 }}>
              <ThemedField label="Outline"><ThemedInput placeholder="you@example.com" /></ThemedField>
              <ThemedField label="Filled"><ThemedInput variant="filled" placeholder="Nền đầy" /></ThemedField>
              <ThemedField label="Underline"><ThemedInput variant="underline" placeholder="Gạch chân" /></ThemedField>
              <ThemedField label="Lỗi"><ThemedInput error placeholder="Trường bị lỗi" /></ThemedField>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Select" description="Ô chọn danh sách.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)", maxWidth: 320 }}>
              <ThemedField label="Vai trò"><ThemedSelect options={ROLE_OPTIONS} /></ThemedField>
              <ThemedField label="Filled"><ThemedSelect variant="filled" options={ROLE_OPTIONS} /></ThemedField>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Pagination" description="Điều hướng trang, rút gọn bằng “…”.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)", justifyItems: "start" }}>
              <Pagination page={page} total={20} onChange={setPage} />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Trang {page} / 20</span>
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Sidebar" description="Menu điều hướng dọc.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <Sidebar title="Menu" items={SIDEBAR_ITEMS} activeId={navItem} onSelect={setNavItem} />
          </ThemedSurface>
        </Section>

        <Section title="Sheet" description="Panel trượt từ cạnh màn hình.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <Button onClick={() => setSheetOpen(true)}>Mở Sheet</Button>
            <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Cài đặt nhanh">
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
                Nội dung của sheet nằm ở đây. Bấm ra nền tối hoặc nhấn Esc để đóng.
              </p>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>Đóng</Button>
            </Sheet>
          </ThemedSurface>
        </Section>

        <Section title="Table" description="Bảng dữ liệu, ô trạng thái dùng Badge.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <Table columns={TABLE_COLUMNS} data={TABLE_DATA} rowKey={(r) => r.name} />
          </ThemedSurface>
        </Section>

        <Section title="Toast" description="Thông báo nổi, 4 sắc thái.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ display: "grid", gap: "var(--space-3, 12px)" }}>
              {TOAST_VARIANTS.map((v) => (
                <Toast key={v} variant={v} title={v.toUpperCase()} onClose={() => {}}>
                  Thông báo dạng {v}.
                </Toast>
              ))}
            </div>
          </ThemedSurface>
        </Section>

        <Section title="Tooltip" description="Rê chuột / focus để xem chú thích.">
          <ThemedSurface config={config} mode={effectiveMode}>
            <div style={{ paddingTop: 40 }}>
              <Tooltip text="Đây là chú thích.">
                <Button variant="outline">Rê chuột vào tôi</Button>
              </Tooltip>
            </div>
          </ThemedSurface>
        </Section>
      </div>
    </div>
  );
}

/** A labelled row of examples inside the themed canvas. */
function GalleryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gap: "var(--space-3, 12px)" }}>
      <h4
        style={{
          margin: 0,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          color: "var(--text-muted)",
        }}
      >
        {title}
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3, 12px)", alignItems: "center" }}>
        {children}
      </div>
    </section>
  );
}
