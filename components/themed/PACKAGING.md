# Đóng gói thư viện component lên npm

Các component trong thư mục này **không mang theo màu/spacing cứng** — chúng chỉ phát ra class ngữ nghĩa (`tcb`, `tc-card`, …). Toàn bộ giao diện đến từ `<ThemeProvider>`: nó nhận `DesignConfig` (các token bạn đã chọn), đổ ra CSS variables + stylesheet và bọc quanh component. Đổi config → mọi component tự đổi theme.

Đây chính là điều kiện "phải có 1 config provider bọc các component, truyền vào token đã chọn".

## 1. Cách người dùng cuối sử dụng

```tsx
import { ThemeProvider, Button, Card, applyPreset } from "@vinhhypc/config-theme";

// Token đã chọn: lấy từ preset, hoặc DesignConfig bạn tự build/lưu JSON.
const config = applyPreset("modern");
// const config = JSON.parse(savedJson) as DesignConfig;

export default function App() {
  return (
    <ThemeProvider config={config} mode="light">
      <Card title="Xin chào" footer={<Button>OK</Button>}>
        Nội dung tự bám theme.
      </Card>
    </ThemeProvider>
  );
}
```

- `config`: bắt buộc — chính là token đã chọn (kết quả từ trình cấu hình này, hoặc 1 preset).
- `mode`: `"light" | "dark"`.
- Nhiều `<ThemeProvider>` với config khác nhau có thể tồn tại cùng lúc trên 1 trang (mỗi cái scope riêng).

## 2. Entry point đã sẵn sàng

[`index.ts`](index.ts) đã re-export tất cả: `ThemeProvider`, `useTheme`, toàn bộ component, và lớp token (`presets`, `applyPreset`, `defaultConfig`, `resolveTokens`, type `DesignConfig`). Đây là file build chính.

## 3. Cấu trúc khuyến nghị (monorepo workspace)

Cách sạch nhất là tách thành package riêng để không kéo theo dependency của Next app:

```
packages/theme-ui/
  src/
    components/      # copy/di chuyển các file .tsx ở đây
    lib/             # copy lib/config + lib/tokens (đổi import @/lib → tương đối)
    index.ts
  package.json
  tsup.config.ts
  tsconfig.json
```

Bật workspace trong `pnpm-workspace.yaml`:
```yaml
packages:
  - "."
  - "packages/*"
```

> Lý do tách: hiện component import qua alias `@/lib/...`. Khi đóng gói, các import này phải nằm trong package. Tách workspace + đổi sang import tương đối là bền nhất; hoặc xem mục 5 để build ngay từ repo này mà không cần di chuyển file.

## 4. `package.json` của package

```jsonc
{
  "name": "@vinhhypc/config-theme",
  "version": "0.1.0",
  "type": "module",
  "sideEffects": false,
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

- `peerDependencies` cho React → tránh gói trùng React vào bundle.
- `files: ["dist"]` → chỉ publish output đã build.

## 5. Build bằng `tsc` (không cần esbuild/tsup)

> **Tại sao không dùng tsup?** Trên một số máy Windows, esbuild không spawn được tiến trình con (`spawn EPERM` — thường do antivirus/policy chặn `esbuild.exe`). Vì tsup chạy trên esbuild nên cũng fail. Cách dưới đây dùng `tsc` (biên dịch trong tiến trình, không spawn) → chạy được ở mọi máy.

Đã cấu hình sẵn trong [`tsconfig.lib.json`](../../tsconfig.lib.json):

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "outDir": "packages/theme-ui/dist",
    "rootDir": ".",
    "baseUrl": "."
  },
  "include": ["components/themed/index.ts"],
  "exclude": ["node_modules", "packages/*/dist", "**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"]
}
```

Script `build:lib` (trong `package.json` ở root):

```jsonc
"build:lib": "tsc -p tsconfig.lib.json && tsc-alias -p tsconfig.lib.json --resolve-full-paths"
```

- `tsc` emit ESM + `.d.ts` vào `packages/theme-ui/dist`. Directive `"use client"` ở từng file được giữ nguyên (chuẩn cho Next App Router — không cần banner).
- `tsc-alias` viết lại alias `@/lib/...` thành đường dẫn tương đối và thêm đuôi `.js` (tương thích cả bundler lẫn Node ESM).
- Lớp token (`lib/config`, `lib/tokens`) được emit kèm nên package **tự chứa**, người dùng chỉ cần React.

> **Định dạng output:** ESM-only (đúng chuẩn cho component lib tiêu thụ qua bundler như Next/Vite/webpack). Entry: `dist/components/themed/index.js` — đã trỏ đúng trong `exports` của package.

## 6. Lưu ý quan trọng

- **Font**: token `--font-base/heading/mono` chỉ khai báo `font-family`. Người dùng tự nạp web font tương ứng (Google Fonts / `next/font`). Có thể document danh sách font trong preset.
- **`"use client"`**: `ThemeProvider`, `DropdownMenu`, `Sheet`, `Calendar`, `Accordion`, `Checkbox` cần chạy ở client; directive đã có sẵn trong từng file và `tsc` giữ nguyên khi build.
- **SSR / FOUC**: stylesheet được inject inline ngay trong cây con của provider nên không nhấp nháy cho phần được bọc. Nếu muốn theme toàn cục tối ưu hơn, có thể trích `componentStyles("", config)` + `cssVarsToBlock(config)` ra 1 file `.css` tĩnh và import một lần (đánh đổi: mất khả năng đổi theme động).
- **Tree-shaking**: đã đặt `sideEffects: false`; component import lẻ sẽ được loại bỏ nếu không dùng.

## 7. Publish

> **Đã scaffold sẵn theo Mô hình A:** [`tsconfig.lib.json`](../../tsconfig.lib.json), [`packages/theme-ui/package.json`](../../packages/theme-ui/package.json), và script `build:lib` (tsc + tsc-alias, không cần esbuild). Package name đã đặt `@vinhhypc/config-theme` khớp tài khoản npm.

Phát hành qua **npm public**:

```bash
pnpm build:lib                 # tsc → packages/theme-ui/dist (ESM + .d.ts)
cd packages/theme-ui
npm pack --dry-run             # (tuỳ chọn) xem trước nội dung gói sẽ publish
npm login                      # đăng nhập tài khoản npm (user vinhhypc)
npm publish                    # access:public đã set sẵn trong publishConfig
```

Dự án khác cài:

```bash
npm i @vinhhypc/config-theme react react-dom
```

> `publishConfig.access = "public"` đã có sẵn nên không cần cờ `--access public`.
> `homepage` trỏ về Storybook đã deploy → trang npm sẽ link tới docs trực tiếp.

Xong — người khác chỉ cần:

```bash
npm i @vinhhypc/config-theme react react-dom
```

rồi bọc app trong `<ThemeProvider config={...}>` như mục 1.

---

# Cài 1 component hay toàn bộ ở dự án khác

Có 2 mô hình. Chọn theo nhu cầu.

## Mô hình A — Cài cả package qua npm (khuyến nghị)

Đây là cách chuẩn. Luôn cài **một** package, rồi import bao nhiêu tùy ý — phần không dùng bị tree-shaking loại bỏ (đã đặt `sideEffects: false`).

```bash
npm i @vinhhypc/config-theme react react-dom
```

**Dùng 1 component:**
```tsx
import { ThemeProvider, Button } from "@vinhhypc/config-theme";

<ThemeProvider config={config}>
  <Button>Chỉ dùng mỗi Button</Button>
</ThemeProvider>
```

**Dùng toàn bộ:** import thêm tên component bạn cần từ cùng package — không phải cài gì thêm.

> Lưu ý: `<ThemeProvider>` là **bắt buộc** cho mọi component (nó cấp CSS variables + stylesheet). Không có provider thì component hiện ra không có style.

### (Tuỳ chọn) Import theo đường dẫn con — `@vinhhypc/config-theme/button`

Nếu muốn import tường minh từng component, thêm nhiều entry khi build và khai báo `exports` dạng wildcard:

```ts
// tsup.config.ts — mỗi component 1 entry
export default defineConfig({
  entry: {
    index: "components/themed/index.ts",
    "components/Button": "components/themed/Button.tsx",
    "components/Card": "components/themed/Card.tsx",
    // …liệt kê các component khác
    ThemeProvider: "components/themed/ThemeProvider.tsx",
  },
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "react-dom"],
  banner: { js: '"use client";' },
});
```

```jsonc
// package.json
"exports": {
  ".": { "import": "./dist/index.js", "require": "./dist/index.cjs", "types": "./dist/index.d.ts" },
  "./*": { "import": "./dist/components/*.js", "require": "./dist/components/*.cjs", "types": "./dist/components/*.d.ts" }
}
```

```tsx
import { ThemeProvider } from "@vinhhypc/config-theme/ThemeProvider";
import { Button } from "@vinhhypc/config-theme/Button";
```

> Lưu ý: vẫn **tải về cả package** (chỉ là import gọn hơn). Về dung lượng bundle cuối, mô hình A đơn giản + tree-shaking đã đủ tốt cho hầu hết trường hợp.

## Mô hình B — Copy mã nguồn từng component vào dự án (kiểu shadcn/ui)

Khi muốn "cài đúng 1 component" và **sở hữu/chỉnh sửa** mã nguồn ngay trong repo của mình, không phụ thuộc package version.

Cách thủ công cho mỗi component, ví dụ Button — copy các file sau vào dự án đích:

```
Button.tsx                 # bản thân component
ThemeProvider.tsx          # provider (bắt buộc)
themeCss.ts                # themeVars + SEMANTIC_VARS
styles.ts                  # builder CSS
lib/config/  (types, defaults, presets, schema)
lib/tokens/  (color, typography, spacing, elevation, opacity, interactions, adapters, index)
```

rồi đổi các import `@/lib/...` cho khớp đường dẫn dự án đích, và cài `lucide-react` nếu component dùng icon.

Vì mọi component dùng chung `ThemeProvider` + lớp token, sau lần đầu, copy thêm component khác chỉ cần kéo file `.tsx` của nó (3 phần chung đã có sẵn).

### Tối ưu "1 component chỉ kéo CSS của nó"

Hiện `componentStyles()` gộp CSS tất cả component. Nếu muốn mỗi component chỉ phát CSS riêng (cho mô hình B hoặc để bundle gọn hơn ở mô hình A), tách như sau:

- Mỗi component export builder CSS riêng (đã có sẵn trong `styles.ts`: `buttonStyles`, `cardStyles`, …).
- Cho `ThemeProvider` nhận prop `styles` — danh sách builder cần inject, mặc định là tất cả:

```tsx
// phác thảo
<ThemeProvider config={config} styles={[buttonStyles]}>
  <Button>…</Button>
</ThemeProvider>
```

Đây là một refactor nhỏ; nói nếu bạn muốn mình làm.

### (Nâng cao) CLI/registry kiểu shadcn

Để `npx your-cli add button` tự copy file + dependency: dựng 1 "registry" (JSON liệt kê file của từng component và các phần phụ thuộc) rồi viết CLI copy theo registry. Hợp lý khi có nhiều người dùng nội bộ; nếu chỉ vài dự án thì copy thủ công như trên là đủ.

## Nên chọn cái nào?

| Nhu cầu | Chọn |
|---|---|
| Dùng nhanh, cập nhật qua version, không cần sửa | **A** (npm) |
| Cần sửa sâu component, muốn sở hữu mã nguồn | **B** (copy-in) |
| Import tường minh từng component | A + subpath exports |
| Mỗi component chỉ kéo CSS riêng | tách styles (mục trên) |
