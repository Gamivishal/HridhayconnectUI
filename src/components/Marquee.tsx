import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function Marquee() {
  const items = [
    "Holistic Alchemy",
    "Ethically Sourced",
    "Botanical Purity",
    "Mindful Formulation",
    "Cellular Repair",
    "Radiant Vitality"
  ];

  return (
    <div className="w-full border-y border-[var(--color-primary)]/5 bg-transparent py-8 md:py-10 overflow-hidden relative z-20">
      <div className="flex gap-16 md:gap-32 items-center whitespace-nowrap animate-marquee w-max px-4">
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-16 md:gap-32 opacity-70 hover:opacity-100 transition-opacity duration-500">
            <span className="text-sm md:text-base font-medium uppercase tracking-[0.3em] text-[var(--color-dark-text)] flex items-center gap-6">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {text}
            </span>
          </div>
        ))}
        {/* Duplicate for seamless infinity scroll */}
        {items.map((text, i) => (
          <div key={`dup-${i}`} className="flex items-center gap-16 md:gap-32 opacity-70 hover:opacity-100 transition-opacity duration-500">
            <span className="text-sm md:text-base font-medium uppercase tracking-[0.3em] text-[var(--color-dark-text)] flex items-center gap-6">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
