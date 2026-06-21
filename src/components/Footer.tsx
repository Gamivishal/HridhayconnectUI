import { motion } from "motion/react";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-dark-text)] text-[var(--color-cream)] pt-24 pb-12 relative overflow-hidden rounded-t-[3rem] mt-[-2rem] z-20">

      {/* Footer Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] bg-[var(--color-primary)] opacity-20 blur-[150px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">

        {/* Newsletter Section */}
        {/* <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24 pb-20 border-b border-white/10">
          <div className="max-w-xl">
            <h3 className="text-3xl md:text-5xl font-serif mb-4">Join the Ritual</h3>
            <p className="text-[var(--color-cream)]/70 font-light">Subscribe to receive gentle reminders, exclusive preview access, and wellness insights from our founders.</p>
          </div>
          <div className="w-full md:w-auto relative group flex-1 max-w-md">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-transparent border-b border-white/30 py-4 pl-2 pr-28 text-[var(--color-cream)] placeholder-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium tracking-widest uppercase hover:text-[var(--color-accent)] transition-colors">
              Subscribe
            </button>
          </div>
        </div> */}

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
             {/* <a href="#" className="text-2xl font-serif font-medium tracking-tight mb-6 block hover:opacity-80 transition-opacity">
               Hridhay<span className="italic text-[var(--color-accent)]">Connect</span>
             </a> */}
             <a href="#" className="block hover:opacity-80 transition-opacity mb-6">
               <img src="/logo.webp" alt="HridhayConnect Logo" className="h-12 w-auto" />
             </a>
            <p className="text-sm text-[var(--color-cream)]/50 font-light">
              Elevating the everyday through pure, nature-driven wellness.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--color-accent)]">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Home</a></li>
              <li><a href="#about" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">About</a></li>
              <li><a href="#hridhay-special" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Hridhay Special</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--color-accent)]">Category</h4>
            <ul className="space-y-4">
              <li><a href="#soap" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Soaps</a></li>
              <li><a href="#hair-oil" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Hair Oil</a></li>
              <li><a href="#mukhwas" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Mukhwas</a></li>
              <li><a href="#tea-masala" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Tea Masala</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--color-accent)]">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                <a href="tel:+91927444617" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">
                  +91 927444617
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                <a href="mailto:hridhayconnect1@gmail.com" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light break-all">
                  hridhayconnect1@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span className="text-[var(--color-cream)]/70 text-sm font-light leading-relaxed">
                  303, APM Mall Complex, Near Bharat Petrol Pump, Sattadhar Cross Road, Ghatlodiya Ahmedabad 380061, Gujarat, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[var(--color-cream)]/40 font-light">
          <p>&copy; {new Date().getFullYear()} Hridhay Connect. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[var(--color-cream)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--color-cream)] transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
