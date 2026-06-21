import { motion, useInView, animate } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Heart, Leaf, Droplets, Users } from "lucide-react";

// Custom hook/component for animated counters
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "", prefix = "" }: { from?: number, to: number, duration?: number, suffix?: string, prefix?: string }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: duration,
        onUpdate(value) {
          setCount(Math.round(value));
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView]);

  return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
};

const fadeUpContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

export function BrandStatistics() {
  return (
    <section className="relative py-24 md:py-32 bg-[var(--color-dark-text)] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-[var(--color-primary)]/40 blur-[120px] mix-blend-screen" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpContainer} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { to: 100, suffix: "%", label: "Handmade Products", icon: <Heart className="w-6 h-6 mx-auto mb-4 text-[var(--color-accent)]" /> },
            { to: 100, suffix: "%", label: "Natural Ingredients", icon: <Leaf className="w-6 h-6 mx-auto mb-4 text-[var(--color-accent)]" /> },
            { to: 50, suffix: "+", label: "Small Batches Crafted", icon: <Droplets className="w-6 h-6 mx-auto mb-4 text-[var(--color-accent)]" /> },
            { to: 10, suffix: "k+", label: "Customer Community", icon: <Users className="w-6 h-6 mx-auto mb-4 text-[var(--color-accent)]" /> }
          ].map((stat, idx) => (
            <motion.div key={idx} variants={fadeUpItem} className="flex flex-col items-center p-6 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
              {stat.icon}
              <div className="text-4xl md:text-5xl font-light font-serif mb-2">
                <AnimatedCounter to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest text-white/60 font-general">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
