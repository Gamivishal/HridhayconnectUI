import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function WellnessExperience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} className="pt-4 pb-16 md:pt-6 md:pb-24 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left - Cinematic Collage */}
        <div className="relative h-[50vh] md:h-[65vh] w-full flex items-center justify-center">
          <motion.div style={{ y: y1 }} className="absolute z-20 left-[5%] w-[60%] aspect-[3/4] rounded-t-[15rem] rounded-b-[4rem] overflow-hidden border border-white/50 shadow-2xl shadow-[var(--color-primary)]/10">
            <img 
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop" 
              alt="Wellness relaxation" 
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>
          
          <motion.div style={{ y: y2 }} className="absolute z-10 right-[5%] bottom-[10%] w-[55%] aspect-square rounded-full overflow-hidden border-[12px] border-[var(--color-background)] shadow-2xl opacity-90 mix-blend-multiply flex items-center justify-center bg-[var(--color-beige)]">
            <img 
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" 
              alt="Texture" 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
          </motion.div>
        </div>

        {/* Right - Content */}
        <div className="flex flex-col justify-center lg:pl-12">
          <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
            The Ritual
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-[var(--color-dark-text)] leading-[1.05] mb-8 font-light tracking-tight">
            More than skincare. <br/>
            An invitation to <span className="text-[var(--color-primary)] italic font-medium">pause.</span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-dark-text)]/70 font-light leading-relaxed mb-12 max-w-lg">
            Transform your daily routine into a moment of mindful connection. Our textures and botanical aromas are designed to ease the mind as they repair the skin.
          </p>
          
          <div className="space-y-8 mt-4">
            {[
              { t: "Breathe", d: "Natural floral essences calm the nervous system." },
              { t: "Apply", d: "Smooth, melt-in textures that feel like silk." },
              { t: "Restore", d: "Wake up to visibly renewed, radiant skin." }
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <span className="text-[var(--color-primary)] font-serif italic text-3xl group-hover:text-[var(--color-secondary)] transition-colors">0{i + 1}.</span>
                <div>
                   <p className="text-lg font-medium text-[var(--color-dark-text)] tracking-wider uppercase text-sm mb-1">{step.t}</p>
                   <p className="text-[var(--color-dark-text)]/60 font-light">{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
