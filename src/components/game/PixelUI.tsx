"use client";

/**
 * Pixel sprite - renders a PNG image sprite OR emoji fallback as a chunky pixel sprite.
 * Uses CSS pixelated rendering + drop shadow for that 8-bit game look.
 */
export function PixelSprite({
  char,
  src,
  size = 80,
  color,
  className = "",
  float = false,
  shake = false,
  flashRed = false,
  pop = false,
}: {
  char?: string;
  src?: string; // optional image URL (e.g. "/sprites/hero.png") - takes precedence over char
  size?: number;
  color?: string;
  className?: string;
  float?: boolean;
  shake?: boolean;
  flashRed?: boolean;
  pop?: boolean;
}) {
  // Compute animation class directly from props - no state needed.
  const animClass = shake
    ? "kq-shake"
    : flashRed
      ? "kq-flash-red"
      : pop
        ? "kq-pop"
        : "";

  const key = `${src || char}-${shake}-${flashRed}-${pop}`;

  // If src is provided, render as <img> with pixelated rendering
  if (src) {
    return (
      <div
        key={key}
        className={`relative inline-flex items-center justify-center ${float ? "kq-float" : ""} ${animClass} ${className}`}
        style={{
          width: size,
          height: size,
          filter: "drop-shadow(3px 3px 0 rgba(0,0,0,0.5))",
        }}
      >
        <img
          src={src}
          alt={char || "sprite"}
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            imageRendering: "pixelated",
            display: "block",
          }}
          draggable={false}
        />
      </div>
    );
  }

  // Fallback: emoji/text rendering
  return (
    <div
      key={key}
      className={`relative inline-flex items-center justify-center ${float ? "kq-float" : ""} ${animClass} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.7,
        lineHeight: 1,
        color,
        textShadow: color
          ? `4px 4px 0 rgba(0,0,0,0.4)`
          : "4px 4px 0 rgba(0,0,0,0.4)",
        filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.3))",
        imageRendering: "pixelated",
      }}
    >
      {char}
    </div>
  );
}

/** Pixel button - thick bordered retro game button */
export function PixelButton({
  children,
  onClick,
  variant = "default",
  disabled = false,
  className = "",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "accent" | "danger" | "success";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const variantClass =
    variant === "accent"
      ? "kq-btn-accent"
      : variant === "danger"
        ? "kq-btn-danger"
        : variant === "success"
          ? "kq-btn-success"
          : "";
  const sizeClass =
    size === "sm"
      ? "text-[0.6rem] px-3 py-1.5"
      : size === "lg"
        ? "text-base px-8 py-4"
        : "";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`kq-btn ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </button>
  );
}

/** Pixel panel - bordered game window */
export function PixelPanel({
  children,
  variant = "light",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "light" | "dark" | "accent";
  className?: string;
}) {
  const variantClass =
    variant === "dark"
      ? "kq-panel-dark"
      : variant === "accent"
        ? "kq-panel-accent"
        : "kq-panel";
  return (
    <div className={`${variantClass} ${className}`}>{children}</div>
  );
}

/** HP/MP/XP bar with retro styling */
export function StatBar({
  current,
  max,
  color = "var(--kq-hp)",
  label,
  showNumbers = true,
  height = 14,
}: {
  current: number;
  max: number;
  color?: string;
  label?: string;
  showNumbers?: boolean;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = color === "var(--kq-hp)" && pct < 30;
  const fillColor = isLow ? "var(--kq-hp-low)" : color;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-baseline mb-1">
          <span
            className="font-pixel text-[0.55rem] uppercase tracking-wider"
            style={{ color: "var(--kq-panel-border)" }}
          >
            {label}
          </span>
          {showNumbers && (
            <span
              className="font-vt text-base leading-none"
              style={{ color: "var(--kq-panel-border)" }}
            >
              {current}/{max}
            </span>
          )}
        </div>
      )}
      <div className="kq-bar" style={{ height }}>
        <div
          className="kq-bar-fill"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
    </div>
  );
}

/** Decorative pixel divider line */
export function PixelDivider({
  char = "◆",
  className = "",
}: {
  char?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 my-3 ${className}`}
      style={{ color: "var(--kq-muted)" }}
    >
      <span
        style={{
          flex: 1,
          height: 2,
          background: "var(--kq-muted)",
        }}
      />
      <span className="font-pixel text-[0.6rem]">{char}</span>
      <span
        style={{
          flex: 1,
          height: 2,
          background: "var(--kq-muted)",
        }}
      />
    </div>
  );
}
