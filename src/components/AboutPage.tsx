import { motion } from "motion/react";
import { useEffect } from "react";
import { ShieldCheck, Award, Heart, Leaf, Star, Sparkle } from "lucide-react";
import { InnerPageBanner } from "./InnerPageBanner";

export function AboutPage() {

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative w-full bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans">

      <InnerPageBanner
        eyebrow="Our Story"
        title="About Hridhay"
        titleAccent="Connect"
        subtitle="Crafting premium wellness experiences through organic, handcrafted products that honor the ancient rhythms of nature."
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: "About Us" },
        ]}
        bgImage="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop"
        decorativeEmoji="🌿"
      />

      {/* 2. Brand Story Section */}
      <section id="story" className="relative py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left - Story Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              Immersive Origin
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif text-black leading-[1.02] mb-8 font-light tracking-tight font-clash">
              Crafted for the <br />
              <span className="italic font-normal text-[var(--color-primary)]">mindful,</span> nurtured by the earth.
            </h2>
            <div className="space-y-6 text-lg text-[var(--color-dark-text)]/75 font-light leading-relaxed max-w-xl font-satoshi">
              <p>
                At Hridhay Connect, we believe that true luxury lies in absolute purity. Our formulations seamlessly blend ancient holistic traditions with modern, meticulous botanical science. 
              </p>
              <p>
                Every botanical active is ethically sourced, ensuring we respect and replenish the earth just as much as we receive. This is more than skincare—it is a daily ritual of reverence, designed to awaken your skin's natural radiance and harmonize your connection with nature.
              </p>
            </div>
          </motion.div>

          {/* Right - Editorial Image Composition */}
          <div className="lg:col-span-6 relative h-[70vh] md:h-[80vh] w-full flex items-center justify-center">
            {/* Main Image Frame (Curved and Organic shape) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[80%] h-full rounded-t-[18rem] rounded-b-[3rem] overflow-hidden shadow-2xl border border-white/40"
            >
              <img 
                src="https://images.unsplash.com/photo-1611077544665-27aabdc63cd4?q=80&w=1000&auto=format&fit=crop" 
                alt="Botanical setup" 
                className="w-full h-full object-cover mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-text)]/20 to-transparent pointer-events-none" />
            </motion.div>

            {/* Small Floating Image Overlay */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-[10%] left-[0%] w-[45%] aspect-[4/3] rounded-3xl overflow-hidden border-8 border-[var(--color-background)] shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop" 
                alt="Herbal apothecary extraction" 
                className="w-full h-full object-cover saturate-[0.8]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="relative py-32 md:py-48 bg-white/45 border-y border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">The Metamorphosis</span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-black tracking-tight">Our Mission & Wellness Creed</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/40 border border-white/60 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-8">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-black mb-4">Organic Harmony</h3>
                <p className="text-sm text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">
                  Blending ancient herbal holistic wisdom with strict botanical research to preserve absolute vitality.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/40 border border-white/60 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-8">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-black mb-4">Supreme Quality</h3>
                <p className="text-sm text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">
                  Extracting potent nutrients through cold-press methods without harmful additives or synthetic fillers.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/40 border border-white/60 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-8">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-black mb-4">Wellness Ritual</h3>
                <p className="text-sm text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">
                  Elevating daily skin application into a peaceful moment of connection, healing, and self-devotion.
                </p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/40 border border-white/60 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-8">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-medium text-black mb-4">Pure Commitment</h3>
                <p className="text-sm text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">
                  Delivering clean, vegan, cruelty-free, and dermatologically audited cosmetics you can trust blindly.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Hridhay Connect Section */}
      <section className="relative py-32 md:py-48 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left - Curved Visual Composition */}
          <div className="lg:col-span-6 relative h-[65vh] w-full flex items-center justify-center order-last lg:order-first">
            <div className="absolute w-[80%] h-full rounded-b-[18rem] rounded-t-[3rem] overflow-hidden shadow-2xl border border-white/30 bg-white/20">
              <img 
                src="https://images.unsplash.com/photo-1615397323289-4081387d8eb9?q=80&w=1000&auto=format&fit=crop" 
                alt="Lavender flowers" 
                className="w-full h-full object-cover saturate-[0.8] brightness-[1.05]"
              />
            </div>
            {/* Floating Trust badge overlay */}
            <div className="absolute -right-4 top-[20%] bg-white/50 backdrop-blur-xl border border-white/60 text-[var(--color-primary)] p-6 rounded-3xl shadow-xl w-40 text-center animate-bounce">
              <Star className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)] fill-[var(--color-primary)]/20" />
              <div className="text-xs uppercase tracking-widest font-semibold font-general">Dermatologist Approved</div>
            </div>
          </div>

          {/* Right - Trust details */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
              Why Us
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight mb-8 font-light tracking-tight">
              The Pillar of <br />
              <span className="italic font-normal text-[var(--color-primary)]">Holistic Confidence.</span>
            </h2>
            <div className="space-y-8 font-satoshi text-base text-[var(--color-dark-text)]/70">
              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-xs font-bold font-general">01</span>
                </div>
                <div>
                  <h4 className="text-lg font-serif font-medium text-black mb-1">Meticulous Source Selection</h4>
                  <p className="font-light leading-relaxed">
                    We select our fields based on soil health, mineral content, and clean air environments.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-xs font-bold font-general">02</span>
                </div>
                <div>
                  <h4 className="text-lg font-serif font-medium text-black mb-1">Absolute Botanical Potency</h4>
                  <p className="font-light leading-relaxed">
                    Our cold extraction seals vitamins, antioxidants, and active enzymes in their active organic states.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1">
                  <span className="text-xs font-bold font-general">03</span>
                </div>
                <div>
                  <h4 className="text-lg font-serif font-medium text-black mb-1">Honorable Trade Ecosystem</h4>
                  <p className="font-light leading-relaxed">
                    Supporting small-scale farmers and maintaining full pricing transparency down the line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Product Philosophy Section */}
      <section className="relative py-32 md:py-48 bg-white/30 border-y border-[var(--color-primary)]/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left - Story & philosophy description */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
                The Formulation
              </span>
              <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight mb-8 font-light tracking-tight font-clash">
                Purity as the <br />
                <span className="italic font-normal text-[var(--color-primary)]">Only Standard.</span>
              </h2>
              <p className="text-base sm:text-lg text-[var(--color-dark-text)]/75 font-light font-satoshi leading-relaxed mb-8">
                We believe that cosmetic formulas should never compromise the health of your body. Our serums and toners are crafted using pure, raw plant nectars, completely omitting chemical fillers, silicones, sulfates, or artificial fragrances.
              </p>
              
              <div className="grid grid-cols-2 gap-8 font-serif mt-4">
                <div className="border-l border-[var(--color-primary)]/20 pl-6 py-2">
                  <div className="text-4xl font-light text-black">100%</div>
                  <div className="text-xs uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Active Botanical active</div>
                </div>
                <div className="border-l border-[var(--color-primary)]/20 pl-6 py-2">
                  <div className="text-4xl font-light text-black">Zero</div>
                  <div className="text-xs uppercase tracking-widest text-[var(--color-dark-text)]/50 mt-1 font-general">Synthetic Fillers</div>
                </div>
              </div>
            </div>

            {/* Right - Luxury Layered visuals */}
            <div className="lg:col-span-7 relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center">
              {/* Back background item (bottle detail) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[60%] h-[75%] rounded-[3rem] overflow-hidden shadow-2xl border border-white/20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=1000&auto=format&fit=crop" 
                  alt="Minimal luxury serum container" 
                  className="w-full h-full object-cover saturate-[0.8]"
                />
              </motion.div>

              {/* Front overlapping item (plant active) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 50, y: -30 }}
                whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-[5%] bottom-[10%] w-[45%] aspect-[3/4] rounded-t-[10rem] rounded-b-3xl overflow-hidden border-8 border-[var(--color-background)] shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop" 
                  alt="Botanical extracts" 
                  className="w-full h-full object-cover saturate-50"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Brand Journey Timeline */}
      <section className="relative py-32 md:py-48 bg-[var(--color-dark-text)] text-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Our Path</span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-tight">Timeline of Growth</h2>
          </div>

          <div className="relative border-l border-white/10 max-w-4xl mx-auto pl-8 md:pl-16 space-y-16">
            
            {/* Milestone 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-dark-text)] shadow-lg" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2023 • The Conception</span>
                <h4 className="text-2xl font-serif font-light text-white mt-2 mb-3">Honoring Ancient Wisdom</h4>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl font-satoshi">
                  Hridhay Connect was founded by botanical alchemists and dermatological scientists to discover pure skincare formulas using certified organic, wild-harvested raw extracts.
                </p>
              </div>
            </motion.div>

            {/* Milestone 2 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-dark-text)] shadow-lg" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2024 • Organic Audits</span>
                <h4 className="text-2xl font-serif font-light text-white mt-2 mb-3">Achieving Cruelty-Free Status</h4>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl font-satoshi">
                  We built our extraction lab and secured rigorous certifications, proving that zero synthetic fillers or chemical additives are ever present in our product list.
                </p>
              </div>
            </motion.div>

            {/* Milestone 3 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-dark-text)] shadow-lg" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2025 • National Launch</span>
                <h4 className="text-2xl font-serif font-light text-white mt-2 mb-3">Pioneering Organic Wellness</h4>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl font-satoshi">
                  Officially launched Hridhay Connect website, delivering our signature serums to thousands of customers looking to restore harmony and natural skin radiance.
                </p>
              </div>
            </motion.div>

            {/* Milestone 4 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-dark-text)] shadow-lg" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2026 • Global Evolution</span>
                <h4 className="text-2xl font-serif font-light text-white mt-2 mb-3">Expanding to Deep Skincare Devotion</h4>
                <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl font-satoshi">
                  Unveiling new high-potency toners and masks, continuing our commitment to sustainable packaging, clean trade, and luxury wellness.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. Trust & Quality Section */}
      <section className="relative py-24 md:py-32 bg-white/40 border-b border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center">
          
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-serif font-medium text-black mb-2">Secure Purchases</h4>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light font-satoshi leading-relaxed max-w-xs">
              Every checkout is encrypted, safeguarding your private billing details with secure payment protocols.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] mb-6">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-serif font-medium text-black mb-2">Certified Clean</h4>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light font-satoshi leading-relaxed max-w-xs">
              Officially recognized and certified for ethical trade, organic actives, and cruelty-free formulation standards.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] mb-6">
              <Leaf className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-serif font-medium text-black mb-2">Sustainable Packaging</h4>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light font-satoshi leading-relaxed max-w-xs">
              Serums and toners housed in fully recyclable premium glass, preserving active ingredients against UV oxidation.
            </p>
          </div>

        </div>
      </section>

      {/* 8. Wellness Lifestyle Section */}
      <section className="relative py-32 md:py-48 bg-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left - Immersive Landscape Imagery */}
            <div className="lg:col-span-7 relative h-[50vh] md:h-[70vh] w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6 }}
                className="w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border border-white/30"
              >
                <img 
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop" 
                  alt="Spa lifestyle botanical wellness" 
                  className="w-full h-full object-cover saturate-[0.8]"
                />
              </motion.div>
            </div>

            {/* Right - Wellness storytelling */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--color-primary)]"></span>
                The Living Devotion
              </span>
              <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight mb-8 font-light tracking-tight font-clash">
                Elevating Daily <br />
                <span className="italic font-normal text-[var(--color-primary)]">Rituals into Art.</span>
              </h2>
              <p className="text-base text-[var(--color-dark-text)]/70 font-light font-satoshi leading-relaxed mb-6">
                Skincare is not merely a task; it is the ultimate expression of kindness to yourself. In a loud and busy world, Hridhay Connect offers a calm space—a simple, slow, and completely organic experience that nurtures both your physical skin and your inner peace.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Testimonials Section */}
      <section className="relative py-32 bg-white/40 border-y border-[var(--color-primary)]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Shared Journeys</span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-black tracking-tight">Voices of Reverence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/50 border border-white/70 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-base text-[var(--color-dark-text)]/85 font-light font-satoshi italic leading-relaxed mb-8">
                  "The Amethyst Revival Serum has completely transformed my daily ritual. My skin feels deeply balanced, hydrated, and has a natural radiance that I haven't seen in years."
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Aria M.</h5>
                <span className="text-xs uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general">Verified Collector</span>
              </div>
            </motion.div>

            {/* Review 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/50 border border-white/70 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-base text-[var(--color-dark-text)]/85 font-light font-satoshi italic leading-relaxed mb-8">
                  "I love the complete omission of chemical additives. The Lavender Mask feels incredibly soothing on my face at night, providing a calming aroma that helps me unwind."
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Julian K.</h5>
                <span className="text-xs uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general">Verified Collector</span>
              </div>
            </motion.div>

            {/* Review 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/50 border border-white/70 p-8 rounded-3xl backdrop-blur-md shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[var(--color-primary)] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-base text-[var(--color-dark-text)]/85 font-light font-satoshi italic leading-relaxed mb-8">
                  "Hridhay Connect represents absolute purity. Knowing that every ingredient is ethically and sustainably harvested makes this a purchase I feel completely proud of."
                </p>
              </div>
              <div>
                <h5 className="font-serif font-medium text-black">Elena R.</h5>
                <span className="text-xs uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general">Verified Collector</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. Premium CTA Section */}
      <section className="relative py-32 md:py-48 bg-[var(--color-dark-text)] text-[var(--color-cream)] overflow-hidden">
        {/* Animated Radial Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-[var(--color-primary)]/20 blur-[150px] mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="flex items-center gap-3 mb-8 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md"
          >
            <Sparkle className="w-4 h-4 text-[var(--color-accent)] animate-spin-slow" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
              The Path To Vitality
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-light text-white leading-[0.95] tracking-tight mb-8"
          >
            Discover your skin's <br />
            <span className="italic font-normal text-[var(--color-accent)]">true, raw essence.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="text-base sm:text-lg text-white/70 max-w-xl mb-12 font-light font-satoshi leading-relaxed"
          >
            Explore our collection of wildcrafted, cold-pressed botanical active serums and restore harmony to your self-care ritual today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.6 }}
          >
            <a 
              href="#" 
              className="rounded-full px-14 py-6 text-sm font-semibold bg-[var(--color-primary)]/70 text-white border border-white/20 backdrop-blur-md hover:bg-[var(--color-primary)]/85 hover:scale-[1.03] transition-all duration-300 shadow-xl uppercase tracking-widest font-general"
            >
              Shop The Collection
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
