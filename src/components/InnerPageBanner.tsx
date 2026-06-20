import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface InnerPageBannerProps {
  /** Small eyebrow label above the title */
  eyebrow?: string;
  /** Main page title */
  title: string;
  /** Optional italic accent portion of the title (renders below / inline) */
  titleAccent?: string;
  /** Subtitle / description text */
  subtitle?: string;
  /** Breadcrumb trail */
  breadcrumbs?: Breadcrumb[];
  /** Optional right-side decorative emoji or icon character */
  decorativeEmoji?: string;
  /** Gradient override — defaults to soft purple */
  gradientFrom?: string;
  gradientTo?: string;
  /** Background image URL (optional, subtle) */
  bgImage?: string;
  /** Optional right-side image URL */
  imageUrl?: string;
}

export function InnerPageBanner({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  breadcrumbs = [],
  decorativeEmoji,
  bgImage,
  imageUrl,
}: InnerPageBannerProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ paddingTop: "80px" }} // clears fixed navbar
    >
      {/* ── Ambient background layers ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #F7F3FA 0%, #EDE5F5 40%, #F3EDF9 70%, #F7F3FA 100%)",
          }}
        />

        {/* Optional full background image */}
        {bgImage && (
          <>
            <div
              className="absolute inset-0 opacity-[0.42] saturate-[0.8]"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center 35%",
              }}
            />
            {/* Responsive gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[var(--color-cream)] via-[var(--color-cream)]/88 to-transparent z-[1] pointer-events-none" />
          </>
        )}

        {/* Organic ambient glow — top left */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(91,42,134,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Glow — bottom right */}
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(166,120,214,0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Noise grain texture */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "160px 160px",
          }}
        />

        {/* Thin top border glow line */}
        <div
          className="absolute top-0 inset-x-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(91,42,134,0.15) 30%, rgba(166,120,214,0.25) 50%, rgba(91,42,134,0.15) 70%, transparent 100%)",
          }}
        />
        {/* Bottom border */}
        <div
          className="absolute bottom-0 inset-x-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(91,42,134,0.08) 50%, transparent 100%)",
          }}
        />
      </div>



      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 py-12 md:py-16 lg:py-20">

        {/* Left: Text block */}
        <div className="flex-1 max-w-2xl">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1.5 mb-5"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ArrowRight className="w-3 h-3 text-[#5B2A86]/30 flex-shrink-0" />
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-[10px] uppercase tracking-[0.18em] text-[#1B1720]/40 hover:text-[#5B2A86] transition-colors font-medium font-general"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#5B2A86] font-semibold font-general">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </motion.nav>
          )}

          {/* Eyebrow */}
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 mb-4"
            >
              <span
                className="h-[1px] w-8"
                style={{ background: "linear-gradient(90deg, #5B2A86, #A678D6)" }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5B2A86] font-general">
                {eyebrow}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-[#1B1720] leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {title}
            {titleAccent && (
              <>
                {" "}
                <span
                  className="italic font-serif"
                  style={{ color: "#7A49A5" }}
                >
                  {titleAccent}
                </span>
              </>
            )}
          </motion.h1>

          {/* Underline accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 mb-5 h-[1px] w-16 origin-left"
            style={{
              background: "linear-gradient(90deg, rgba(91,42,134,0.4), rgba(166,120,214,0.15))",
            }}
          />

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-base text-[#1B1720]/65 font-light font-satoshi leading-relaxed max-w-lg"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Right: Decorative element */}
        {!bgImage && (decorativeEmoji || imageUrl) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-shrink-0 items-center justify-center"
          >
            {imageUrl ? (
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-28 h-36 lg:w-36 lg:h-44 rounded-2xl overflow-hidden border border-white shadow-xl shadow-[var(--color-primary)]/10"
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 to-transparent pointer-events-none" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(166,120,214,0.18) 0%, rgba(91,42,134,0.06) 60%, transparent 100%)",
                  border: "1px solid rgba(166,120,214,0.20)",
                  boxShadow: "0 8px 32px rgba(91,42,134,0.10)",
                }}
              >
                <span className="text-5xl lg:text-6xl select-none">{decorativeEmoji}</span>

                {/* Orbiting dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ padding: "8px" }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ background: "rgba(91,42,134,0.35)" }}
                  />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
