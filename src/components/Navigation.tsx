import { ChevronDown, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { StarButton } from "./ui/StarButton";
import { useSignUp } from "../context/SignUpContext";

interface NavigationProps {
  currentPage?: 'home' | 'about' | 'soap' | 'hair-oil' | 'mukhwas' | 'tea-masala' | 'hridhay-special' | 'product' | 'cart';
}

export function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  const { cartCount, setIsCartOpen, clearCart } = useCart();
  const { openSignUp } = useSignUp();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return typeof window !== 'undefined' && !!localStorage.getItem("authToken");
  });

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    checkAuth();
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerProfile");
    localStorage.removeItem("hridhay_checkout");
    localStorage.removeItem("hridhay_cart");
    clearCart();
    window.dispatchEvent(new Event("auth-change"));
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const categories = [
    {
      title: "Botanical Care",
      items: [
        { name: "Home Made Soap", desc: "Cold-pressed organic oils for gentle hydration", path: "#soap", icon: "✨" },
        { name: "Home Made Hair Oil", desc: "Nourishing herbal infusion for root-to-tip vitality", path: "#hair-oil", icon: "🌿" },
        { name: "Hridhay Special", desc: "Premium handcrafted skincare & healing elixirs", path: "#hridhay-special", icon: "💎" },
      ]
    },
    {
      title: "Wellness Kitchen",
      items: [
        { name: "Mukhwas", desc: "Traditional digestive mouth freshener with organic seeds", path: "#mukhwas", icon: "🌱" },
        { name: "Tea Masala", desc: "Aromatic heritage spice blend with cardamom & ginger", path: "#tea-masala", icon: "☕" },
      ]
    }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/75 backdrop-blur-2xl border-b border-[#5B2A86]/8 shadow-[0_4px_24px_rgba(91,42,134,0.07)]'
            : 'bg-transparent'
        }`}
      >
        {/* Subtle gradient glow at top */}
        {!scrolled && (
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(91,42,134,0.04) 0%, transparent 100%)'
            }}
          />
        )}

        <nav className="relative flex items-center justify-between px-5 md:px-8 max-w-7xl mx-auto w-full h-[64px] md:h-[72px]">

          {/* ── LEFT: Logo ── */}
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="flex-shrink-0 cursor-pointer select-none z-10 group"
            aria-label="Hridhay Connect Home"
          >
            <motion.img
              src="/logo.webp"
              alt="Hridhay Connect"
              className="h-[34px] sm:h-10 md:h-12 w-auto object-contain"
              initial={false}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </a>

          {/* ── CENTER: Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a
              href="#"
              onClick={() => setIsOpen(false)}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${currentPage === 'home' ? 'text-[#5B2A86] font-bold' : 'text-[#1B1720] hover:text-[#7A49A5]'}`}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${currentPage === 'about' ? 'text-[#5B2A86] font-bold' : 'text-[#1B1720] hover:text-[#7A49A5]'}`}
            >
              About
            </a>

            {/* Shop By Category Trigger & Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  isOpen || ['soap','hair-oil','mukhwas','tea-masala','hridhay-special'].includes(currentPage)
                    ? 'text-[#5B2A86] font-bold'
                    : 'text-[#1B1720] hover:text-[#7A49A5]'
                }`}
              >
                <span>Shop By Category</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#5B2A86]' : 'rotate-0'}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[760px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-[0_20px_50px_rgba(91,42,134,0.08)] overflow-hidden z-50 p-8 grid grid-cols-12 gap-8 text-left"
                  >
                    {categories.map((category, index) => (
                      <div key={index} className="col-span-4 flex flex-col">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5B2A86]/80 mb-6 border-b border-[#5B2A86]/5 pb-2">
                          {category.title}
                        </span>
                        <div className="flex flex-col gap-3">
                          {category.items.map((item, itemIdx) => (
                            <a
                              key={itemIdx}
                              href={item.path}
                              onClick={() => setIsOpen(false)}
                              className="group relative flex flex-col p-3 rounded-2xl transition-all duration-300 hover:bg-[#5B2A86]/5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-0 before:bg-[#5B2A86] before:rounded-full hover:before:h-1/2 before:transition-all before:duration-300"
                            >
                              <div className="flex items-center gap-2 group-hover:translate-x-1.5 transition-transform duration-300">
                                <span className="text-sm">{item.icon}</span>
                                <span className="text-xs font-semibold text-[#1B1720] group-hover:text-[#5B2A86] transition-colors">
                                  {item.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#1B1720]/50 mt-1 pl-7 font-light font-satoshi group-hover:translate-x-1.5 transition-transform duration-300">
                                {item.desc}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Featured Card */}
                    <div className="col-span-4 bg-gradient-to-br from-[#5B2A86]/5 to-[#A678D6]/5 rounded-2xl p-5 border border-[#5B2A86]/10 flex flex-col justify-between relative overflow-hidden group/card">
                      <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-[#5B2A86]/10 blur-xl group-hover/card:scale-125 transition-transform duration-500" />
                      <div>
                        <div className="inline-flex items-center gap-1.5 bg-[#5B2A86]/15 text-[#5B2A86] px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-4">
                          <Sparkles className="w-3 h-3 text-[#5B2A86] animate-pulse" />
                          <span>Ritual Selection</span>
                        </div>
                        <h4 className="text-xs font-serif font-semibold text-[#1B1720] mb-1">Amethyst Revival Serum</h4>
                        <p className="text-[10px] text-[#1B1720]/60 leading-relaxed font-light font-satoshi">
                          Nurture skin's cellular beauty with wild-harvested lavender active & cold-pressed nectar.
                        </p>
                      </div>
                      <a
                        href="#featured"
                        onClick={() => setIsOpen(false)}
                        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#5B2A86] hover:text-[#7A49A5] transition-colors group/link"
                      >
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#hridhay-special"
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${currentPage === 'hridhay-special' ? 'text-[#5B2A86] font-bold' : 'text-[#1B1720] hover:text-[#7A49A5]'}`}
            >
              Hridhay Special
            </a>
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">

            {/* Cart Button */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#1B1720] cursor-pointer z-10 transition-colors hover:bg-[#5B2A86]/6"
              aria-label="Shopping Cart"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
            >
              <ShoppingBag className="w-[19px] h-[19px] stroke-[1.6]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute top-[7px] right-[7px] min-w-[15px] h-[15px] bg-[#5B2A86] text-white text-[8px] font-bold rounded-full flex items-center justify-center px-[3px] leading-none shadow-[0_2px_8px_rgba(91,42,134,0.45)]"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Desktop Sign Up CTA — desktop only, never shows on mobile */}
            {isLoggedIn ? (
              <StarButton
                onClick={handleLogout}
                style={{
                  paddingLeft: "1.375rem",
                  paddingRight: "1.375rem",
                  paddingTop: "0.55rem",
                  paddingBottom: "0.55rem",
                  fontSize: "0.625rem",
                  letterSpacing: "0.18em",
                  display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : undefined,
                }}
                className="!hidden md:!inline-flex"
              >
                Logout
              </StarButton>
            ) : (
              <StarButton
                onClick={openSignUp}
                style={{
                  paddingLeft: "1.375rem",
                  paddingRight: "1.375rem",
                  paddingTop: "0.55rem",
                  paddingBottom: "0.55rem",
                  fontSize: "0.625rem",
                  letterSpacing: "0.18em",
                  display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : undefined,
                }}
                className="!hidden md:!inline-flex"
              >
                Sign Up
              </StarButton>
            )}

            {/* Mobile Hamburger */}
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden relative flex flex-col items-center justify-center w-10 h-10 rounded-full cursor-pointer z-10 transition-colors hover:bg-[#5B2A86]/6 flex-shrink-0"
              aria-label="Open Menu"
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <span className="flex flex-col gap-[5px] w-[18px]">
                <span className="block h-[1.5px] w-full bg-[#1B1720] rounded-full transition-all duration-300" />
                <span className="block h-[1.5px] w-[13px] self-end bg-[#1B1720] rounded-full transition-all duration-300" />
              </span>
            </motion.button>

          </div>
        </nav>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] md:hidden"
              style={{ background: 'rgba(27,23,32,0.52)', backdropFilter: 'blur(6px)' }}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 240, mass: 0.8 }}
              className="fixed top-0 right-0 bottom-0 z-[70] md:hidden flex flex-col overflow-hidden"
              style={{
                width: "min(340px, 88vw)",
                background: "linear-gradient(160deg, rgba(247,243,250,0.97) 0%, rgba(232,220,245,0.95) 100%)",
                backdropFilter: "blur(28px) saturate(1.6)",
                borderLeft: "1px solid rgba(166,120,214,0.18)",
                boxShadow: "-12px 0 48px rgba(91,42,134,0.12)",
              }}
            >
              {/* Decorative ambient glow */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(166,120,214,0.2) 0%, transparent 70%)",
                  transform: "translate(30%, -30%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(91,42,134,0.08) 0%, transparent 70%)",
                  transform: "translate(-30%, 30%)",
                }}
              />

              {/* Drawer Header */}
              <div className="relative flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#5B2A86]/8">
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                  <img
                    src="/logo.webp"
                    alt="Hridhay Connect"
                    className="h-9 w-auto object-contain"
                  />
                </a>

                {/* Close Button */}
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors"
                  style={{
                    background: "rgba(91,42,134,0.07)",
                    border: "1px solid rgba(91,42,134,0.12)",
                  }}
                  aria-label="Close Menu"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ background: "rgba(91,42,134,0.12)" }}
                >
                  {/* Custom X icon — two thin lines */}
                  <span className="relative w-[14px] h-[14px] flex items-center justify-center">
                    <span
                      className="absolute w-full h-[1.5px] rounded-full bg-[#5B2A86]"
                      style={{ transform: "rotate(45deg)" }}
                    />
                    <span
                      className="absolute w-full h-[1.5px] rounded-full bg-[#5B2A86]"
                      style={{ transform: "rotate(-45deg)" }}
                    />
                  </span>
                </motion.button>
              </div>

              {/* Drawer Nav Items */}
              <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-1">

                {/* Nav Links */}
                {[
                  { label: "Home", href: "#", page: "home" },
                  { label: "About", href: "#about", page: "about" },
                  { label: "Hridhay Special", href: "#hridhay-special", page: "hridhay-special" },
                ].map((link, i) => (
                  <motion.a
                    key={link.page}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full py-3.5 px-1 border-b border-[#5B2A86]/6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textDecoration: "none" }}
                    whileTap={{ x: 4 }}
                  >
                    <span
                      className={`font-serif text-base tracking-wide ${
                        currentPage === link.page
                          ? "text-[#5B2A86] font-semibold"
                          : "text-[#1B1720] font-medium"
                      }`}
                    >
                      {link.label}
                    </span>
                    {currentPage === link.page && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B2A86] flex-shrink-0" />
                    )}
                  </motion.a>
                ))}

                {/* Shop By Category Accordion */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-[#5B2A86]/6"
                >
                  <button
                    onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                    className="flex items-center justify-between w-full py-3.5 px-1 cursor-pointer"
                  >
                    <span className="font-serif text-base tracking-wide text-[#1B1720] font-medium">
                      Shop By Category
                    </span>
                    <motion.span
                      animate={{ rotate: mobileCategoryOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#5B2A86]" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {mobileCategoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 space-y-4 pl-2">
                          {categories.map((category, index) => (
                            <div key={index} className="space-y-1.5">
                              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#7A49A5] font-semibold pt-2">
                                {category.title}
                              </span>
                              {category.items.map((item, itemIdx) => (
                                <a
                                  key={itemIdx}
                                  href={item.path}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl transition-all duration-200 hover:bg-[#5B2A86]/6 group"
                                  style={{ textDecoration: "none" }}
                                >
                                  <span className="text-sm leading-none">{item.icon}</span>
                                  <span className="text-sm text-[#1B1720]/80 font-satoshi font-light group-hover:text-[#5B2A86] transition-colors">
                                    {item.name}
                                  </span>
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Cart Link */}
                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-between w-full py-3.5 px-1 border-b border-[#5B2A86]/6 cursor-pointer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileTap={{ x: 4 }}
                >
                  <span className="font-serif text-base tracking-wide text-[#1B1720] font-medium">
                    Shopping Cart
                  </span>
                  <div className="flex items-center gap-2">
                    {cartCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-[#5B2A86] text-white text-[9px] font-bold px-1.5 shadow-[0_2px_8px_rgba(91,42,134,0.35)]">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                    <ShoppingBag className="w-4 h-4 text-[#5B2A86]/60" />
                  </div>
                </motion.button>

                {/* Contact Link */}
                <motion.a
                  href="#footer"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setTimeout(() => {
                      const footer = document.querySelector("footer");
                      if (footer) footer.scrollIntoView({ behavior: "smooth" });
                    }, 200);
                  }}
                  className="flex items-center justify-between w-full py-3.5 px-1 border-b border-[#5B2A86]/6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.26, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ textDecoration: "none" }}
                  whileTap={{ x: 4 }}
                >
                  <span className="font-serif text-base tracking-wide text-[#1B1720] font-medium">
                    Contact
                  </span>
                </motion.a>

                {/* Sign Up / Login or Logout */}
                {isLoggedIn ? (
                  <motion.button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-between w-full py-3.5 px-1 cursor-pointer border-b border-[#5B2A86]/6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.30, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    whileTap={{ x: 4 }}
                  >
                    <span className="font-serif text-base tracking-wide text-red-600 font-semibold">
                      Logout
                    </span>
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 bg-red-100 text-red-600 shadow"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSignUp();
                    }}
                    className="flex items-center justify-between w-full py-3.5 px-1 cursor-pointer border-b border-[#5B2A86]/6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.30, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    whileTap={{ x: 4 }}
                  >
                    <span className="font-serif text-base tracking-wide text-[#5B2A86] font-semibold">
                      Sign Up / Login
                    </span>
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #5B2A86, #A678D6)",
                        boxShadow: "0 2px 10px rgba(91,42,134,0.3)",
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                  </motion.button>
                )}
              </div>

              {/* Drawer CTA Footer */}
              {!isLoggedIn && (
                <motion.div
                  className="relative px-6 py-5 border-t border-[#5B2A86]/8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openSignUp();
                    }}
                    className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl cursor-pointer"
                    style={{
                      height: "52px",
                      background: "linear-gradient(135deg, #5B2A86 0%, #7A49A5 55%, #A678D6 100%)",
                      border: "1px solid rgba(166,120,214,0.3)",
                      boxShadow: "0 8px 28px rgba(91,42,134,0.32), inset 0 1px 0 rgba(255,255,255,0.12)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {/* Shimmer sweep */}
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmerPill 3.5s ease-in-out infinite",
                      }}
                    />
                    <span className="relative z-10">Create Account — It's Free</span>
                  </button>

                  <p className="text-center text-[10px] text-[#1B1720]/35 mt-3 font-satoshi font-light tracking-wide">
                    Join 2,400+ wellness seekers
                  </p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global shimmer keyframe */}
      <style>{`
        @keyframes shimmerPill {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </>
  );
}
