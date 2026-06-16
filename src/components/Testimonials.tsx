import { motion } from "motion/react";
import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      txt: "This serum completely changed my evening ritual. The lavender scent is incredibly calming, and my skin has never looked more radiant.",
      name: "Sophia L.",
      role: "Verified Buyer"
    },
    {
      txt: "A true luxury experience. You can feel the purity of the ingredients the moment it touches your skin. It's rich, earthy, and perfect.",
      name: "Emma R.",
      role: "Verified Buyer"
    },
    {
      txt: "Finally, an organic product that delivers real results without heavy artificial scents. The Plum Essence is a daily necessity for me now.",
      name: "Chloe M.",
      role: "Verified Buyer"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-[var(--color-background)] relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[var(--color-primary)]/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-dark-text)] mb-6">
          Words from our <span className="italic text-[var(--color-secondary)]">Community</span>
        </h2>
      </div>

      <div className="flex justify-center gap-8 flex-wrap lg:flex-nowrap max-w-[1400px] mx-auto relative z-10">
        {reviews.map((r, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            key={i}
            className="w-full lg:w-1/3 bg-white/50 backdrop-blur-xl border border-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-[var(--color-primary)]/10 transition-shadow duration-500 relative"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
              ))}
            </div>
            <p className="text-lg text-[var(--color-dark-text)]/80 leading-relaxed font-light mb-8">
              "{r.txt}"
            </p>
            <div className="mt-auto">
              <p className="font-serif text-[var(--color-dark-text)] text-lg">{r.name}</p>
              <p className="text-xs uppercase tracking-widest text-[var(--color-primary)] mt-1">{r.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
