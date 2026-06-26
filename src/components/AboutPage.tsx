import { motion, useInView, animate } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { ShieldCheck, Award, Heart, Leaf, Star, Sparkle, ArrowRight, CheckCircle2, Mail, Users, Droplets, Sun, Sparkles } from "lucide-react";
import { InnerPageBanner } from "./InnerPageBanner";
import { AboutImageCarousel } from "./AboutImageCarousel";



export function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  const fadeRightItem = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

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
        bgImage="/Image/AboutPageImage/BannerImage.webp"
        decorativeEmoji="🌿"
      />

      {/* 2. Brand Story Section */}
      <section id="story" className="relative py-28 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="lg:col-span-6 flex flex-col">
            <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]/60"></span> Immersive Origin
            </motion.span>
            <motion.h2 variants={fadeUpItem} className="text-4xl sm:text-5xl md:text-7xl font-serif text-black leading-[1.05] mb-10 font-light tracking-tight">
              Crafted for the <br /> <span className="italic font-normal text-[var(--color-primary)]">mindful,</span> nurtured by the earth.
            </motion.h2>
            <motion.div variants={fadeUpItem} className="space-y-6 text-base md:text-lg text-[var(--color-dark-text)]/75 font-light leading-relaxed max-w-xl font-satoshi">
              <p className="text-justify">At Hridhay Connect, we believe that true luxury lies in absolute purity. Our formulations seamlessly blend ancient holistic traditions with modern, meticulous botanical science.</p>
              <p className="text-justify">Every botanical active is ethically sourced, ensuring we respect and replenish the earth just as much as we receive. This is more than skincare—it is a daily ritual of reverence, designed to awaken your skin's natural radiance.</p>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-6 relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center mt-12 lg:mt-0">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className="relative w-[85%] md:w-[80%] h-full rounded-t-[12rem] md:rounded-t-[18rem] rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden shadow-2xl border border-white/40">
              <img src="/Image/AboutPageImage/Section_1_largerImage.jpg" alt="Botanical setup" loading="lazy" decoding="async" className="w-full h-full object-cover mix-blend-normal transition-transform duration-1000 hover:scale-105" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -40, y: 40 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-[5%] left-[0%] md:-left-[5%] w-[50%] md:w-[45%] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden border-[6px] md:border-8 border-[var(--color-cream)] shadow-2xl">
              <img src="/Image/AboutPageImage/TwoSoap.webp" alt="Herbal apothecary extraction" loading="lazy" decoding="async" className="w-full h-full object-cover saturate-[0.85] transition-transform duration-1000 hover:scale-110" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="relative py-28 md:py-48 bg-white/50 border-y border-[var(--color-primary)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">The Metamorphosis</motion.span>
            <motion.h2 variants={fadeUpItem} className="text-4xl md:text-6xl font-serif font-light text-black tracking-tight">Our Mission & Wellness Creed</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <Leaf className="w-6 h-6" />, title: "Organic Harmony", desc: "Blending ancient herbal holistic wisdom with strict botanical research to preserve absolute vitality." },
              { icon: <Award className="w-6 h-6" />, title: "Supreme Quality", desc: "Extracting potent nutrients through cold-press methods without harmful additives or synthetic fillers." },
              { icon: <Heart className="w-6 h-6" />, title: "Wellness Ritual", desc: "Elevating daily skin application into a peaceful moment of connection, healing, and self-devotion." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Pure Commitment", desc: "Delivering clean, vegan, cruelty-free, and dermatologically audited cosmetics you can trust blindly." }
            ].map((card, idx) => (
              <motion.div key={idx} variants={fadeUpItem} whileHover={{ y: -8, transition: { duration: 0.4 } }} className="bg-white/60 border border-white p-8 rounded-3xl backdrop-blur-xl shadow-lg shadow-[var(--color-primary)]/5 flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-cream)] border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-8 transition-colors duration-500 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-serif font-medium text-black mb-4">{card.title}</h3>
                  <p className="text-sm text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Holistic Confidence Section */}
      <section className="relative py-28 md:py-48 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-6 relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center order-last lg:order-first">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className="absolute w-[85%] md:w-[90%] h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-[var(--color-primary)]/10 bg-white">
              <img src="/Image/AboutPageImage/Photo1.jpg" alt="Gujarati farmer harvesting natural botanicals" loading="lazy" decoding="async" className="w-full h-full object-cover saturate-[0.85] brightness-[1.02] transition-transform duration-1000 hover:scale-105" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6, type: "spring" }} className="absolute -right-2 md:-right-6 top-[20%] bg-white/80 backdrop-blur-xl border border-white text-[var(--color-primary)] p-5 md:p-6 rounded-3xl shadow-xl w-36 md:w-44 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary)]" />
              <div className="text-[10px] md:text-xs uppercase tracking-widest font-semibold font-general">Ethically Farmed</div>
            </motion.div>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="lg:col-span-6 flex flex-col justify-center">
            <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]/60"></span> Holistic Confidence
            </motion.span>
            <motion.h2 variants={fadeUpItem} className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-[1.1] mb-10 font-light tracking-tight">
              The Pillar of <br /> <span className="italic font-normal text-[var(--color-primary)]">Holistic Confidence.</span>
            </motion.h2>
            <div className="space-y-10 font-satoshi text-base text-[var(--color-dark-text)]/75">
              {[
                { num: "01", title: "Meticulous Source Selection", desc: "We select our fields based on soil health, mineral content, and clean air environments in rural India." },
                { num: "02", title: "Absolute Botanical Potency", desc: "Our cold extraction seals vitamins, antioxidants, and active enzymes in their active organic states." },
                { num: "03", title: "Honorable Trade Ecosystem", desc: "Supporting local Indian farmers and maintaining full pricing transparency down the line." }
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeUpItem} className="flex gap-6 items-start group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center flex-shrink-0 text-[var(--color-primary)] mt-1 border border-[var(--color-primary)]/10 transition-colors duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <span className="text-xs font-bold font-general">{item.num}</span>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-serif font-medium text-black mb-2 transition-colors duration-300 group-hover:text-[var(--color-primary)]">{item.title}</h4>
                    <p className="font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Purity as the Only Standard Section */}
      <section className="relative py-28 md:py-48 bg-white/40 border-y border-[var(--color-primary)]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="lg:col-span-6 flex flex-col justify-center">
              <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--color-primary)]/60"></span> The Formulation
              </motion.span>
              <motion.h2 variants={fadeUpItem} className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-8 font-light tracking-tight font-clash">
                Purity as the <br /> <span className="italic font-normal text-[var(--color-primary)]">Only Standard.</span>
              </motion.h2>
              <motion.p variants={fadeUpItem} className="text-base sm:text-lg text-[var(--color-dark-text)]/75 font-light font-satoshi leading-relaxed mb-10 text-justify">
                We believe that cosmetic formulas should never compromise the health of your body. Our products are crafted using pure, raw plant nectars, completely omitting chemical fillers, silicones, sulfates, or artificial fragrances.
              </motion.p>

              <div className="grid grid-cols-2 gap-6 font-serif">
                {[
                  { value: "100%", label: "Natural Ingredients" },
                  { value: "Zero", label: "Artificial Preservatives" },
                  { value: "100%", label: "Handmade Batches" },
                  { value: "100%", label: "Ethically Sourced" }
                ].map((stat, idx) => (
                  <motion.div key={idx} variants={fadeUpItem} className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl md:text-4xl font-light text-[var(--color-primary)] mb-2">{stat.value}</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-[0.1em] text-[var(--color-dark-text)]/70 font-general font-semibold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="lg:col-span-6 relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center mt-12 lg:mt-0">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className="absolute w-[70%] md:w-[60%] h-[80%] md:h-[75%] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/40">
                <img src="/Image/AboutPageImage/Ingredients2.jpg" alt="Minimal luxury serum container" loading="lazy" decoding="async" className="w-full h-full object-cover saturate-[0.85] transition-transform duration-1000 hover:scale-105" />
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95, x: 50, y: -30 }} whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="absolute right-[0%] md:right-[5%] bottom-[5%] md:bottom-[10%] w-[55%] md:w-[45%] aspect-[3/4] rounded-t-[8rem] md:rounded-t-[10rem] rounded-b-[2rem] md:rounded-b-3xl overflow-hidden border-[6px] md:border-8 border-[var(--color-cream)] shadow-2xl">
                <img src="/Image/AboutPageImage/AllproductMix.webp" alt="Botanical extracts" loading="lazy" decoding="async" className="w-full h-full object-cover saturate-[0.7] transition-transform duration-1000 hover:scale-110" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Natural Ingredients Showcase Section */}
      <section className="relative py-28 md:py-40 bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Earth's Bounty</motion.span>
            <motion.h2 variants={fadeUpItem} className="text-4xl md:text-6xl font-serif font-light text-black tracking-tight">Our Sacred Botanicals</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { name: "Neem", desc: "Purifies & Cleanses", img: "/Image/AboutPageImage/NeemC.jpg" },
              { name: "Aloe Vera", desc: "Soothes & Hydrates", img: "/Image/AboutPageImage/AloeVeraC.jpg" },
              { name: "Tulsi", desc: "Heals & Balances", img: "/Image/AboutPageImage/TulsiC.jpg" },
              { name: "Fennel", desc: "Cools & Clarifies", img: "/Image/AboutPageImage/FennelSeeds.jpg" },
              { name: "Cardamom", desc: "Brightens & Tones", img: "/Image/AboutPageImage/GreenCardamomPodsC.jpg" },
              { name: "Turmeric", desc: "Glows & Protects", img: "/Image/AboutPageImage/TurmericC.jpg" }
            ].map((ing, idx) => (
              <motion.div key={idx} variants={fadeUpItem} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4 relative transition-transform duration-500 group-hover:-translate-y-3">
                  <img src={ing.img} alt={ing.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.85] group-hover:saturate-100" />
                  <div className="absolute inset-0 bg-[var(--color-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="font-serif font-medium text-black text-lg mb-1">{ing.name}</h4>
                <p className="text-xs text-[var(--color-dark-text)]/60 font-satoshi">{ing.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* 8. Daily Rituals Into Art Section */}
      {/* <section className="relative py-28 md:py-48 bg-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-7 relative h-[50vh] md:h-[70vh] w-full order-last lg:order-first mt-12 lg:mt-0">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} className="w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-[var(--color-primary)]/10 bg-white">
                <img src="/Image/AboutPageImage/Photo1.jpg" alt="Indian Gujarati woman enjoying mindful self-care ritual" loading="lazy" decoding="async" className="w-full h-full object-cover saturate-[0.85] transition-transform duration-1000 hover:scale-105" />
              </motion.div>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="lg:col-span-5 flex flex-col justify-center">
              <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-8 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[var(--color-primary)]/60"></span> The Living Devotion
              </motion.span>
              <motion.h2 variants={fadeUpItem} className="text-4xl sm:text-5xl md:text-6xl font-serif text-black leading-tight mb-8 font-light tracking-tight font-clash">
                Elevating Daily <br /> <span className="italic font-normal text-[var(--color-primary)]">Rituals Into Art.</span>
              </motion.h2>
              <motion.p variants={fadeUpItem} className="text-base md:text-lg text-[var(--color-dark-text)]/75 font-light font-satoshi leading-relaxed mb-6 text-justify">
                Skincare is not merely a task; it is the ultimate expression of kindness to yourself. In a loud and busy world, Hridhay Connect offers a calm space—a simple, slow, and completely organic experience that nurtures both your physical skin and your inner peace.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section> */}



      {/* 9. Timeline of Growth */}
      <section className="relative py-24 md:py-36 border-y border-[var(--color-primary)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
            <span className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Our Path</span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[var(--color-dark-text)] tracking-tight">Timeline of Growth</h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Central Line for Desktop, Left Line for Mobile */}
            <div className="absolute left-3.5 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-primary)]/20 md:-translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">

              {/* Milestone 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-3.5 md:left-1/2 top-2 md:top-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[3px] border-[var(--color-cream)] shadow-md md:-translate-x-1/2 md:-translate-y-1/2 z-10 transition-transform duration-500 group-hover:scale-125" />

                {/* Content - Left side */}
                <div className="pl-12 md:pl-0 md:w-1/2 md:pr-16 md:text-right">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2023 • The Conception</span>
                  <h4 className="text-2xl md:text-3xl font-serif font-light text-[var(--color-dark-text)] mt-2 mb-3">Honoring Ancient Wisdom</h4>
                  <p className="text-sm md:text-base text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi md:ml-auto max-w-md text-justify">
                    Hridhay Connect was founded by botanical alchemists and dermatological scientists to discover pure skincare formulas using certified organic, wild-harvested raw extracts.
                  </p>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Milestone 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between group md:flex-row-reverse"
              >
                {/* Dot */}
                <div className="absolute left-3.5 md:left-1/2 top-2 md:top-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[3px] border-[var(--color-cream)] shadow-md md:-translate-x-1/2 md:-translate-y-1/2 z-10 transition-transform duration-500 group-hover:scale-125" />

                {/* Content - Right side */}
                <div className="pl-12 md:pl-0 md:w-1/2 md:pl-16 md:text-left">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2024 • Organic Audits</span>
                  <h4 className="text-2xl md:text-3xl font-serif font-light text-[var(--color-dark-text)] mt-2 mb-3">Achieving Cruelty-Free Status</h4>
                  <p className="text-sm md:text-base text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi md:mr-auto max-w-md text-justify">
                    We built our extraction lab and secured rigorous certifications, proving that zero synthetic fillers or chemical additives are ever present in our product list.
                  </p>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Milestone 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between group"
              >
                {/* Dot */}
                <div className="absolute left-3.5 md:left-1/2 top-2 md:top-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[3px] border-[var(--color-cream)] shadow-md md:-translate-x-1/2 md:-translate-y-1/2 z-10 transition-transform duration-500 group-hover:scale-125" />

                {/* Content - Left side */}
                <div className="pl-12 md:pl-0 md:w-1/2 md:pr-16 md:text-right">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2025 • National Launch</span>
                  <h4 className="text-2xl md:text-3xl font-serif font-light text-[var(--color-dark-text)] mt-2 mb-3">Pioneering Organic Wellness</h4>
                  <p className="text-sm md:text-base text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi md:ml-auto max-w-md text-justify">
                    Officially launched Hridhay Connect website, delivering our signature serums to thousands of customers looking to restore harmony and natural skin radiance.
                  </p>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>

              {/* Milestone 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="relative flex flex-col md:flex-row items-start md:items-center justify-between group md:flex-row-reverse"
              >
                {/* Dot */}
                <div className="absolute left-3.5 md:left-1/2 top-2 md:top-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-[3px] border-[var(--color-cream)] shadow-md md:-translate-x-1/2 md:-translate-y-1/2 z-10 transition-transform duration-500 group-hover:scale-125" />

                {/* Content - Right side */}
                <div className="pl-12 md:pl-0 md:w-1/2 md:pl-16 md:text-left">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] font-general">2026 • Global Evolution</span>
                  <h4 className="text-2xl md:text-3xl font-serif font-light text-[var(--color-dark-text)] mt-2 mb-3">Expanding to Deep Skincare Devotion</h4>
                  <p className="text-sm md:text-base text-[var(--color-dark-text)]/70 font-light leading-relaxed font-satoshi md:mr-auto max-w-md text-justify">
                    Unveiling new high-potency toners and masks, continuing our commitment to sustainable packaging, clean trade, and luxury wellness.
                  </p>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* 10. Customer Love Section (Carousel on mobile, grid on desktop) */}
      {/* <section className="relative py-28 md:py-40 bg-white/60 border-y border-[var(--color-primary)]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUpContainer} className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Shared Journeys</motion.span>
            <motion.h2 variants={fadeUpItem} className="text-4xl md:text-6xl font-serif font-light text-black tracking-tight">Customer Love</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpContainer} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 md:grid md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0 -mx-4 md:mx-0">
            {[
              { name: "Aria M.", quote: "The Amethyst Revival Serum has completely transformed my daily ritual. My skin feels deeply balanced and has a natural radiance." },
              { name: "Julian K.", quote: "I love the complete omission of chemical additives. The Lavender Mask feels incredibly soothing on my face at night." },
              { name: "Elena R.", quote: "Hridhay Connect represents absolute purity. Knowing that every ingredient is ethically harvested makes this a proud purchase." },
              { name: "Ravi S.", quote: "The natural fragrance of the Neem soap is just breathtaking. Authentic handmade quality you can actually feel on your skin." },
              { name: "Maya T.", quote: "Their cold-pressed hair oil brought my roots back to life. Finally, a brand that stays true to holistic Indian roots." },
              { name: "Sara P.", quote: "Such a beautiful unboxing experience, and the products perform even better. The Turmeric glow cream is my holy grail!" }
            ].map((review, idx) => (
              <motion.div key={idx} variants={fadeUpItem} whileHover={{ y: -8, transition: { duration: 0.4 } }} className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center bg-white border border-white/50 p-8 rounded-3xl shadow-lg shadow-[var(--color-primary)]/5 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1.5 text-[var(--color-primary)] mb-8">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-base text-[var(--color-dark-text)]/80 font-light font-satoshi italic leading-relaxed mb-10">"{review.quote}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-primary)] font-serif font-semibold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-serif font-medium text-black text-sm">{review.name}</h5>
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-dark-text)]/50 font-general font-semibold">Verified Collector</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Premium Image Carousel Section */}
      <AboutImageCarousel />

      {/* 11. Newsletter Section */}
      {/* <section className="relative py-28 md:py-36 bg-white border-y border-[var(--color-primary)]/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUpContainer} className="bg-[var(--color-cream)] rounded-[3rem] p-12 md:p-20 shadow-xl border border-[var(--color-primary)]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-24 h-24 text-[var(--color-primary)]" /></div>

            <motion.div variants={fadeUpItem} className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] mx-auto mb-8 shadow-sm">
              <Mail className="w-8 h-8" />
            </motion.div>
            <motion.h2 variants={fadeUpItem} className="text-3xl md:text-5xl font-serif font-light text-black tracking-tight mb-4">
              Join the Hridhay Family
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-sm md:text-base text-[var(--color-dark-text)]/70 font-satoshi max-w-lg mx-auto mb-10">
              Subscribe to receive exclusive insights into our organic rituals, new arrivals, and holistic wellness guides directly to your inbox.
            </motion.p>

            <motion.form variants={fadeUpItem} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your Email Address" className="flex-1 bg-white border border-[var(--color-primary)]/20 rounded-full px-6 py-4 text-sm font-satoshi focus:outline-none focus:border-[var(--color-primary)] shadow-sm" required />
              <button type="submit" className="bg-[var(--color-primary)] text-white rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-widest font-general hover:bg-[var(--color-secondary)] transition-colors duration-300 shadow-md">
                Subscribe
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section> */}

      {/* 12. Premium CTA Section */}
      <section className="relative py-32 md:py-48 bg-[var(--color-dark-text)] text-[var(--color-cream)] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[70vw] h-[90vw] md:h-[70vw] rounded-full bg-[var(--color-primary)]/20 blur-[100px] md:blur-[150px] mix-blend-screen" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} className="flex items-center gap-3 mb-10 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md shadow-2xl">
            <Sparkle className="w-4 h-4 text-[var(--color-accent)] animate-spin-slow" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-white">
              The Path To Vitality
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 }} className="text-4xl sm:text-6xl md:text-8xl font-serif font-light text-white leading-[1.05] md:leading-[0.95] tracking-tight mb-8">
            Discover your skin's <br /> <span className="italic font-normal text-[var(--color-accent)]">true, raw essence.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.4 }} className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-14 font-light font-satoshi leading-relaxed">
            Explore our collection of wildcrafted, cold-pressed botanical active serums and restore harmony to your self-care ritual today.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.6 }}>
            <a href="#" className="rounded-full px-12 md:px-14 py-5 md:py-6 text-xs md:text-sm font-semibold bg-[var(--color-primary)] text-white border border-[var(--color-primary)]/50 backdrop-blur-md hover:bg-white hover:text-[var(--color-primary)] transition-all duration-500 shadow-xl shadow-[var(--color-primary)]/20 uppercase tracking-[0.2em] font-general inline-flex items-center gap-4 group">
              Shop The Collection <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
