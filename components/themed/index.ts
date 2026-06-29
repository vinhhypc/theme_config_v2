/**
 * Public entry point for the themed component library.
 *
 * Consumers wrap their app in `<ThemeProvider config={...}>` and use any of the
 * components below; everything re-themes from the provided design tokens.
 *
 *   import { ThemeProvider, Button, Card } from "@your-scope/theme-ui";
 *   import { presets, applyPreset } from "@your-scope/theme-ui";
 */

/* Provider + theming primitives */
export { ThemeProvider, useTheme, type ThemeProviderProps } from "./ThemeProvider";
export { themeVars, type Mode } from "./themeCss";
export { componentStyles } from "./styles";

/* Components */
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button";
export { Accordion, type AccordionProps, type AccordionItem } from "./Accordion";
export { Alert, type AlertProps, type AlertVariant } from "./Alert";
export { Avatar, type AvatarProps, type AvatarSize, type AvatarVariant } from "./Avatar";
export { Badge, type BadgeProps, type BadgeVariant } from "./Badge";
export { Calendar, type CalendarProps } from "./Calendar";
export { Card, type CardProps, type CardVariant } from "./Card";
export { Checkbox, type CheckboxProps } from "./Checkbox";
export { DropdownMenu, type DropdownMenuProps, type DropdownMenuItem } from "./DropdownMenu";
export { Input, Field, type InputProps, type InputVariant } from "./Input";
export { Pagination, type PaginationProps } from "./Pagination";
export { Select, type SelectProps, type SelectOption } from "./Select";
export { Sidebar, type SidebarProps, type SidebarItem } from "./Sidebar";
export { Sheet, type SheetProps, type SheetSide } from "./Sheet";
export { Table, type TableProps, type TableColumn } from "./Table";
export { Toast, type ToastProps, type ToastVariant } from "./Toast";
export { Tooltip, type TooltipProps } from "./Tooltip";

/* Token / config layer — so consumers can build or tweak a DesignConfig */
export type { DesignConfig, ThemeMode, ThemeStyle } from "@/lib/config/types";
export { defaultConfig, cloneConfig } from "@/lib/config/defaults";
export { presets, applyPreset } from "@/lib/config/presets";
export { resolveTokens, buildCssVars, cssVarsToBlock, cssVarsToStyleObject } from "@/lib/tokens";
