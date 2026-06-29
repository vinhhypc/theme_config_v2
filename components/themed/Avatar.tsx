// `React` imported explicitly so this also renders under Storybook's Vite
// pipeline (classic JSX runtime); harmless in the Next app.
import React, { forwardRef, type HTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarVariant = "primary" | "accent" | "soft";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize;
  variant?: AvatarVariant;
  /** Image source. When set, the image fills the avatar; otherwise initials show. */
  src?: string;
  /** Accessible alt / image description (also used as the title). */
  alt?: string;
  /** Initials / fallback content shown when no `src` is provided. */
  name?: string;
}

/** Derive up to two uppercase initials from a name. */
function initials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

/**
 * Token-driven avatar. Emits semantic classes (`tc-avatar`, `tc-avatar--lg`,
 * …) styled by the surrounding `<ThemedSurface>`, so it re-themes with the
 * active design config. Renders an image when `src` is set, else initials.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = "md", variant = "primary", src, alt, name, className, children, ...props }, ref) => {
    const classes = ["tc-avatar"];
    if (size !== "md") classes.push(`tc-avatar--${size}`);
    if (variant !== "primary") classes.push(`tc-avatar--${variant}`);
    if (className) classes.push(className);
    return (
      <span ref={ref} className={classes.join(" ")} title={alt ?? name} {...props}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? name ?? ""} />
        ) : (
          children ?? initials(name)
        )}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";
