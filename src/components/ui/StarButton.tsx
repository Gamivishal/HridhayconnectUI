import React, { useRef, useEffect, ReactNode, CSSProperties } from "react";

interface StarBackgroundProps {
  color?: string;
}

function StarBackground({ color = "#A678D6" }: StarBackgroundProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Subtle glow blob */}
      <ellipse cx="50%" cy="50%" rx="60%" ry="55%" fill="url(#starGlow)" />
      {/* Scattered small star particles */}
      {[
        { cx: "15%", cy: "25%", r: 1.2 },
        { cx: "82%", cy: "18%", r: 1.5 },
        { cx: "67%", cy: "75%", r: 1 },
        { cx: "30%", cy: "70%", r: 1.3 },
        { cx: "90%", cy: "55%", r: 0.9 },
        { cx: "10%", cy: "60%", r: 1.1 },
        { cx: "55%", cy: "88%", r: 0.8 },
        { cx: "75%", cy: "40%", r: 1.4 },
        { cx: "40%", cy: "15%", r: 1 },
        { cx: "22%", cy: "45%", r: 0.7 },
      ].map((star, i) => (
        <circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill={color}
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

// 4-point star SVG shape
function StarShape({
  size = 16,
  color = "#ffffff",
  opacity = 0.9,
  style,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={{ opacity, ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 4-point star */}
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

interface StarButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: CSSProperties;
}

export function StarButton({ children = "Sign Up", onClick, href, className = "", style }: StarButtonProps) {
  const btnRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  // Subtle shimmer animation on hover
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty("--mouse-x", `${x}%`);
      btn.style.setProperty("--mouse-y", `${y}%`);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    return () => btn.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const baseStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    paddingLeft: "2.75rem",
    paddingRight: "2.75rem",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    borderRadius: "9999px",
    border: "1px solid rgba(166, 120, 214, 0.4)",
    background: "linear-gradient(135deg, #5B2A86 0%, #7A49A5 50%, #A678D6 100%)",
    color: "#ffffff",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(91, 42, 134, 0.35), 0 2px 8px rgba(91, 42, 134, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, filter 0.3s ease",
    fontFamily: "Inter, sans-serif",
    ...style,
  };

  const content = (
    <>
      {/* Star particle background */}
      <StarBackground color="#C4A8E8" />

      {/* Shimmer overlay on hover */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.12) 0%, transparent 60%)",
          borderRadius: "9999px",
          pointerEvents: "none",
          transition: "opacity 0.3s",
        }}
      />

      {/* Left star decoration */}
      <StarShape size={12} color="#E8D5F5" opacity={0.9} style={{ flexShrink: 0, zIndex: 1 }} />

      {/* Button label */}
      <span style={{ position: "relative", zIndex: 1, whiteSpace: "nowrap" }}>
        {children}
      </span>

      {/* Right star decoration */}
      <StarShape size={10} color="#E8D5F5" opacity={0.75} style={{ flexShrink: 0, zIndex: 1 }} />
    </>
  );

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "scale(1.04) translateY(-1px)";
      el.style.boxShadow =
        "0 16px 48px rgba(91, 42, 134, 0.45), 0 4px 16px rgba(91, 42, 134, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
      el.style.filter = "brightness(1.08)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "scale(1) translateY(0)";
      el.style.boxShadow =
        "0 8px 32px rgba(91, 42, 134, 0.35), 0 2px 8px rgba(91, 42, 134, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)";
      el.style.filter = "brightness(1)";
    },
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
    },
    onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = "scale(1.04) translateY(-1px)";
    },
  };

  if (href) {
    return (
      <a
        href={href}
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        style={baseStyle}
        className={className}
        {...(hoverHandlers as React.HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      style={baseStyle}
      className={className}
      onClick={onClick}
      {...(hoverHandlers as React.HTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
