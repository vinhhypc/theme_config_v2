"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { Moon, Sun } from "lucide-react";
import type { DesignConfig } from "@/lib/config/types";
import {
  cssVarsToStyleObject,
  resolveTokens,
  buttonHoverCss,
  cardHoverCss,
  activeCss,
  focusRingCss,
  HOVER_LABELS,
} from "@/lib/tokens";

type Mode = "light" | "dark";

/**
 * Renders sample components using the *configured* design tokens.
 * A scoped <style> block is injected so real :hover / :focus / :active states
 * work (inline styles cannot express pseudo-classes). A light/dark switch
 * mirrors the design system's configured `theme.mode`.
 */
export function LivePreview({ config }: { config: DesignConfig }) {
  const rawId = useId();
  const scope = "dsp" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const tokens = useMemo(() => resolveTokens(config), [config]);

  // Which mode can the user view? Respect the configured theme.mode.
  const canToggle = config.theme.mode === "both";
  const [mode, setMode] = useState<Mode>(config.theme.mode === "dark" ? "dark" : "light");
  const effectiveMode: Mode = config.theme.mode === "dark" ? "dark" : config.theme.mode === "light" ? "light" : mode;

  // Base CSS variables for the configured tokens + local semantic surface vars.
  const styleVars = useMemo(() => {
    const vars = cssVarsToStyleObject(config) as Record<string, string>;
    if (effectiveMode === "dark") {
      vars["--surface"] = "var(--color-neutral-900)";
      vars["--surface-2"] = "var(--color-neutral-800)";
      vars["--text"] = "var(--color-neutral-50)";
      vars["--text-muted"] = "var(--color-neutral-300)";
      vars["--border-c"] = "var(--color-neutral-700)";
    } else {
      vars["--surface"] = "var(--color-neutral-50)";
      vars["--surface-2"] = "#ffffff";
      vars["--text"] = "var(--color-neutral-900)";
      vars["--text-muted"] = "var(--color-neutral-600)";
      vars["--border-c"] = "var(--color-neutral-200)";
    }
    return vars as CSSProperties;
  }, [config, effectiveMode]);

  const css = useMemo(() => buildScopedCss(scope, config), [scope, config]);

  const variants = config.components.button.variants;
  const inputVariant = config.components.input.variant;

  return (
    <div className={scope} style={styleVars}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="dsp-root">
        {/* Header + theme switch */}
        <div className="dsp-head">
          <div>
            <h2 className="dsp-h2">Bảng thành phần</h2>
            <p className="dsp-muted">
              {config.theme.style} · {effectiveMode === "dark" ? "tối" : "sáng"} · hover: {HOVER_LABELS[config.interactions.hover]}
            </p>
          </div>
          {canToggle && (
            <button
              type="button"
              className="dsp-themebtn"
              onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
              aria-label="Đổi sáng/tối"
            >
              {effectiveMode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {effectiveMode === "dark" ? "Sáng" : "Tối"}
            </button>
          )}
        </div>

        {/* Buttons */}
        <Block title="Buttons">
          <div className="dsp-row">
            {variants.includes("primary") && <button className="dsp-btn dsp-btn--primary">Primary</button>}
            {variants.includes("secondary") && <button className="dsp-btn dsp-btn--secondary">Secondary</button>}
            {variants.includes("ghost") && <button className="dsp-btn dsp-btn--ghost">Ghost</button>}
            <button className="dsp-btn dsp-btn--outline">Outline</button>
            {variants.includes("destructive") && <button className="dsp-btn dsp-btn--destructive">Destructive</button>}
          </div>
          <div className="dsp-row">
            <button className="dsp-btn dsp-btn--primary dsp-btn--sm">Small</button>
            <button className="dsp-btn dsp-btn--primary">Medium</button>
            <button className="dsp-btn dsp-btn--primary dsp-btn--lg">Large</button>
            <button className="dsp-btn dsp-btn--primary" disabled>Disabled</button>
          </div>
          <p className="dsp-hint">Rê chuột / focus bằng phím Tab để xem hiệu ứng tương tác.</p>
        </Block>

        {/* Form controls */}
        <Block title="Form">
          <div className="dsp-grid2">
            <label className="dsp-field">
              <span>Email</span>
              <input className={`dsp-input dsp-input--${inputVariant}`} placeholder="you@example.com" />
            </label>
            <label className="dsp-field">
              <span>Mật khẩu (lỗi)</span>
              <input className={`dsp-input dsp-input--${inputVariant} dsp-input--error`} type="password" defaultValue="123" />
              <em className="dsp-err">Tối thiểu 8 ký tự.</em>
            </label>
            <label className="dsp-field">
              <span>Vai trò</span>
              <select className={`dsp-input dsp-input--${inputVariant}`} defaultValue="admin">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </label>
            <label className="dsp-field">
              <span>Bị khoá</span>
              <input className={`dsp-input dsp-input--${inputVariant}`} placeholder="Disabled" disabled />
            </label>
          </div>
          <label className="dsp-field">
            <span>Ghi chú</span>
            <textarea className={`dsp-input dsp-input--${inputVariant}`} rows={2} placeholder="Nhập nội dung…" />
          </label>
          <div className="dsp-row dsp-row--mid">
            <span className="dsp-check"><span className="dsp-check__box dsp-check__box--on" />Đồng ý điều khoản</span>
            <span className="dsp-check"><span className="dsp-radio dsp-radio--on" />Gói tháng</span>
            <span className="dsp-check"><span className="dsp-radio" />Gói năm</span>
            <span className="dsp-check"><span className="dsp-switch dsp-switch--on" />Bật thông báo</span>
          </div>
        </Block>

        {/* Cards */}
        <Block title="Cards">
          <div className="dsp-grid3">
            <article className="dsp-card dsp-card--elevated">
              <h3 className="dsp-h3">Elevated</h3>
              <p className="dsp-muted">Có đổ bóng, nâng nhẹ khi hover.</p>
              <div className="dsp-card__foot">
                <button className="dsp-btn dsp-btn--primary dsp-btn--sm">Hành động</button>
              </div>
            </article>
            <article className="dsp-card dsp-card--outlined">
              <h3 className="dsp-h3">Outlined</h3>
              <p className="dsp-muted">Chỉ có viền theo token màu.</p>
              <div className="dsp-card__foot">
                <button className="dsp-btn dsp-btn--outline dsp-btn--sm">Hành động</button>
              </div>
            </article>
            <article className="dsp-card dsp-card--flat">
              <h3 className="dsp-h3">Flat</h3>
              <p className="dsp-muted">Nền phẳng, không bóng đổ.</p>
              <div className="dsp-card__foot">
                <a className="dsp-link" href="#" onClick={(e) => e.preventDefault()}>Tìm hiểu thêm →</a>
              </div>
            </article>
          </div>
          <p className="dsp-hint">Card hiện đang dùng biến thể <b>{config.components.card.variant}</b> trong export.</p>
        </Block>

        {/* Badges & alerts */}
        {config.components.badge.enabled && (
          <Block title="Badges & Alerts">
            <div className="dsp-row">
              {(["success", "warning", "error", "info"] as const).map((r) => (
                <span key={r} className={`dsp-badge dsp-badge--${r}`}>{r}</span>
              ))}
              <span className="dsp-badge dsp-badge--solid">primary</span>
            </div>
            <div className="dsp-alerts">
              {(["success", "warning", "error", "info"] as const).map((r) => (
                <div key={r} className={`dsp-alert dsp-alert--${r}`}>
                  <strong>{r}</strong> — thông báo trạng thái mẫu.
                </div>
              ))}
            </div>
          </Block>
        )}

        {/* Tabs + progress */}
        <Block title="Tabs & Progress">
          <div className="dsp-tabs">
            <span className="dsp-tab dsp-tab--active">Tổng quan</span>
            <span className="dsp-tab">Hoạt động</span>
            <span className="dsp-tab">Cài đặt</span>
          </div>
          <div className="dsp-progress"><span className="dsp-progress__bar" style={{ width: "62%" }} /></div>
          <input className="dsp-range" type="range" defaultValue={62} aria-label="Mẫu thanh trượt" />
        </Block>

        {/* Avatars */}
        <Block title="Avatars">
          <div className="dsp-row dsp-row--mid">
            <span className="dsp-avatar">AD</span>
            <span className="dsp-avatar dsp-avatar--accent">VN</span>
            <span className="dsp-avatar dsp-avatar--soft">+5</span>
            <span className="dsp-badge dsp-badge--success">● online</span>
          </div>
        </Block>

        {/* Modal */}
        {config.components.modal.enabled && (
          <Block title="Modal">
            <div className="dsp-modalwrap">
              <div className="dsp-modal" role="dialog" aria-label="Modal mẫu">
                <h3 className="dsp-h3">Xác nhận xoá?</h3>
                <p className="dsp-muted">Hành động này không thể hoàn tác.</p>
                <div className="dsp-row dsp-row--end">
                  <button className="dsp-btn dsp-btn--ghost dsp-btn--sm">Huỷ</button>
                  <button className="dsp-btn dsp-btn--destructive dsp-btn--sm">Xoá</button>
                </div>
              </div>
            </div>
          </Block>
        )}

        {/* Table */}
        {config.components.table.enabled && (
          <Block title="Table">
            <table className="dsp-table">
              <thead>
                <tr><th>Tên</th><th>Vai trò</th><th>Trạng thái</th></tr>
              </thead>
              <tbody>
                <tr><td>Ada Lovelace</td><td>Admin</td><td><span className="dsp-badge dsp-badge--success">active</span></td></tr>
                <tr><td>Alan Turing</td><td>Editor</td><td><span className="dsp-badge dsp-badge--warning">pending</span></td></tr>
                <tr><td>Grace Hopper</td><td>Viewer</td><td><span className="dsp-badge dsp-badge--error">blocked</span></td></tr>
              </tbody>
            </table>
          </Block>
        )}

        {/* Typography */}
        <Block title="Typography">
          <div className="dsp-type">
            {tokens.type.slice().reverse().map((t) => (
              <div key={t.token} className="dsp-typerow">
                <span className="dsp-muted dsp-typetag">{t.token} · {t.px}px</span>
                <span style={{ fontSize: `${t.px}px`, fontFamily: t.token.includes("xl") || t.token.includes("2xl") || t.token.includes("3xl") || t.token.includes("4xl") ? "var(--font-heading)" : "var(--font-base)" }}>
                  {t.role}
                </span>
              </div>
            ))}
          </div>
        </Block>

        {/* Color scales */}
        <Block title="Color scale">
          <div className="dsp-scales">
            {(["primary", "secondary", "accent", "neutral", "success", "error"] as const).map((role) => (
              <div key={role} className="dsp-scalerow">
                <span className="dsp-muted dsp-scaletag">{role}</span>
                <div className="dsp-swatches">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
                    <span
                      key={step}
                      title={`${role}-${step}: ${tokens.colorScales[role][step]}`}
                      style={{ background: `var(--color-${role}-${step})` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="dsp-block">
      <h4 className="dsp-blocktitle">{title}</h4>
      {children}
    </section>
  );
}

/** Build the scoped stylesheet for the preview. All selectors are prefixed by `.${scope}`. */
function buildScopedCss(scope: string, config: DesignConfig): string {
  const i = config.interactions;
  const transition = "transition: all var(--duration) var(--easing);";
  const focus = focusRingCss(i.focusRing);
  const active = activeCss(i.pressFeedback);
  const btnHover = (colorVar: string) => buttonHoverCss(i.hover, colorVar);
  const cardHover = cardHoverCss(i.hover);
  const ghostHover =
    i.hover === "darken"
      ? "background: var(--color-primary-50);"
      : buttonHoverCss(i.hover, "--color-primary");
  const linkHover = i.underlineLinks ? "text-decoration: underline;" : "";
  const p = `.${scope}`;

  return `
${p} .dsp-root { font-family: var(--font-base); color: var(--text); background: var(--surface); padding: var(--space-6); display: grid; gap: var(--space-6); border-radius: var(--radius-lg); }
${p} .dsp-head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); }
${p} .dsp-h2 { font-family: var(--font-heading); font-size: ${Math.round(config.typography.baseSize * Math.pow(config.typography.scaleRatio, 3))}px; margin: 0; color: var(--text); }
${p} .dsp-h3 { font-family: var(--font-heading); font-size: ${Math.round(config.typography.baseSize * Math.pow(config.typography.scaleRatio, 1))}px; margin: 0 0 var(--space-2); color: var(--text); }
${p} .dsp-muted { color: var(--text-muted); margin: var(--space-1) 0 0; font-size: ${config.typography.baseSize - 2}px; }
${p} .dsp-hint { color: var(--text-muted); font-size: ${config.typography.baseSize - 3}px; font-style: italic; margin: 0; }
${p} .dsp-block { display: grid; gap: var(--space-3); }
${p} .dsp-blocktitle { text-transform: uppercase; letter-spacing: .06em; font-size: 11px; color: var(--text-muted); margin: 0; border-top: 1px solid var(--border-c); padding-top: var(--space-3); }
${p} .dsp-row { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; }
${p} .dsp-row--mid { align-items: center; }
${p} .dsp-row--end { justify-content: flex-end; width: 100%; }
${p} .dsp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
${p} .dsp-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
@media (max-width: 640px) { ${p} .dsp-grid2, ${p} .dsp-grid3 { grid-template-columns: 1fr; } }

/* Buttons */
${p} .dsp-btn { font-family: var(--font-base); font-weight: 600; font-size: ${config.typography.baseSize - 1}px; padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) transparent; cursor: pointer; ${transition} }
${p} .dsp-btn:focus-visible { ${focus} }
${p} .dsp-btn:active { ${active} }
${p} .dsp-btn[disabled] { opacity: .5; pointer-events: none; }
${p} .dsp-btn--sm { padding: var(--space-1) var(--space-3); font-size: ${config.typography.baseSize - 3}px; }
${p} .dsp-btn--lg { padding: var(--space-3) var(--space-6); font-size: ${config.typography.baseSize + 1}px; }
${p} .dsp-btn--primary { background: var(--color-primary-600); color: #fff; }
${p} .dsp-btn--primary:hover { ${btnHover("--color-primary")} }
${p} .dsp-btn--secondary { background: var(--color-secondary-600); color: #fff; }
${p} .dsp-btn--secondary:hover { ${btnHover("--color-secondary")} }
${p} .dsp-btn--destructive { background: var(--color-error-600); color: #fff; }
${p} .dsp-btn--destructive:hover { ${btnHover("--color-error")} }
${p} .dsp-btn--ghost { background: transparent; color: var(--color-primary-700); }
${p} .dsp-btn--ghost:hover { ${ghostHover} }
${p} .dsp-btn--outline { background: transparent; color: var(--text); border-color: var(--border-c); }
${p} .dsp-btn--outline:hover { ${ghostHover} border-color: var(--color-primary-400); }

/* Inputs */
${p} .dsp-field { display: grid; gap: var(--space-1); font-size: ${config.typography.baseSize - 2}px; color: var(--text-muted); }
${p} .dsp-field > span { color: var(--text); }
${p} .dsp-input { font-family: var(--font-base); font-size: ${config.typography.baseSize - 1}px; color: var(--text); background: var(--surface-2); padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) var(--border-c); ${transition} width: 100%; }
${p} .dsp-input:hover { border-color: var(--color-primary-400); }
${p} .dsp-input:focus-visible { outline: none; border-color: var(--color-primary-500); }
${p} .dsp-input[disabled] { opacity: .5; }
${p} .dsp-input--filled { background: var(--color-neutral-100); border-color: transparent; }
${p} .dsp-input--underline { background: transparent; border: 0; border-bottom: var(--border-width) var(--border-style) var(--border-c); border-radius: 0; }
${p} .dsp-input--error { border-color: var(--color-error-500); }
${p} .dsp-err { color: var(--color-error-600); font-style: normal; font-size: ${config.typography.baseSize - 3}px; }

/* Checks / radio / switch */
${p} .dsp-check { display: inline-flex; align-items: center; gap: var(--space-2); font-size: ${config.typography.baseSize - 2}px; color: var(--text); }
${p} .dsp-check__box { width: 16px; height: 16px; border-radius: var(--radius-sm); border: var(--border-width) var(--border-style) var(--border-c); display: inline-block; }
${p} .dsp-check__box--on { background: var(--color-primary-600); border-color: var(--color-primary-600); }
${p} .dsp-radio { width: 16px; height: 16px; border-radius: 9999px; border: var(--border-width) var(--border-style) var(--border-c); display: inline-block; }
${p} .dsp-radio--on { border-color: var(--color-primary-600); box-shadow: inset 0 0 0 4px var(--color-primary-600); }
${p} .dsp-switch { width: 34px; height: 18px; border-radius: 9999px; background: var(--color-neutral-300); position: relative; display: inline-block; ${transition} }
${p} .dsp-switch::after { content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 9999px; background: #fff; ${transition} }
${p} .dsp-switch--on { background: var(--color-primary-600); }
${p} .dsp-switch--on::after { left: 18px; }

/* Cards */
${p} .dsp-card { padding: var(--space-5, 20px); border-radius: var(--radius-lg); background: var(--surface-2); ${transition} display: flex; flex-direction: column; gap: var(--space-2, 8px); }
${p} .dsp-card .dsp-h3 { margin: 0; }
${p} .dsp-card .dsp-muted { margin: 0; flex: 1 1 auto; }
${p} .dsp-card__foot { margin-top: var(--space-3, 12px); }
${p} .dsp-card:hover { ${cardHover} }
${p} .dsp-card--elevated { box-shadow: var(--shadow-2, 0 4px 12px rgba(0,0,0,.10)); }
${p} .dsp-card--outlined { border: var(--border-width) var(--border-style) var(--border-c); box-shadow: none; background: var(--surface-2); }
${p} .dsp-card--flat { background: var(--color-neutral-100); box-shadow: none; }

/* Link */
${p} .dsp-link { color: var(--color-primary-600); text-decoration: none; font-size: ${config.typography.baseSize - 1}px; ${transition} }
${p} .dsp-link:hover { ${linkHover} color: var(--color-primary-700); }

/* Badges */
${p} .dsp-badge { display: inline-flex; align-items: center; gap: 4px; padding: var(--space-1) var(--space-2); border-radius: var(--radius-pill); font-size: ${config.typography.baseSize - 4}px; font-weight: 600; }
${p} .dsp-badge--solid { background: var(--color-primary-600); color: #fff; }
${p} .dsp-badge--success { background: var(--color-success-100); color: var(--color-success-700); }
${p} .dsp-badge--warning { background: var(--color-warning-100); color: var(--color-warning-700); }
${p} .dsp-badge--error { background: var(--color-error-100); color: var(--color-error-700); }
${p} .dsp-badge--info { background: var(--color-info-100); color: var(--color-info-700); }

/* Alerts */
${p} .dsp-alerts { display: grid; gap: var(--space-2); }
${p} .dsp-alert { padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); font-size: ${config.typography.baseSize - 2}px; border-left: 3px solid; }
${p} .dsp-alert--success { background: var(--color-success-50); color: var(--color-success-800); border-color: var(--color-success-500); }
${p} .dsp-alert--warning { background: var(--color-warning-50); color: var(--color-warning-800); border-color: var(--color-warning-500); }
${p} .dsp-alert--error { background: var(--color-error-50); color: var(--color-error-800); border-color: var(--color-error-500); }
${p} .dsp-alert--info { background: var(--color-info-50); color: var(--color-info-800); border-color: var(--color-info-500); }

/* Tabs */
${p} .dsp-tabs { display: inline-flex; gap: 2px; padding: 3px; background: var(--color-neutral-100); border-radius: var(--radius-md); }
${p} .dsp-tab { padding: var(--space-1) var(--space-3); border-radius: var(--radius-sm); font-size: ${config.typography.baseSize - 2}px; color: var(--text-muted); cursor: pointer; ${transition} }
${p} .dsp-tab:hover { color: var(--text); }
${p} .dsp-tab--active { background: var(--surface-2); color: var(--text); box-shadow: var(--shadow-1); }

/* Progress + range */
${p} .dsp-progress { height: 8px; background: var(--color-neutral-200); border-radius: var(--radius-pill); overflow: hidden; }
${p} .dsp-progress__bar { display: block; height: 100%; background: var(--color-primary-600); }
${p} .dsp-range { width: 100%; accent-color: var(--color-primary-600); }

/* Avatars */
${p} .dsp-avatar { width: 36px; height: 36px; border-radius: 9999px; background: var(--color-primary-600); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
${p} .dsp-avatar--accent { background: var(--color-accent-500); }
${p} .dsp-avatar--soft { background: var(--color-neutral-200); color: var(--text); }

/* Modal */
${p} .dsp-modalwrap { background: var(--color-neutral-900); opacity: 1; border-radius: var(--radius-lg); padding: var(--space-6); display: grid; place-items: center; background-image: linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35)); }
${p} .dsp-modal { background: var(--surface-2); border-radius: var(--radius-lg); box-shadow: var(--shadow-3, 0 12px 32px rgba(0,0,0,.18)); padding: var(--space-5, 20px); display: grid; gap: var(--space-2, 8px); min-width: 260px; }

/* Table */
${p} .dsp-table { width: 100%; border-collapse: collapse; font-size: ${config.typography.baseSize - 2}px; }
${p} .dsp-table th, ${p} .dsp-table td { text-align: left; padding: var(--space-2) var(--space-3); border-bottom: var(--border-width) var(--border-style) var(--border-c); }
${p} .dsp-table th { color: var(--text-muted); font-weight: 600; background: var(--color-neutral-100); }
${p} .dsp-table tbody tr { ${transition} }
${p} .dsp-table tbody tr:hover { background: var(--color-primary-50); }

/* Typography preview */
${p} .dsp-type { display: grid; gap: var(--space-2); }
${p} .dsp-typerow { display: flex; align-items: baseline; gap: var(--space-3); }
${p} .dsp-typetag { min-width: 120px; font-size: 11px; }

/* Color scale */
${p} .dsp-scales { display: grid; gap: var(--space-2); }
${p} .dsp-scalerow { display: flex; align-items: center; gap: var(--space-2); }
${p} .dsp-scaletag { width: 72px; font-size: 12px; }
${p} .dsp-swatches { display: flex; flex: 1; border-radius: var(--radius-sm); overflow: hidden; }
${p} .dsp-swatches > span { height: 22px; flex: 1; }

/* Theme button */
${p} .dsp-themebtn { display: inline-flex; align-items: center; gap: 6px; padding: var(--space-1) var(--space-3); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) var(--border-c); background: var(--surface-2); color: var(--text); font-size: 13px; cursor: pointer; ${transition} }
${p} .dsp-themebtn:hover { border-color: var(--color-primary-400); }

@media (prefers-reduced-motion: reduce) { ${p} * { transition: none !important; } }
`;
}
