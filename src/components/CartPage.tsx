import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { post } from "../api/BaseService";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShieldCheck,
  Truck, HelpCircle, Tag, Check, CreditCard, Sparkles
} from "lucide-react";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    clearCart,
    prepareCheckout,
    syncCartWithApi,
    isCartLoading
  } = useCart();

  useEffect(() => {
    syncCartWithApi();
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);
  const [appliedOffers, setAppliedOffers] = useState<any[]>([]);
  const [isOffersLoading, setIsOffersLoading] = useState(false);
  const [offerMessage, setOfferMessage] = useState({ text: "", type: "" });

  // Free shipping threshold
  const shippingThreshold = 500;
  const shippingCost = cartSubtotal >= shippingThreshold || cartSubtotal === 0 ? 0 : 60;
  const progressToFreeShipping = Math.min((cartSubtotal / shippingThreshold) * 100, 100);

  const fetchOffers = async (code = "", selectedId = 0, removeId = 0) => {
    try {
      setIsOffersLoading(true);
      setOfferMessage({ text: "", type: "" });
      const customerId = localStorage.getItem("customerId") || "0";
      const body: any = {
        customerId: Number(customerId)
      };
      if (code) body.couponCode = code;
      if (selectedId) body.selectedOfferId = selectedId;
      if (removeId) body.removeOfferId = removeId;
      
      const response: any = await post("/Cart/ApplyOffersToCart", body);
      if (response && response.data) {
        const t2 = response.data.table2 || [];
        const t3 = response.data.table3 || [];
        
        // table3 represents explicitly Applied Offers from the backend. 
        // We force IsAlreadyApplied to 1 so the merge logic correctly identifies them.
        t3.forEach((o: any) => {
           o.IsAlreadyApplied = 1;
        });

        const checkIsApplied = (o: any) => Number(o.IsAlreadyApplied) === 1 || String(o.IsAlreadyApplied).toLowerCase() === 'true';

        const uniqueOffersMap = new Map();
        [...t2, ...t3].forEach((offer: any) => {
          if (!uniqueOffersMap.has(offer.Id)) {
            uniqueOffersMap.set(offer.Id, offer);
          } else {
            const existing = uniqueOffersMap.get(offer.Id);
            // Always prefer the version that says it is applied
            if (checkIsApplied(offer)) {
              uniqueOffersMap.set(offer.Id, offer);
            } else if (!checkIsApplied(existing) && offer.FinalDiscount !== undefined && offer.FinalDiscount > (existing.FinalDiscount || 0)) {
              uniqueOffersMap.set(offer.Id, offer);
            }
          }
        });
        const uniqueOffers = Array.from(uniqueOffersMap.values());

        setAppliedOffers(uniqueOffers.filter((o: any) => checkIsApplied(o)));
        
        const available = uniqueOffers.filter((o: any) => !checkIsApplied(o));
        available.sort((a: any, b: any) => {
          if (b.FinalDiscount !== a.FinalDiscount) return b.FinalDiscount - a.FinalDiscount; // Highest FinalDiscount
          if (a.Priority !== b.Priority) return a.Priority - b.Priority; // Lowest Priority
          return b.DiscountValue - a.DiscountValue; // Highest DiscountValue
        });
        setAvailableOffers(available);

        if (code) {
           const applied = uniqueOffers.find((o: any) => checkIsApplied(o) && (o.CouponCode === code || o.DiscountType));
           if (applied) {
             setOfferMessage({ text: "Coupon applied successfully!", type: "success" });
           } else {
             setOfferMessage({ text: "Invalid or inapplicable coupon code.", type: "error" });
           }
        } else if (selectedId) {
           setOfferMessage({ text: "Offer applied successfully!", type: "success" });
        } else if (removeId) {
           setOfferMessage({ text: "Offer removed.", type: "success" });
        }
      }
    } catch (err) {
      console.error("[fetchOffers] Error fetching offers:", err);
      setOfferMessage({ text: "Failed to process offer.", type: "error" });
    } finally {
      setIsOffersLoading(false);
    }
  };

  useEffect(() => {
    if (cartSubtotal > 0) {
      fetchOffers();
    } else {
      setAppliedOffers([]);
      setAvailableOffers([]);
    }
  }, [cartItems, cartSubtotal]);

  // Apply Coupon Code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim();
    if (code && !isOffersLoading) {
      fetchOffers(code, 0, 0);
    }
  };

  const discountAmount = appliedOffers.reduce((sum, offer) => sum + (offer.FinalDiscount || 0), 0);
  const orderTotal = cartSubtotal - discountAmount + shippingCost;

  // Prepare checkout items and redirect
  const handlePlaceOrder = () => {
    prepareCheckout(cartItems, appliedOffers);
    window.location.hash = "#checkout";
  };

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-cream)] text-[var(--color-dark-text)] overflow-hidden font-sans pt-[90px] pb-24">
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary)]/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-[var(--color-accent)]/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Navigation & Breadcrumbs */}
        <div className="flex justify-between items-center py-6 border-b border-[var(--color-primary)]/5 mb-10">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Continue Shopping</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-dark-text)]/40">
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[var(--color-primary)] font-semibold">Shopping Cart</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif text-black leading-tight mb-8 tracking-tight">
          Your Shopping Bag
        </h1>

        {orderCompleted ? (
          /* Order Complete Confirmation Page */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white/70 backdrop-blur-xl border border-white p-8 sm:p-12 rounded-[3.5rem] shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 animate-pulse" />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-semibold flex items-center gap-2 justify-center">
              <Sparkles className="w-3.5 h-3.5" />
              Order Confirmed
            </span>

            <h2 className="text-3xl font-serif font-light text-black">Your Wellness Journey Begins</h2>

            <p className="text-sm text-[var(--color-dark-text)]/70 font-light font-satoshi leading-relaxed">
              Thank you for choosing Hridhay Connect. We are preparing your handcrafted organic items with care. Your order details and tracking link have been dispatched.
            </p>

            <div className="bg-black/5 p-4 rounded-2xl inline-flex flex-col gap-1.5 text-xs font-general font-medium">
              <span className="text-[var(--color-dark-text)]/50 uppercase tracking-widest">Order Reference</span>
              <span className="text-black font-semibold text-sm tracking-wider">{generatedOrderId}</span>
            </div>

            <div className="pt-6">
              <a
                href="#"
                className="inline-flex justify-center bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xs font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-md cursor-pointer"
              >
                Back To Home
              </a>
            </div>
          </motion.div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="py-20 text-center max-w-lg mx-auto space-y-6 bg-white/30 backdrop-blur-md rounded-[3rem] border border-white/50 p-10 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] mx-auto opacity-70">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif text-black font-medium">Your Bag is Empty</h2>
            <p className="text-sm text-[var(--color-dark-text)]/60 font-light font-satoshi leading-relaxed">
              It seems you haven't added any products to your cart yet. Discover our ranges of handcrafted cold-pressed soaps, copper-boiled hair oils, and raw forest spice blends to begin.
            </p>
            <div className="pt-4">
              <a
                href="#"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xs font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition-all shadow-md cursor-pointer"
              >
                Start Shopping
              </a>
            </div>
          </div>
        ) : (
          /* Active Cart List & Summary Grid */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-start w-full">

            {/* Left Column: Items List */}
            <div className="w-full lg:col-span-8 space-y-6">

              {/* Shipping Progress Meter */}
              <div className="bg-white/50 backdrop-blur-md border border-white p-5 rounded-3xl shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[var(--color-dark-text)]/70">
                    <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                    {cartSubtotal >= shippingThreshold ? (
                      <span className="font-semibold text-emerald-600">Congrats! You qualify for Free Shipping.</span>
                    ) : (
                      <span>Spend <span className="font-serif font-semibold">₹{shippingThreshold - cartSubtotal}</span> more to get <strong>Free Shipping</strong>.</span>
                    )}
                  </span>
                  <span className="font-semibold text-[var(--color-dark-text)]/40">₹{cartSubtotal} / ₹{shippingThreshold}</span>
                </div>
                <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToFreeShipping}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    layout
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white/60 backdrop-blur-md border border-white/80 p-5 rounded-[2.2rem] shadow-sm flex flex-col sm:flex-row gap-5 items-stretch sm:items-center relative group"
                  >
                    {/* Product Image */}
                    <div className="w-24 sm:w-28 aspect-square rounded-[1.8rem] overflow-hidden bg-[var(--color-beige)]/20 flex-shrink-0 relative">
                      <img src={item.product.images[0]} alt={item.product.name} loading="lazy" decoding="async" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                    </div>

                    {/* Product Details & Meta */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg sm:text-xl text-black font-semibold line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            disabled={isCartLoading}
                            className={`text-[var(--color-dark-text)]/30 hover:text-red-500 transition-colors p-1 rounded ${isCartLoading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-semibold block">
                          {item.product.category.replace("-", " ")}
                        </span>

                        <p className="text-[11.5px] text-[var(--color-dark-text)]/50 font-light font-satoshi line-clamp-2 leading-relaxed">
                          {item.product.tagline}
                        </p>
                        {item.packingType && (
                          <div className="mt-1.5">
                            <span className="text-[10px] text-[var(--color-primary)] font-satoshi font-semibold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-full inline-block">
                              Packaging: {item.packingType}
                            </span>
                          </div>
                        )}
                        {(() => {
                          const remaining = item.product.totalAvailableStock !== undefined ? Math.max(0, item.product.totalAvailableStock - item.quantity) : undefined;
                          if (remaining !== undefined && remaining <= 10) {
                            return (
                              <div className="mt-1.5">
                                <span className="text-[10px] text-red-600 font-satoshi font-semibold bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                  Only {remaining} left!
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      {/* Quantity & Pricing details */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-black/5">
                        <div className="flex items-center bg-black/5 rounded-full p-1 scale-95 origin-left">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={isCartLoading || item.quantity <= 1}
                            className={`w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 transition-all ${(isCartLoading || item.quantity <= 1) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <Minus className="w-3.5 h-3.5 text-[var(--color-dark-text)]" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold font-general">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.totalAvailableStock ?? Infinity))}
                            disabled={isCartLoading || item.quantity >= (item.product.totalAvailableStock ?? Infinity)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/5 transition-all ${(isCartLoading || item.quantity >= (item.product.totalAvailableStock ?? Infinity)) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <Plus className="w-3.5 h-3.5 text-[var(--color-dark-text)]" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[var(--color-dark-text)]/40 block">Total</span>
                          <span className="text-base sm:text-lg font-serif font-bold text-[var(--color-primary)]">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>

            {/* Right Column: Sticky Summary */}
            <div className="w-full lg:col-span-4 lg:sticky lg:top-[110px] space-y-6">

              {/* Summary card */}
              <div className="bg-white/70 backdrop-blur-xl border border-white p-6 sm:p-8 rounded-[3rem] shadow-md space-y-6">
                <h3 className="font-serif text-xl font-semibold text-black border-b border-black/5 pb-4">
                  Order Summary
                </h3>

                {/* Pricing details stack */}
                <div className="space-y-3.5 text-xs text-[var(--color-dark-text)]/70">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-serif font-medium text-black">₹{cartSubtotal}</span>
                  </div>

                  {appliedOffers.length > 0 && appliedOffers.map((offer, idx) => (
                    <div key={idx} className="flex justify-between items-center text-emerald-600">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{offer.OfferName || "Discount"}</span>
                        <button
                          onClick={() => fetchOffers("", 0, offer.Id)}
                          className="text-red-400 hover:text-red-600 text-[9px] uppercase font-bold text-left tracking-wider w-fit cursor-pointer mt-0.5"
                        >
                          Remove
                        </button>
                      </div>
                      <span className="font-serif font-semibold">- ₹{offer.FinalDiscount}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span>Delivery Fee</span>
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--color-dark-text)]/30 hover:text-[var(--color-primary)] cursor-help" />
                    </span>
                    <span className="font-serif font-medium text-black">
                      {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                    </span>
                  </div>

                  <div className="border-t border-black/5 pt-4 mt-2 flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-black">Total Cost</span>
                    <span className="text-2xl font-serif font-bold text-[var(--color-primary)]">
                      ₹{orderTotal}
                    </span>
                  </div>
                </div>

                {/* Merged Offers Section (Applied Offers removed from here) */}

                {/* Offer Status Message */}
                {offerMessage.text && (
                  <div className={`p-3 rounded-xl border flex items-center justify-center text-xs font-semibold shadow-sm transition-all animate-in fade-in zoom-in-95 ${
                    offerMessage.type === 'success' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    {offerMessage.text}
                  </div>
                )}

                {/* Promo Code Input Form */}
                <form onSubmit={handleApplyPromo} className="border-t border-black/5 pt-6 mt-4 space-y-3">
                  <span className="text-[11px] uppercase tracking-widest text-[var(--color-dark-text)]/60 font-bold block">
                    Promo Code
                  </span>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[var(--color-dark-text)]/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="ENTER COUPON"
                        disabled={isOffersLoading}
                        className={`w-full bg-black/5 border border-transparent focus:border-[var(--color-primary)]/20 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none uppercase shadow-inner transition-colors ${isOffersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isOffersLoading}
                      className={`bg-black/5 hover:bg-black/10 border border-black/5 text-[var(--color-dark-text)] text-xs font-bold uppercase tracking-wider px-6 rounded-xl transition-colors cursor-pointer ${isOffersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isOffersLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </form>

                {/* All Offers Section */}
                <div className="border-t border-black/5 pt-5 mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-dark-text)]/60">
                      Offers
                    </h4>
                  </div>
                  {([...appliedOffers, ...availableOffers].length === 0) ? (
                    <p className="text-xs text-[var(--color-dark-text)]/50 italic font-light">
                      No offers available for this cart.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 pb-1">
                      {[...appliedOffers, ...availableOffers].map((offer, index) => {
                        const isApplied = Number(offer.IsAlreadyApplied) === 1 || String(offer.IsAlreadyApplied).toLowerCase() === 'true';

                        if (isApplied) {
                          return (
                            <div key={index} className="group bg-emerald-50/50 hover:bg-emerald-50 transition-all duration-300 border border-emerald-200/60 hover:border-emerald-300/80 rounded-2xl p-4.5 flex flex-col gap-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.15)] relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>
                              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full blur-2xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                              
                              <div className="flex justify-between items-start relative z-10 pl-1">
                                <div className="flex flex-col gap-1.5 pr-3">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-emerald-100 rounded-full p-0.5 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                      <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-bold text-emerald-900 group-hover:text-emerald-950 transition-colors">{offer.OfferName}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 ml-6">
                                    <span className="bg-emerald-100/50 border border-emerald-200 text-emerald-700/80 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                                      {offer.OfferType}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600/90 tracking-wide">
                                      {offer.DiscountType === "FLAT" ? `Flat ₹${offer.DiscountValue} OFF` : `${offer.DiscountValue}% OFF`}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                  <span className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap">
                                    Applied
                                  </span>
                                  <button
                                    disabled={isOffersLoading}
                                    onClick={() => fetchOffers("", 0, offer.Id)}
                                    className={`text-[10px] text-emerald-700/60 hover:text-red-500 font-bold transition-colors underline decoration-transparent hover:decoration-red-300 underline-offset-2 cursor-pointer ${isOffersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {isOffersLoading ? 'Removing...' : 'Remove'}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="bg-emerald-100/50 border border-emerald-200/60 rounded-xl p-3 flex items-center justify-between mt-1.5 relative z-10 group-hover:bg-emerald-100/80 transition-colors ml-1">
                                 <span className="text-[10px] uppercase tracking-widest text-emerald-800/70 font-bold">You Saved</span>
                                 <span className="text-sm font-bold text-emerald-600">₹{offer.FinalDiscount}</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={index} className="group bg-white hover:bg-orange-50/40 transition-all duration-300 border border-black/[0.08] hover:border-orange-200/60 rounded-2xl p-4.5 flex flex-col gap-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-6px_rgba(234,88,12,0.12)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full blur-2xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            <div className="flex justify-between items-start relative z-10">
                              <div className="flex flex-col gap-1.5 pr-3">
                                <span className="text-sm font-bold text-black group-hover:text-orange-900 transition-colors">{offer.OfferName}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="bg-black/5 text-[var(--color-dark-text)]/70 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                                    {offer.OfferType}
                                  </span>
                                  <span className="text-[10px] font-bold text-orange-600/90 tracking-wide">
                                    {offer.DiscountType === "FLAT" ? `Flat ₹${offer.DiscountValue} OFF` : `${offer.DiscountValue}% OFF`}
                                  </span>
                                </div>
                              </div>
                              
                              {offer.IsCouponRequired ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-dark-text)]/40 bg-black/5 px-3 py-2 rounded-xl whitespace-nowrap">
                                    Coupon Required
                                  </span>
                                </div>
                              ) : (
                                <button
                                  disabled={isOffersLoading}
                                  onClick={() => fetchOffers("", offer.Id, 0)}
                                  className={`bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white text-[10px] font-bold uppercase tracking-widest px-4.5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-orange-500/30 whitespace-nowrap cursor-pointer border border-orange-100 hover:border-orange-500 ${isOffersLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {isOffersLoading ? 'Applying...' : 'Apply'}
                                </button>
                              )}
                            </div>
                            
                            <div className="bg-orange-50/60 border border-orange-100/60 rounded-xl p-3 flex items-center justify-between mt-1.5 relative z-10 group-hover:bg-orange-100/40 transition-colors">
                               <span className="text-[10px] uppercase tracking-widest text-orange-800/60 font-bold">Expected Saving</span>
                               <span className="text-sm font-bold text-orange-600">Save ₹{offer.FinalDiscount}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Checkout CTA */}
                <div className="pt-2">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xs font-semibold uppercase tracking-widest py-4.5 rounded-full transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer font-sans"
                  >
                    <CreditCard className="w-4.5 h-4.5" />
                    <span>Proceed to Checkout</span>
                  </button>
                </div>
              </div>

              {/* Trust Badges Details */}
              <div className="bg-white/40 backdrop-blur-md rounded-[2rem] p-5 border border-white/50 space-y-4 text-xs text-[var(--color-dark-text)]/60">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  <span><strong>100% Encrypted Payment</strong>: We support secure Stripe and SSL banking integrations.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
                  <span><strong>Fresh Small-Batch Curation</strong>: Fast dispatch directly from our apothecary.</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
