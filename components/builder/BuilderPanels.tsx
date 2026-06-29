"use client";

import { useConfigStore } from "@/store/configStore";
import { COLOR_ROLES, stackSupportsComponentLib } from "@/lib/config/types";
import { Field, InfoIcon, Input, Select, Slider, Switch, Textarea, Tooltip } from "@/components/ui";
import { Section, ColorField } from "./controls";

const stackOptions = [
  { value: "react-tailwind", label: "React + Tailwind (mặc định)" },
  { value: "next", label: "Next.js" },
  { value: "vue-tailwind", label: "Vue + Tailwind" },
  { value: "html-css", label: "HTML + CSS" },
];

const componentLibOptions = [
  { value: "none", label: "Không (thuần Tailwind)" },
  { value: "shadcn", label: "shadcn/ui" },
  { value: "antd", label: "Ant Design v6" },
];

const fontOptions = [
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Barlow', sans-serif", label: "Barlow" },
  { value: "'Plus Jakarta Sans', sans-serif", label: "Plus Jakarta Sans" },
  { value: "Arial, sans-serif", label: "Arial (hệ thống)" },
  { value: "'Times New Roman', serif", label: "Times New Roman (hệ thống)" },
];

const monoFontOptions = [
  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono" },
  { value: "'Roboto Mono', monospace", label: "Roboto Mono" },
  { value: "'Fira Code', monospace", label: "Fira Code" },
  { value: "'Courier New', monospace", label: "Courier New (hệ thống)" },
];

/** Nhãn tiếng Việt cho từng vai trò màu. */
const colorLabels: Record<string, string> = {
  primary: "Chính (primary)",
  secondary: "Phụ (secondary)",
  accent: "Nhấn (accent)",
  neutral: "Trung tính (neutral)",
  success: "Thành công (success)",
  warning: "Cảnh báo (warning)",
  error: "Lỗi (error)",
  info: "Thông tin (info)",
};

export function BuilderPanels() {
  const config = useConfigStore((s) => s.config);
  const update = useConfigStore((s) => s.update);
  const loadPreset = useConfigStore((s) => s.loadPreset);

  return (
    <div className="divide-y divide-border">
      {/* Mục tiêu */}
      <Section title="Mục tiêu" defaultOpen description="Stack đích quyết định mẫu code trong component-patterns.md.">
        <Field label="Tên dự án" hint="Dùng cho tiêu đề và tên các file .md khi xuất (vd: acme-design-system-ai-rules.md).">
          <Input
            value={config.meta.name}
            placeholder="Acme Design System"
            onChange={(e) => update((c) => { c.meta.name = e.target.value; })}
          />
        </Field>
        <Field label="Stack mục tiêu" tooltip="Quyết định mẫu code (React, Vue, HTML…) trong component-patterns.md.">
          <Select
            value={config.meta.targetStack}
            options={stackOptions}
            onChange={(e) =>
              update((c) => {
                c.meta.targetStack = e.target.value as typeof c.meta.targetStack;
                // Thư viện component chỉ áp dụng cho stack React; reset khi đổi sang stack khác.
                if (!stackSupportsComponentLib(c.meta.targetStack)) c.meta.componentLib = "none";
              })
            }
          />
        </Field>
        {stackSupportsComponentLib(config.meta.targetStack) ? (
          <Field label="Thư viện component" hint="Kết hợp với stack React, ví dụ: React + Tailwind + shadcn." tooltip="Thay đổi cấu trúc import & cách dùng component trong component-patterns.md.">
            <Select
              value={config.meta.componentLib}
              options={componentLibOptions}
              onChange={(e) => update((c) => { c.meta.componentLib = e.target.value as typeof c.meta.componentLib; })}
            />
          </Field>
        ) : null}
        {stackSupportsComponentLib(config.meta.targetStack) && config.meta.componentLib === "none" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1.5">
                Cài component từ npm
                <Tooltip text="Bật để docs xuất ra hướng dẫn cài & dùng bộ component dựng sẵn từ npm (ThemeProvider + component) thay vì tự code → component-patterns.md.">
                  <InfoIcon />
                </Tooltip>
              </span>
              <Switch
                checked={config.meta.componentPackage.install}
                onCheckedChange={(v) => update((c) => { c.meta.componentPackage.install = v; })}
              />
            </div>
            {config.meta.componentPackage.install ? (
              <Field label="Tên package npm" hint="Tên gói đã publish, dùng trong lệnh install ở component-patterns.md.">
                <Input
                  value={config.meta.componentPackage.name}
                  placeholder="@scope/ten-package"
                  onChange={(e) => update((c) => { c.meta.componentPackage.name = e.target.value; })}
                />
              </Field>
            ) : null}
          </>
        ) : null}
      </Section>

      {/* Giao diện */}
      <Section title="Giao diện" description="Chế độ sáng/tối và phong cách tổng thể.">
        <Field label="Chế độ" tooltip="Sinh biến CSS cho light/dark hoặc cả hai → design-tokens.md & design-guidelines.md.">
          <Select
            value={config.theme.mode}
            options={[
              { value: "light", label: "Sáng" },
              { value: "dark", label: "Tối" },
              { value: "both", label: "Cả hai (sáng + tối)" },
            ]}
            onChange={(e) => update((c) => { c.theme.mode = e.target.value as typeof c.theme.mode; })}
          />
        </Field>
        <Field label="Phong cách" hint="Chọn phong cách sẽ áp dụng preset tương ứng (màu, font, bo góc, bóng, hiệu ứng)." tooltip="Áp preset toàn bộ → ảnh hưởng tất cả file .md (tokens, guidelines, patterns…).">
          <Select
            value={config.theme.style}
            options={[
              { value: "modern", label: "Hiện đại" },
              { value: "classic", label: "Cổ điển" },
              { value: "minimal", label: "Tối giản" },
              { value: "playful", label: "Vui nhộn" },
              { value: "brutalist", label: "Brutalist" },
            ]}
            onChange={(e) => loadPreset(e.target.value as typeof config.theme.style)}
          />
        </Field>
      </Section>

      {/* Màu sắc */}
      <Section title="Màu sắc" description="Màu gốc; thang 50–900 được sinh tự động.">
        <div className="grid grid-cols-2 gap-3">
          {COLOR_ROLES.map((role) => (
            <ColorField
              key={role}
              label={colorLabels[role] ?? role}
              value={config.theme.colors[role]}
              onChange={(hex) => update((c) => { c.theme.colors[role] = hex; })}
            />
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Kiểu chữ (Typography)">
        <Field label="Font chữ chính" tooltip="Font body text → bảng Typography trong design-tokens.md.">
          <Select
            value={config.typography.fontFamilyBase}
            options={fontOptions}
            onChange={(e) => update((c) => { c.typography.fontFamilyBase = e.target.value; })}
          />
        </Field>
        <Field label="Font tiêu đề" tooltip="Font cho h1–h6 → bảng Typography trong design-tokens.md.">
          <Select
            value={config.typography.fontFamilyHeading}
            options={fontOptions}
            onChange={(e) => update((c) => { c.typography.fontFamilyHeading = e.target.value; })}
          />
        </Field>
        <Field label="Font mono" tooltip="Font cho code/pre → bảng Typography trong design-tokens.md.">
          <Select
            value={config.typography.fontFamilyMono}
            options={monoFontOptions}
            onChange={(e) => update((c) => { c.typography.fontFamilyMono = e.target.value; })}
          />
        </Field>
        <Field label="Cỡ chữ gốc" hint="Cỡ chữ body, tính bằng px." tooltip="Base font-size, dùng để tính type scale → design-tokens.md.">
          <Slider value={config.typography.baseSize} min={12} max={20} suffix="px" onValueChange={(v) => update((c) => { c.typography.baseSize = v; })} />
        </Field>
        <Field label="Chiều cao dòng" tooltip="Line-height mặc định cho body → design-tokens.md.">
          <Slider value={config.typography.lineHeight} min={1.2} max={2} step={0.05} onValueChange={(v) => update((c) => { c.typography.lineHeight = Math.round(v * 100) / 100; })} />
        </Field>
      </Section>


      {/* Bo góc */}
      <Section title="Bo góc (Radius)">
        <Field label="Kiểu" tooltip="Kiểu bo góc tổng thể → bảng Radius trong design-tokens.md.">
          <Select
            value={config.radius.style}
            options={[
              { value: "sharp", label: "Vuông (0)" },
              { value: "rounded", label: "Bo tròn" },
              { value: "pill", label: "Viên thuốc (pill)" },
            ]}
            onChange={(e) => update((c) => { c.radius.style = e.target.value as typeof c.radius.style; })}
          />
        </Field>
        <Field label="Độ bo gốc" tooltip="Giá trị base radius, sinh ra các bậc sm/md/lg/xl → design-tokens.md.">
          <Slider value={config.radius.base} min={0} max={32} suffix="px" onValueChange={(v) => update((c) => { c.radius.base = v; })} />
        </Field>
      </Section>

      {/* Viền */}
      <Section title="Viền (Borders)">
        <Field label="Độ dày" tooltip="Border width mặc định → bảng Borders trong design-tokens.md.">
          <Slider value={config.borders.width} min={0} max={6} suffix="px" onValueChange={(v) => update((c) => { c.borders.width = v; })} />
        </Field>
        <Field label="Kiểu" tooltip="Border style (solid/dashed) → design-tokens.md.">
          <Select
            value={config.borders.style}
            options={[
              { value: "solid", label: "Liền" },
              { value: "dashed", label: "Đứt nét" },
            ]}
            onChange={(e) => update((c) => { c.borders.style = e.target.value as typeof c.borders.style; })}
          />
        </Field>
      </Section>

      {/* Đổ bóng */}
      <Section title="Đổ bóng (Elevation)">
        <Field label="Kiểu" tooltip="Phong cách đổ bóng (flat/soft/hard) → bảng Elevation trong design-tokens.md.">
          <Select
            value={config.elevation.style}
            options={[
              { value: "flat", label: "Phẳng" },
              { value: "soft", label: "Mềm" },
              { value: "hard", label: "Cứng (lệch)" },
            ]}
            onChange={(e) => update((c) => { c.elevation.style = e.target.value as typeof c.elevation.style; })}
          />
        </Field>
        <Field label="Số bậc" tooltip="Số cấp shadow (1–6) được sinh → bảng Elevation trong design-tokens.md.">
          <Slider value={config.elevation.levels} min={1} max={6} onValueChange={(v) => update((c) => { c.elevation.levels = v; })} />
        </Field>
      </Section>

      {/* Animation */}
      <Section title="Hiệu ứng (Animation)">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5">Bật hiệu ứng <Tooltip text="Bật/tắt animation toàn cục → design-tokens.md & design-guidelines.md."><InfoIcon /></Tooltip></span>
          <Switch checked={config.animation.enabled} onCheckedChange={(v) => update((c) => { c.animation.enabled = v; })} />
        </div>
        <Field label="Kiểu" tooltip="Kiểu animation (subtle/smooth/bouncy) → bảng Animation trong design-tokens.md.">
          <Select
            value={config.animation.style}
            options={[
              { value: "none", label: "Không" },
              { value: "subtle", label: "Nhẹ nhàng" },
              { value: "smooth", label: "Mượt" },
              { value: "bouncy", label: "Nảy" },
            ]}
            onChange={(e) => update((c) => { c.animation.style = e.target.value as typeof c.animation.style; })}
          />
        </Field>
        <Field label="Thời lượng" tooltip="Duration mặc định cho transition/animation → design-tokens.md.">
          <Slider value={config.animation.durationMs} min={0} max={600} step={10} suffix="ms" onValueChange={(v) => update((c) => { c.animation.durationMs = v; })} />
        </Field>
      </Section>

      {/* Trạng thái tương tác */}
      <Section title="Trạng thái tương tác" description="Khai báo hiệu ứng khi hover / nhấn / focus cho button, card, link.">
        <Field label="Hiệu ứng hover" hint="Áp dụng khi rê chuột vào button/card." tooltip="Hiệu ứng hover cho button/card → mục Interaction States trong design-guidelines.md.">
          <Select
            value={config.interactions.hover}
            options={[
              { value: "none", label: "Không đổi" },
              { value: "darken", label: "Đậm màu hơn" },
              { value: "lift", label: "Nâng lên (bóng + dịch lên)" },
              { value: "scale", label: "Phóng to nhẹ" },
              { value: "glow", label: "Phát sáng (glow)" },
            ]}
            onChange={(e) => update((c) => { c.interactions.hover = e.target.value as typeof c.interactions.hover; })}
          />
        </Field>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5">Phản hồi khi nhấn (active) <Tooltip text="Hiệu ứng scale-down khi nhấn button → design-guidelines.md." align="center"><InfoIcon /></Tooltip></span>
          <Switch checked={config.interactions.pressFeedback} onCheckedChange={(v) => update((c) => { c.interactions.pressFeedback = v; })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5">Vòng focus (bàn phím) <Tooltip text="Hiển thị focus ring khi dùng bàn phím → design-guidelines.md."><InfoIcon /></Tooltip></span>
          <Switch checked={config.interactions.focusRing} onCheckedChange={(v) => update((c) => { c.interactions.focusRing = v; })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5">Gạch chân link khi hover <Tooltip text="Link có underline khi hover hay không → design-guidelines.md." align="center"><InfoIcon /></Tooltip></span>
          <Switch checked={config.interactions.underlineLinks} onCheckedChange={(v) => update((c) => { c.interactions.underlineLinks = v; })} />
        </div>
      </Section>

      {/* Components */}
      <Section title="Thành phần (Components)">
        <Field label="Cỡ Button mặc định" tooltip="Kích thước mặc định của Button → mẫu code trong component-patterns.md.">
          <Select
            value={config.components.button.defaultSize}
            options={[
              { value: "sm", label: "Nhỏ" },
              { value: "md", label: "Vừa" },
              { value: "lg", label: "Lớn" },
            ]}
            onChange={(e) => update((c) => { c.components.button.defaultSize = e.target.value as "sm" | "md" | "lg"; })}
          />
        </Field>
        <Field label="Biến thể Input" tooltip="Style mặc định của Input (outline/filled/underline) → component-patterns.md.">
          <Select
            value={config.components.input.variant}
            options={[
              { value: "outline", label: "Viền (outline)" },
              { value: "filled", label: "Nền đầy (filled)" },
              { value: "underline", label: "Gạch chân (underline)" },
            ]}
            onChange={(e) => update((c) => { c.components.input.variant = e.target.value as typeof c.components.input.variant; })}
          />
        </Field>
        <Field label="Biến thể Card" tooltip="Style mặc định của Card (elevated/outlined/flat) → component-patterns.md.">
          <Select
            value={config.components.card.variant}
            options={[
              { value: "elevated", label: "Nổi (elevated)" },
              { value: "outlined", label: "Viền (outlined)" },
              { value: "flat", label: "Phẳng (flat)" },
            ]}
            onChange={(e) => update((c) => { c.components.card.variant = e.target.value as typeof c.components.card.variant; })}
          />
        </Field>
        <div className="space-y-2 pt-2">
          {([
            ["badge", "Badge"],
            ["modal", "Modal"],
            ["table", "Table"],
          ] as const).map(([comp, label]) => (
            <div key={comp} className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1.5">Bao gồm {label} <Tooltip text={`Bật để sinh mẫu code ${label} → component-patterns.md.`}><InfoIcon /></Tooltip></span>
              <Switch
                checked={config.components[comp].enabled}
                onCheckedChange={(v) => update((c) => { c.components[comp].enabled = v; })}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* AI Rules */}
      <Section title="Quy tắc AI">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5">Chỉ dùng token <Tooltip text="Bắt buộc AI chỉ dùng design token, không hardcode giá trị → ai-rules.md."><InfoIcon /></Tooltip></span>
          <Switch checked={config.aiRules.enforceTokensOnly} onCheckedChange={(v) => update((c) => { c.aiRules.enforceTokensOnly = v; })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-1.5">Clean code <Tooltip text="Bắt buộc AI viết code sạch (không inline style, không magic number…) → ai-rules.md."><InfoIcon /></Tooltip></span>
          <Switch checked={config.aiRules.cleanCode} onCheckedChange={(v) => update((c) => { c.aiRules.cleanCode = v; })} />
        </div>
        <Field label="Quy ước đặt tên" tooltip="Naming convention cho class/biến (Tailwind/CSS vars/BEM) → ai-rules.md.">
          <Select
            value={config.aiRules.namingConvention}
            options={[
              { value: "tailwind", label: "Tiện ích Tailwind" },
              { value: "css-vars", label: "Biến CSS" },
              { value: "bem", label: "BEM" },
            ]}
            onChange={(e) => update((c) => { c.aiRules.namingConvention = e.target.value as typeof c.aiRules.namingConvention; })}
          />
        </Field>
        <Field label="Mức truy cập (Accessibility)" tooltip="Mức WCAG (AA/AAA) — quyết định contrast ratio tối thiểu → ai-rules.md.">
          <Select
            value={config.aiRules.accessibility}
            options={[
              { value: "AA", label: "WCAG AA" },
              { value: "AAA", label: "WCAG AAA" },
            ]}
            onChange={(e) => update((c) => { c.aiRules.accessibility = e.target.value as typeof c.aiRules.accessibility; })}
          />
        </Field>
        <Field label="Quy tắc tuỳ chỉnh" hint="Mỗi dòng một quy tắc." tooltip="Các quy tắc tự do bạn thêm sẽ nằm trong mục Custom Rules → ai-rules.md.">
          <Textarea
            value={config.aiRules.customRules.join("\n")}
            onChange={(e) => update((c) => { c.aiRules.customRules = e.target.value.split("\n").map((r) => r.trim()).filter(Boolean); })}
            placeholder="vd: Luôn dùng lucide-react cho icon"
          />
        </Field>
      </Section>
    </div>
  );
}
