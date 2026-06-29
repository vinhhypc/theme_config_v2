/**
 * Token-driven stylesheet for every showcase component. Each builder prefixes
 * its selectors with `p` (e.g. ".scope " for a scoped surface, or "" for a
 * global sheet) and reads values from the design config / CSS vars, so the
 * components re-theme automatically. `componentStyles` concatenates them all;
 * `<ThemedSurface>` injects the result.
 */
import type { DesignConfig } from "@/lib/config/types";
import { buttonHoverCss, cardHoverCss, activeCss, focusRingCss } from "@/lib/tokens";

function helpers(config: DesignConfig) {
  const i = config.interactions;
  return {
    base: config.typography.baseSize,
    transition: "transition: all var(--duration) var(--easing);",
    focus: focusRingCss(i.focusRing),
    active: activeCss(i.pressFeedback),
    btnHover: (c: string) => buttonHoverCss(i.hover, c),
    ghostHover:
      i.hover === "darken"
        ? "background: var(--color-primary-50);"
        : buttonHoverCss(i.hover, "--color-primary"),
    cardHover: cardHoverCss(i.hover),
  };
}

/* ------------------------------- Button ------------------------------- */
export function buttonStyles(p: string, config: DesignConfig): string {
  const { base, transition, focus, active, btnHover, ghostHover } = helpers(config);
  return `
${p}.tcb { font-family: var(--font-base); font-weight: 600; font-size: ${base - 1}px; padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2); line-height: 1.2; ${transition} }
${p}.tcb:focus-visible { ${focus} }
${p}.tcb:active { ${active} }
${p}.tcb[disabled] { opacity: .5; pointer-events: none; }
${p}.tcb--sm { padding: var(--space-1) var(--space-3); font-size: ${base - 3}px; }
${p}.tcb--lg { padding: var(--space-3) var(--space-6); font-size: ${base + 1}px; }
${p}.tcb--primary { background: var(--color-primary-600); color: #fff; }
${p}.tcb--primary:hover { ${btnHover("--color-primary")} }
${p}.tcb--secondary { background: var(--color-secondary-600); color: #fff; }
${p}.tcb--secondary:hover { ${btnHover("--color-secondary")} }
${p}.tcb--destructive { background: var(--color-error-600); color: #fff; }
${p}.tcb--destructive:hover { ${btnHover("--color-error")} }
${p}.tcb--ghost { background: transparent; color: var(--color-primary-700); }
${p}.tcb--ghost:hover { ${ghostHover} }
${p}.tcb--outline { background: transparent; color: var(--text); border-color: var(--border-c); }
${p}.tcb--outline:hover { ${ghostHover} border-color: var(--color-primary-400); }`;
}

/* -------------------------- Input / Select --------------------------- */
export function inputStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tci { font-family: var(--font-base); font-size: ${base - 1}px; color: var(--text); background: var(--surface-2); padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) var(--border-c); ${transition} width: 100%; }
${p}.tci:hover { border-color: var(--color-primary-400); }
${p}.tci:focus-visible { outline: none; border-color: var(--color-primary-500); }
${p}.tci[disabled] { opacity: .5; }
${p}.tci--filled { background: var(--color-neutral-100); border-color: transparent; }
${p}.tci--underline { background: transparent; border: 0; border-bottom: var(--border-width) var(--border-style) var(--border-c); border-radius: 0; }
${p}.tci--error { border-color: var(--color-error-500); }
${p}.tc-field { display: grid; gap: var(--space-1); font-size: ${base - 2}px; color: var(--text-muted); }
${p}.tc-field > span { color: var(--text); }`;
}

/* ------------------------------ Checkbox ----------------------------- */
export function checkboxStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-checkbox { display: inline-flex; align-items: center; gap: var(--space-2); font-size: ${base - 1}px; color: var(--text); cursor: pointer; user-select: none; }
${p}.tc-checkbox input { position: absolute; opacity: 0; width: 0; height: 0; }
${p}.tc-checkbox__box { width: 18px; height: 18px; border-radius: var(--radius-sm); border: var(--border-width) var(--border-style) var(--border-c); display: inline-flex; align-items: center; justify-content: center; color: #fff; ${transition} }
${p}.tc-checkbox__box svg { width: 12px; height: 12px; opacity: 0; }
${p}.tc-checkbox[data-checked="true"] .tc-checkbox__box { background: var(--color-primary-600); border-color: var(--color-primary-600); }
${p}.tc-checkbox[data-checked="true"] .tc-checkbox__box svg { opacity: 1; }
${p}.tc-checkbox input:focus-visible + .tc-checkbox__box { outline: 2px solid var(--color-primary-500); outline-offset: 2px; }
${p}.tc-checkbox[data-disabled="true"] { opacity: .5; pointer-events: none; }`;
}

/* ------------------------------- Badge ------------------------------- */
export function badgeStyles(p: string, config: DesignConfig): string {
  const { base } = helpers(config);
  return `
${p}.tc-badge { display: inline-flex; align-items: center; gap: 4px; padding: var(--space-1) var(--space-2); border-radius: var(--radius-pill); font-size: ${base - 4}px; font-weight: 600; line-height: 1.4; }
${p}.tc-badge--solid { background: var(--color-primary-600); color: #fff; }
${p}.tc-badge--neutral { background: var(--color-neutral-200); color: var(--text); }
${p}.tc-badge--success { background: var(--color-success-100); color: var(--color-success-700); }
${p}.tc-badge--warning { background: var(--color-warning-100); color: var(--color-warning-700); }
${p}.tc-badge--error { background: var(--color-error-100); color: var(--color-error-700); }
${p}.tc-badge--info { background: var(--color-info-100); color: var(--color-info-700); }`;
}

/* ------------------------------- Alert ------------------------------- */
export function alertStyles(p: string, config: DesignConfig): string {
  const { base } = helpers(config);
  return `
${p}.tc-alert { padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); font-size: ${base - 1}px; border-left: 3px solid; display: grid; gap: 2px; }
${p}.tc-alert__title { font-weight: 600; }
${p}.tc-alert--success { background: var(--color-success-50); color: var(--color-success-800); border-color: var(--color-success-500); }
${p}.tc-alert--warning { background: var(--color-warning-50); color: var(--color-warning-800); border-color: var(--color-warning-500); }
${p}.tc-alert--error { background: var(--color-error-50); color: var(--color-error-800); border-color: var(--color-error-500); }
${p}.tc-alert--info { background: var(--color-info-50); color: var(--color-info-800); border-color: var(--color-info-500); }`;
}

/* ------------------------------ Avatar ------------------------------- */
export function avatarStyles(p: string): string {
  return `
${p}.tc-avatar { width: 40px; height: 40px; border-radius: 9999px; background: var(--color-primary-600); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; overflow: hidden; }
${p}.tc-avatar img { width: 100%; height: 100%; object-fit: cover; }
${p}.tc-avatar--sm { width: 28px; height: 28px; font-size: 11px; }
${p}.tc-avatar--lg { width: 56px; height: 56px; font-size: 18px; }
${p}.tc-avatar--accent { background: var(--color-accent-500); }
${p}.tc-avatar--soft { background: var(--color-neutral-200); color: var(--text); }`;
}

/* ------------------------------- Card -------------------------------- */
export function cardStyles(p: string, config: DesignConfig): string {
  const { base, transition, cardHover } = helpers(config);
  return `
${p}.tc-card { padding: var(--space-5, 20px); border-radius: var(--radius-lg); background: var(--surface-2); ${transition} display: flex; flex-direction: column; gap: var(--space-2, 8px); }
${p}.tc-card:hover { ${cardHover} }
${p}.tc-card--elevated { box-shadow: var(--shadow-2, 0 4px 12px rgba(0,0,0,.10)); }
${p}.tc-card--outlined { border: var(--border-width) var(--border-style) var(--border-c); box-shadow: none; }
${p}.tc-card--flat { background: var(--color-neutral-100); box-shadow: none; }
${p}.tc-card__title { font-family: var(--font-heading); font-size: ${base + 2}px; font-weight: 600; margin: 0; }
${p}.tc-card__body { color: var(--text-muted); font-size: ${base - 1}px; margin: 0; flex: 1 1 auto; }
${p}.tc-card__foot { margin-top: var(--space-3, 12px); display: flex; gap: var(--space-2); }`;
}

/* ------------------------------- Table ------------------------------- */
export function tableStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-table { width: 100%; border-collapse: collapse; font-size: ${base - 2}px; color: var(--text); }
${p}.tc-table th, ${p}.tc-table td { text-align: left; padding: var(--space-2) var(--space-3); border-bottom: var(--border-width) var(--border-style) var(--border-c); }
${p}.tc-table th { color: var(--text-muted); font-weight: 600; background: var(--color-neutral-100); }
${p}.tc-table tbody tr { ${transition} }
${p}.tc-table tbody tr:hover { background: var(--color-primary-50); }`;
}

/* ----------------------------- Progress ------------------------------ */
export function progressStyles(p: string): string {
  return `
${p}.tc-progress { height: 8px; background: var(--color-neutral-200); border-radius: var(--radius-pill); overflow: hidden; width: 100%; }
${p}.tc-progress__bar { display: block; height: 100%; background: var(--color-primary-600); transition: width var(--duration) var(--easing); }`;
}

/* ------------------------------- Spin -------------------------------- */
export function spinStyles(p: string): string {
  return `
@keyframes tc-spin { to { transform: rotate(360deg); } }
${p}.tc-spin { display: inline-block; width: 24px; height: 24px; border-radius: 9999px; border: 2px solid var(--color-neutral-200); border-top-color: var(--color-primary-600); animation: tc-spin .7s linear infinite; }
${p}.tc-spin--sm { width: 16px; height: 16px; }
${p}.tc-spin--lg { width: 36px; height: 36px; border-width: 3px; }
@media (prefers-reduced-motion: reduce) { ${p}.tc-spin { animation-duration: 2s; } }`;
}

/* ------------------------------- Tabs -------------------------------- */
export function tabsStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-tabs__list { display: inline-flex; gap: 2px; padding: 3px; background: var(--color-neutral-100); border-radius: var(--radius-md); }
${p}.tc-tab { padding: var(--space-1) var(--space-3); border: 0; background: transparent; border-radius: var(--radius-sm); font-size: ${base - 2}px; color: var(--text-muted); cursor: pointer; font-family: var(--font-base); ${transition} }
${p}.tc-tab:hover { color: var(--text); }
${p}.tc-tab--active { background: var(--surface-2); color: var(--text); box-shadow: var(--shadow-1); }
${p}.tc-tabs__panel { padding: var(--space-3) 0; font-size: ${base - 1}px; color: var(--text); }`;
}

/* ------------------------------ Tooltip ------------------------------ */
export function tooltipStyles(p: string, config: DesignConfig): string {
  const { base } = helpers(config);
  return `
${p}.tc-tooltip { position: relative; display: inline-flex; }
${p}.tc-tooltip__pop { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: var(--color-neutral-900); color: var(--color-neutral-50); padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); font-size: ${base - 4}px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity var(--duration) var(--easing); z-index: 30; }
${p}.tc-tooltip:hover .tc-tooltip__pop, ${p}.tc-tooltip:focus-within .tc-tooltip__pop { opacity: 1; }
${p}.tc-tooltip__pop::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 4px solid transparent; border-top-color: var(--color-neutral-900); }`;
}

/* ------------------------------ Dropdown ----------------------------- */
export function dropdownStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-dropdown { position: relative; display: inline-flex; }
${p}.tc-dropdown__menu { position: absolute; top: calc(100% + 6px); left: 0; min-width: 180px; background: var(--surface-2); border: var(--border-width) var(--border-style) var(--border-c); border-radius: var(--radius-md); box-shadow: var(--shadow-3, 0 12px 32px rgba(0,0,0,.18)); padding: var(--space-1); z-index: 20; display: grid; gap: 2px; }
${p}.tc-dropdown__item { text-align: left; border: 0; background: transparent; font-family: var(--font-base); font-size: ${base - 1}px; color: var(--text); padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); cursor: pointer; ${transition} }
${p}.tc-dropdown__item:hover { background: var(--color-primary-50); color: var(--color-primary-700); }`;
}

/* ----------------------- Dialog / Drawer overlay --------------------- */
export function overlayStyles(p: string, config: DesignConfig): string {
  const { base } = helpers(config);
  return `
${p}.tc-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: grid; place-items: center; z-index: 50; }
${p}.tc-dialog { background: var(--surface-2); color: var(--text); border-radius: var(--radius-lg); box-shadow: var(--shadow-3, 0 12px 32px rgba(0,0,0,.18)); padding: var(--space-5, 20px); display: grid; gap: var(--space-2, 8px); min-width: 300px; max-width: 92vw; }
${p}.tc-dialog__title { font-family: var(--font-heading); font-size: ${base + 2}px; font-weight: 600; margin: 0; }
${p}.tc-dialog__body { color: var(--text-muted); font-size: ${base - 1}px; margin: 0; }
${p}.tc-dialog__foot { margin-top: var(--space-3); display: flex; justify-content: flex-end; gap: var(--space-2); }
${p}.tc-drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 50; }
${p}.tc-drawer { position: fixed; top: 0; bottom: 0; width: min(360px, 90vw); background: var(--surface-2); color: var(--text); box-shadow: var(--shadow-3, 0 12px 32px rgba(0,0,0,.18)); padding: var(--space-5, 20px); display: grid; gap: var(--space-3); align-content: start; z-index: 51; }
${p}.tc-drawer--right { right: 0; }
${p}.tc-drawer--left { left: 0; }
${p}.tc-dialog__title + .tc-dialog__body { margin-top: -4px; }`;
}

/* ----------------------------- Pagination ---------------------------- */
export function paginationStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-pagination { display: inline-flex; gap: var(--space-1); align-items: center; }
${p}.tc-page { min-width: 32px; height: 32px; padding: 0 var(--space-2); border-radius: var(--radius-md); border: var(--border-width) var(--border-style) var(--border-c); background: var(--surface-2); color: var(--text); font-size: ${base - 2}px; font-family: var(--font-base); cursor: pointer; ${transition} }
${p}.tc-page:hover:not([disabled]) { border-color: var(--color-primary-400); }
${p}.tc-page--active { background: var(--color-primary-600); border-color: var(--color-primary-600); color: #fff; }
${p}.tc-page[disabled] { opacity: .5; cursor: default; }`;
}

/* ------------------------------ Calendar ----------------------------- */
export function calendarStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-cal { background: var(--surface-2); border: var(--border-width) var(--border-style) var(--border-c); border-radius: var(--radius-lg); padding: var(--space-4); width: 280px; display: grid; gap: var(--space-3); }
${p}.tc-cal__head { display: flex; align-items: center; justify-content: space-between; }
${p}.tc-cal__title { font-weight: 600; font-size: ${base - 1}px; color: var(--text); }
${p}.tc-cal__nav { width: 28px; height: 28px; border-radius: var(--radius-md); border: var(--border-width) var(--border-style) var(--border-c); background: var(--surface-2); color: var(--text); cursor: pointer; ${transition} }
${p}.tc-cal__nav:hover { border-color: var(--color-primary-400); }
${p}.tc-cal__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
${p}.tc-cal__dow { text-align: center; font-size: ${base - 5}px; color: var(--text-muted); padding: 2px 0; }
${p}.tc-cal__day { aspect-ratio: 1; border: 0; background: transparent; border-radius: var(--radius-sm); font-size: ${base - 3}px; color: var(--text); cursor: pointer; font-family: var(--font-base); ${transition} }
${p}.tc-cal__day:hover { background: var(--color-primary-50); }
${p}.tc-cal__day--muted { color: var(--text-muted); opacity: .45; }
${p}.tc-cal__day--today { box-shadow: inset 0 0 0 1px var(--color-primary-400); }
${p}.tc-cal__day--selected { background: var(--color-primary-600); color: #fff; }
${p}.tc-cal__day--selected:hover { background: var(--color-primary-600); }`;
}

/* ------------------------------ Sidebar ------------------------------ */
export function sidebarStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-sidebar { width: 220px; background: var(--surface-2); border: var(--border-width) var(--border-style) var(--border-c); border-radius: var(--radius-lg); padding: var(--space-3); display: grid; gap: 2px; align-content: start; }
${p}.tc-sidebar__title { font-size: ${base - 5}px; text-transform: uppercase; letter-spacing: .06em; color: var(--text-muted); padding: var(--space-1) var(--space-2); margin: 0; }
${p}.tc-sidebar__item { display: flex; align-items: center; gap: var(--space-2); width: 100%; text-align: left; padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); border: 0; background: transparent; font-family: var(--font-base); font-size: ${base - 1}px; color: var(--text); cursor: pointer; ${transition} }
${p}.tc-sidebar__item:hover { background: var(--color-primary-50); }
${p}.tc-sidebar__item--active { background: var(--color-primary-600); color: #fff; }
${p}.tc-sidebar__item--active:hover { background: var(--color-primary-600); }`;
}

/* ------------------------------- Toast ------------------------------- */
export function toastStyles(p: string, config: DesignConfig): string {
  const { base } = helpers(config);
  return `
${p}.tc-toast { display: flex; align-items: flex-start; gap: var(--space-3); background: var(--surface-2); color: var(--text); border: var(--border-width) var(--border-style) var(--border-c); border-left: 3px solid var(--color-primary-500); border-radius: var(--radius-md); box-shadow: var(--shadow-3, 0 12px 32px rgba(0,0,0,.18)); padding: var(--space-3) var(--space-4); min-width: 260px; max-width: 360px; }
${p}.tc-toast__body { display: grid; gap: 2px; flex: 1 1 auto; }
${p}.tc-toast__title { font-weight: 600; font-size: ${base - 1}px; }
${p}.tc-toast__msg { font-size: ${base - 2}px; color: var(--text-muted); }
${p}.tc-toast__close { flex: 0 0 auto; border: 0; background: transparent; color: var(--text-muted); cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 4px; border-radius: var(--radius-sm); }
${p}.tc-toast__close:hover { color: var(--text); background: var(--color-neutral-100); }
${p}.tc-toast--success { border-left-color: var(--color-success-500); }
${p}.tc-toast--warning { border-left-color: var(--color-warning-500); }
${p}.tc-toast--error { border-left-color: var(--color-error-500); }
${p}.tc-toast--info { border-left-color: var(--color-info-500); }`;
}

/* ----------------------------- Accordion ----------------------------- */
export function accordionStyles(p: string, config: DesignConfig): string {
  const { base, transition } = helpers(config);
  return `
${p}.tc-accordion { display: grid; gap: var(--space-2); width: 100%; max-width: 480px; }
${p}.tc-accordion__item { border: var(--border-width) var(--border-style) var(--border-c); border-radius: var(--radius-md); background: var(--surface-2); overflow: hidden; }
${p}.tc-accordion__header { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: transparent; border: 0; font-family: var(--font-base); font-size: ${base - 1}px; font-weight: 600; color: var(--text); cursor: pointer; text-align: left; ${transition} }
${p}.tc-accordion__header:hover { background: var(--color-primary-50); }
${p}.tc-accordion__header:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: -2px; }
${p}.tc-accordion__icon { flex: 0 0 auto; width: 16px; height: 16px; transition: transform var(--duration) var(--easing); }
${p}.tc-accordion__item[data-open="true"] .tc-accordion__icon { transform: rotate(180deg); }
${p}.tc-accordion__panel { padding: 0 var(--space-4) var(--space-4); font-size: ${base - 1}px; color: var(--text-muted); line-height: 1.5; }`;
}

/** Concatenate every component stylesheet for the given selector prefix. */
export function componentStyles(prefix: string, config: DesignConfig): string {
  const parts = [
    buttonStyles(prefix, config),
    accordionStyles(prefix, config),
    sidebarStyles(prefix, config),
    toastStyles(prefix, config),
    inputStyles(prefix, config),
    checkboxStyles(prefix, config),
    badgeStyles(prefix, config),
    alertStyles(prefix, config),
    avatarStyles(prefix),
    cardStyles(prefix, config),
    tableStyles(prefix, config),
    progressStyles(prefix),
    spinStyles(prefix),
    tabsStyles(prefix, config),
    tooltipStyles(prefix, config),
    dropdownStyles(prefix, config),
    overlayStyles(prefix, config),
    paginationStyles(prefix, config),
    calendarStyles(prefix, config),
  ];
  return parts.join("\n") + `\n@media (prefers-reduced-motion: reduce) { ${prefix}.tcb, ${prefix}.tc-card, ${prefix}.tc-page { transition: none !important; } }\n`;
}
