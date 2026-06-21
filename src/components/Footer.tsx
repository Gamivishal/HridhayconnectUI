import { motion } from "motion/react";

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
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--color-accent)]">Shop</h4>
            <ul className="space-y-4">
              {['All Products', 'Bestsellers', 'Skincare', 'Body & Bath'].map(l => (
                <li key={l}><a href="#" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--color-accent)]">About</h4>
            <ul className="space-y-4">
              <li><a href="#about" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Our Story</a></li>
              <li><a href="#" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Ingredients</a></li>
              <li><a href="#" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Sustainability</a></li>
              <li><a href="#" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">Journal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[var(--color-accent)]">Connect</h4>
            <ul className="space-y-4">
              {['Instagram', 'Pinterest', 'Contact Us', 'FAQ'].map(l => (
                <li key={l}><a href="#" className="text-[var(--color-cream)]/70 hover:text-white transition-colors text-sm font-light">{l}</a></li>
              ))}
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
