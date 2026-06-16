import { ShieldCheck, Leaf, Globe2, Sparkles } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: <ShieldCheck className="w-8 h-8" />, text: "Dermatologically Tested" },
    { icon: <Leaf className="w-8 h-8" />, text: "100% Vegan & Cruelty Free" },
    { icon: <Globe2 className="w-8 h-8" />, text: "Ethically Sourced Worldwide" },
    { icon: <Sparkles className="w-8 h-8" />, text: "Formulated without Parabens" }
  ];

  return (
    <section className="py-20 border-y border-[var(--color-primary)]/10 bg-[var(--color-cream)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {badges.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-[var(--color-background)] border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-500 mb-4 shadow-sm">
                {b.icon}
              </div>
              <span className="text-sm font-medium tracking-wide text-[var(--color-dark-text)]/80 max-w-[150px]">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
