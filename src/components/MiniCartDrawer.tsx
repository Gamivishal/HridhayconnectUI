import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

export function MiniCartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal,
    cartCount,
    isCartLoading
  } = useCart();

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close drawer and navigate to Cart Page
  const handleViewCart = () => {
    setIsCartOpen(false);
    window.location.hash = "#cart";
  };

  // Close drawer and simulate checkout
  const handleCheckout = () => {
    setIsCartOpen(false);
    // Dispatch a custom event to notify checkout initiation if needed, or simply route to cart
    window.location.hash = "#cart";
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* 1. Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#1b1720]/40 backdrop-blur-sm z-[9998]"
          />

          {/* 2. Slide-over or Slide-up panel */}
          <motion.div
            initial={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
            animate={isMobile ? { y: 0, x: 0 } : { x: 0, y: 0 }}
            exit={isMobile ? { y: "100%", x: 0 } : { x: "100%", y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className={`fixed z-[9999] flex flex-col p-6 shadow-2xl bg-white/90 backdrop-blur-xl border-white/50 transition-all duration-300 ${
              isMobile 
                ? "bottom-0 left-0 right-0 top-auto w-full h-[82vh] rounded-t-[2.5rem] border-t" 
                : "top-0 right-0 bottom-0 w-[420px] h-full rounded-l-[2rem] border-l"
            }`}
          >
            {isMobile && (
              <div className="w-12 h-1 bg-black/10 rounded-full mx-auto mb-4 flex-shrink-0" />
            )}
            {/* Header */}
            <div className="flex justify-between items-center pb-5 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-serif text-lg font-semibold text-black">Your Ritual Bag</span>
                <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[var(--color-dark-text)] transition-colors cursor-pointer"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-none">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] opacity-60">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-base font-medium text-black">Your Bag is Empty</h4>
                  <p className="text-xs text-[var(--color-dark-text)]/50 max-w-xs font-light font-satoshi leading-relaxed">
                    Begin your botanical wellness journey by adding handcrafted soaps, copper-brewed hair oils, or heritage spices to your daily rituals.
                  </p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout
                    key={item.product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/60 border border-white/80 p-4 rounded-3xl flex gap-3 shadow-sm group relative"
                  >
                    {/* Product Image */}
                    <div className="w-20 aspect-square rounded-2xl overflow-hidden bg-[var(--color-beige)]/20 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-serif text-xs font-semibold text-black line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                            {item.product.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            disabled={isCartLoading}
                            className={`text-[var(--color-dark-text)]/35 hover:text-red-500 transition-colors p-0.5 rounded ${isCartLoading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--color-primary)] font-semibold mt-0.5 block">
                          {item.product.category.replace("-", " ")}
                        </span>
                        {item.packingType && (
                          <div className="mt-1">
                            <span className="text-[9px] text-[var(--color-primary)] font-satoshi font-semibold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-md inline-block">
                              Packaging: {item.packingType}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls & Price */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center bg-black/5 rounded-full p-1 scale-90 origin-left">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={isCartLoading || item.quantity <= 1}
                            className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/5 transition-all ${(isCartLoading || item.quantity <= 1) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <Minus className="w-2 h-2 text-[var(--color-dark-text)]" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={isCartLoading}
                            className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/5 transition-all ${isCartLoading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <Plus className="w-2 h-2 text-[var(--color-dark-text)]" />
                          </button>
                        </div>
                        <span className="text-xs font-serif font-bold text-[var(--color-primary)]">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-black/5 pt-5 mt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--color-dark-text)]/50 font-medium">Subtotal</span>
                  <span className="font-serif font-bold text-black text-base">₹{cartSubtotal}</span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={handleViewCart}
                    className="w-full bg-white border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-xs font-semibold uppercase tracking-widest py-4 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Full Cart</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center text-[10px] uppercase tracking-wider text-[var(--color-dark-text)]/50 hover:text-[var(--color-primary)] transition-colors py-2 font-medium cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
