import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";
import { InnerPageBanner } from "./InnerPageBanner";

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Contact Us | Hridhay Connect";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const fadeUpItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative w-full bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans">
      <InnerPageBanner
        eyebrow="Get in Touch"
        title="Contact"
        titleAccent="Us"
        subtitle="We'd love to hear from you. Reach out for any questions about our artisanal skincare, order inquiries, or just to say hello."
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: "Contact" },
        ]}
        bgImage="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1920&auto=format&fit=crop"
        decorativeEmoji="💌"
      />

      <section className="py-24 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto z-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column - Contact Info */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, margin: "-100px" }} 
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <motion.span variants={fadeUpItem} className="text-[var(--color-primary)] font-medium tracking-[0.2em] uppercase text-xs mb-6 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[var(--color-primary)]/60"></span> Let's Talk
            </motion.span>
            
            <motion.h2 variants={fadeUpItem} className="text-4xl sm:text-5xl font-serif text-black leading-[1.1] mb-8 font-light tracking-tight">
              We are here to <span className="italic text-[var(--color-primary)]">assist you.</span>
            </motion.h2>
            
            <motion.p variants={fadeUpItem} className="text-base text-[var(--color-dark-text)]/70 font-light font-satoshi mb-12 leading-relaxed text-justify">
              Whether you have a question about our botanical ingredients, need assistance with your order, or simply want skincare advice, our dedicated team is always ready to help.
            </motion.p>

            <motion.div variants={fadeUpItem} className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-black mb-1">Our Studio</h4>
                  <p className="text-sm font-light text-[var(--color-dark-text)]/70 leading-relaxed">
                    303, APM Mall Complex, Near Bharat Petrol Pump<br />
                    Sattadhar Cross Road, Ghatlodiya<br />
                    Ahmedabad 380061, Gujarat, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-black mb-1">Email Us</h4>
                  <p className="text-sm font-light text-[var(--color-dark-text)]/70 leading-relaxed break-all">
                    hridhayconnect1@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white border border-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-black mb-1">Call Us</h4>
                  <p className="text-sm font-light text-[var(--color-dark-text)]/70 leading-relaxed">
                    +91 927444617<br />
                    Mon - Sat, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-[var(--color-primary)]/5 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[var(--color-secondary)]/5 to-transparent rounded-tr-full pointer-events-none" />

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6">
                    <Send className="w-8 h-8 text-[var(--color-primary)] ml-1" />
                  </div>
                  <h3 className="text-3xl font-serif text-black mb-4">Message Sent!</h3>
                  <p className="text-[var(--color-dark-text)]/70 font-light max-w-md mx-auto">
                    Thank you for reaching out. We have received your message and will get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-[var(--color-primary)] text-sm uppercase tracking-widest font-semibold hover:text-black transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-wider text-[var(--color-dark-text)]/60 font-semibold pl-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      maxLength={150}
                      className="w-full bg-white/80 border border-black/5 rounded-2xl px-5 py-4 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-sm font-light placeholder:text-black/30"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs uppercase tracking-wider text-[var(--color-dark-text)]/60 font-semibold pl-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        maxLength={100}
                        className="w-full bg-white/80 border border-black/5 rounded-2xl px-5 py-4 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-sm font-light placeholder:text-black/30"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="mobile" className="text-xs uppercase tracking-wider text-[var(--color-dark-text)]/60 font-semibold pl-2">Mobile Number</label>
                      <input 
                        type="tel" 
                        id="mobile" 
                        required
                        maxLength={10}
                        onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                        className="w-full bg-white/80 border border-black/5 rounded-2xl px-5 py-4 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-sm font-light placeholder:text-black/30"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs uppercase tracking-wider text-[var(--color-dark-text)]/60 font-semibold pl-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      required
                      maxLength={200}
                      className="w-full bg-white/80 border border-black/5 rounded-2xl px-5 py-4 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-sm font-light placeholder:text-black/30"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs uppercase tracking-wider text-[var(--color-dark-text)]/60 font-semibold pl-2">Message</label>
                    <textarea 
                      id="message" 
                      required
                      maxLength={500}
                      rows={5}
                      className="w-full bg-white/80 border border-black/5 rounded-2xl px-5 py-4 outline-none focus:border-[var(--color-primary)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-sm font-light placeholder:text-black/30 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[var(--color-primary)]/20"
                  >
                    <span className="text-sm font-semibold uppercase tracking-widest">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
