import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, CreditCard, ShieldCheck, Check, Trash2, Plus, Minus,
  Sparkles, Gift, Shield, CheckCircle2, ShoppingBag, Truck, Calendar, Sparkle, X, MapPin
} from "lucide-react";
import { useCart, CartItem } from "../context/CartContext";
import { StarButton } from "./ui/StarButton";
import { get, post } from "../api/BaseService";

interface AddressInfo {
  id: number;
  customerId: number;
  customerName: string;
  mobileNo: string;
  alternativeMobileNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  stateName: string;
  countryName: string;
  isDefault: boolean;
}

export function CheckoutPage() {
  const { checkoutItems, clearCheckout, clearCart } = useCart();
  
  // Local states
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressError, setAddressError] = useState("");
  
  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  
  // Checkout flow states
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  
  const [shippingOption, setShippingOption] = useState<'standard' | 'express'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  
  // Fetch Addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) {
        setIsLoadingAddresses(false);
        return;
      }
      try {
        const json: any = await get(`/Dropdown/CustomerAdress?customerId=${customerId}`);
        if (json && json.data) {
          const data: AddressInfo[] = json.data;
          setAddresses(data);
          const defaultAddr = data.find((a: AddressInfo) => a.isDefault) || data[0] || null;
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error("Error fetching addresses", err);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);
  
  // Redirect back if checkout items are empty and not completed
  useEffect(() => {
    if (checkoutItems.length === 0 && !orderCompleted) {
      window.location.hash = "#cart";
    }
  }, [checkoutItems, orderCompleted]);
  
  // Calculate pricing
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  
  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold || shippingOption === 'express' ? (shippingOption === 'express' ? 120 : 0) : 60;
  
  const taxCost = Math.round((subtotal - discountAmount) * 0.18); // 18% GST
  const finalTotal = subtotal - discountAmount + shippingCost + taxCost;
  
  // Format estimated delivery dates
  const getDeliveryDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const validateForm = (): boolean => {
    if (!selectedAddress) {
      setAddressError("Please select a delivery address.");
      return false;
    }
    setAddressError("");
    return true;
  };
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    
    if (code === "HRIDHAY10") {
      setDiscountPercent(10);
      setCouponSuccess("HRIDHAY10 Applied (10% Discount Saved!)");
    } else if (code === "WELCOME15") {
      setDiscountPercent(15);
      setCouponSuccess("WELCOME15 Applied (15% Welcome Discount Saved!)");
    } else {
      setCouponError("Invalid or expired coupon code");
    }
  };
  
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setAddressError("Please select a delivery address to place your order.");
      // Scroll to top or show toast
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const customerId = localStorage.getItem("customerId");
      
      const json: any = await post(`/Cart/CheckOut?customerId=${customerId}&CustomerAddressId=${selectedAddress?.id}`, {});
      
      // Checking common success indicators from the .NET backend API format
      if (json.isSuccess || json.statusCode === 1 || json.statusCode === 200) {
        const orderId = "HC-" + Math.floor(100000 + Math.random() * 900000);
        setGeneratedOrderId(orderId);
        setIsProcessing(false);
        setOrderCompleted(true);
        
        // Clear cart items if they checked out their shopping cart
        clearCart();
        // Clear checkout data
        clearCheckout();
        
        // Scroll to top for success experience
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setAddressError(json.message || "Failed to place order.");
        setIsProcessing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setAddressError("A network error occurred. Please try again.");
      setIsProcessing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] pt-[100px] pb-24 px-6 relative overflow-hidden font-sans">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-primary)]/10 blur-[130px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-[var(--color-accent)]/10 blur-[110px]" />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-white/50 backdrop-blur-xl border border-white/80 p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-[var(--color-primary)]/5"
          >
            {/* Animated Check */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
              className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--color-primary)]/20"
            >
              <Check className="w-10 h-10 text-[var(--color-primary)] animate-pulse" />
            </motion.div>
            
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-4 py-1.5 rounded-full inline-block mb-4">
              Order Confirmed
            </span>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-dark-text)] mb-4">
              Thank you for your purchase
            </h1>
            
            <p className="text-sm font-light font-satoshi text-[var(--color-dark-text)]/70 max-w-lg mx-auto mb-8 leading-relaxed">
              Your organic wellness ritual is prepared. We have sent a confirmation to your registered email with invoice details and live tracking information.
            </p>
            
            {/* Order Ref & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/40 border border-white/60 p-6 rounded-[2rem] text-left mb-8 max-w-xl mx-auto text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-dark-text)]/40 block mb-1">Order Ref</span>
                <span className="font-bold text-[var(--color-primary)] text-sm">{generatedOrderId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-dark-text)]/40 block mb-1">Estimated Delivery</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {getDeliveryDate(shippingOption === 'express' ? 2 : 4)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-dark-text)]/40 block mb-1">Shipping Via</span>
                <span className="font-semibold text-[var(--color-dark-text)] uppercase tracking-wider">
                  {shippingOption === 'express' ? "Express Blue Dart" : "Standard Post"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={() => { window.location.hash = "#home"; }}
                className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-xs font-semibold uppercase tracking-widest py-4.5 rounded-full transition-all shadow-md cursor-pointer"
              >
                Return Home
              </button>
              <button
                onClick={() => { window.location.hash = "#soap"; }}
                className="flex-1 bg-white hover:bg-[var(--color-beige)]/20 text-[var(--color-dark-text)] border border-black/10 text-xs font-semibold uppercase tracking-widest py-4.5 rounded-full transition-all cursor-pointer"
              >
                Shop More Rituals
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-[100px] pb-24 px-6 md:px-12 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-[var(--color-primary)]/5 blur-[120px]" />
        <div className="absolute bottom-[25%] right-[5%] w-[38vw] h-[38vw] rounded-full bg-[var(--color-accent)]/8 blur-[105px]" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Navigation */}
        <div className="flex justify-between items-center py-4 border-b border-[var(--color-primary)]/5 mb-10">
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to shop</span>
          </button>
          
          <div className="flex items-center gap-2.5 text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 px-4 py-2 rounded-full font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-14 items-start w-full">
          
          {/* LEFT SIDE: Forms */}
          <div className="w-full lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-4 sm:p-6 md:p-10 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-sm shadow-[var(--color-dark-text)]/5 space-y-6"
            >
              <div>
                <span className="text-[var(--color-primary)] font-semibold tracking-widest uppercase text-[10px] mb-2 block">
                  01. Destination
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-dark-text)] flex justify-between items-end">
                  Delivery Address
                  {addresses.length > 0 && (
                    <button 
                      onClick={() => setIsAddressModalOpen(true)} 
                      className="text-xs font-sans text-[var(--color-primary)] hover:underline tracking-widest uppercase font-semibold mb-1"
                    >
                      Change Address
                    </button>
                  )}
                </h2>
              </div>
              
              {isLoadingAddresses ? (
                <div className="animate-pulse flex flex-col gap-3 mt-6">
                  <div className="h-5 bg-black/5 rounded w-1/3"></div>
                  <div className="h-4 bg-black/5 rounded w-1/4 mb-2"></div>
                  <div className="h-16 bg-black/5 rounded w-full"></div>
                </div>
              ) : selectedAddress ? (
                <div className="mt-4 bg-white/60 border border-[var(--color-primary)]/20 p-5 sm:p-6 rounded-3xl relative shadow-sm">
                  {selectedAddress.isDefault && (
                    <span className="absolute top-4 right-4 text-[9px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                      Default
                    </span>
                  )}
                  <h4 className="font-bold text-[var(--color-dark-text)] text-lg mb-1">{selectedAddress.customerName}</h4>
                  <p className="text-sm text-[var(--color-dark-text)]/70 mb-3 font-semibold">{selectedAddress.mobileNo}</p>
                  <p className="text-sm text-[var(--color-dark-text)]/80 leading-relaxed max-w-sm">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}
                    <br />
                    {selectedAddress.city} - {selectedAddress.postalCode}
                    <br />
                    {selectedAddress.stateName}, {selectedAddress.countryName}
                  </p>
                </div>
              ) : (
                <div className="mt-4 bg-white/40 border border-dashed border-[var(--color-primary)]/30 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--color-dark-text)] mb-1">No Address Found</h4>
                    <p className="text-xs text-[var(--color-dark-text)]/60 max-w-xs mx-auto">Please add a delivery address to proceed with your checkout.</p>
                  </div>
                  <button 
                    onClick={() => {
                      window.location.hash = "#profile";
                    }} 
                    className="text-[10px] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors text-white px-5 py-2.5 rounded-full uppercase tracking-widest font-semibold mt-2 shadow-sm"
                  >
                    Add New Address
                  </button>
                </div>
              )}

              {addressError && (
                <div className="text-[10px] text-red-500 font-medium pl-1 mt-2">
                  {addressError}
                </div>
              )}
            </motion.div>
            
            {/* Delivery Curation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-4 sm:p-6 md:p-10 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-sm shadow-[var(--color-dark-text)]/5 space-y-6"
            >
              <div>
                <span className="text-[var(--color-primary)] font-semibold tracking-widest uppercase text-[10px] mb-2 block">
                  03. Service Curation
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-dark-text)]">
                  Delivery Options
                </h2>
              </div>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShippingOption('standard')}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-3xl border transition-all duration-300 text-left ${
                    shippingOption === 'standard' 
                      ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-sm' 
                      : 'bg-white/40 border-black/5 hover:border-black/25'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center bg-white">
                      {shippingOption === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[var(--color-dark-text)] block">Standard Delivery</span>
                      <span className="text-[10px] text-[var(--color-dark-text)]/50 font-light flex items-center gap-1 mt-0.5">
                        <Truck className="w-3.5 h-3.5" />
                        Delivered by {getDeliveryDate(4)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-primary)] font-serif">
                    {subtotal >= shippingThreshold ? "FREE" : "₹60"}
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShippingOption('express')}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-3xl border transition-all duration-300 text-left ${
                    shippingOption === 'express' 
                      ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-sm' 
                      : 'bg-white/40 border-black/5 hover:border-black/25'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center bg-white">
                      {shippingOption === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[var(--color-dark-text)] block">Priority Express Care</span>
                      <span className="text-[10px] text-[var(--color-dark-text)]/50 font-light flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        Guaranteed Delivered by {getDeliveryDate(2)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-primary)] font-serif">
                    ₹120
                  </span>
                </button>
              </div>
            </motion.div>
            
            {/* Payment Portal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-4 sm:p-6 md:p-10 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-sm shadow-[var(--color-dark-text)]/5 space-y-8"
            >
              <div>
                <span className="text-[var(--color-primary)] font-semibold tracking-widest uppercase text-[10px] mb-2 block">
                  04. Transaction Curation
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-dark-text)]">
                  Payment Gateway
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { id: 'card', name: 'Credit/Debit Card', desc: 'Secure encryption' },
                  { id: 'upi', name: 'Instant UPI', desc: 'GPay, PhonePe, Paytm' },
                  { id: 'paypal', name: 'PayPal Portal', desc: 'Global validation' },
                  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay at your door' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 ${
                      paymentMethod === item.id 
                        ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)] shadow-sm' 
                        : 'bg-white/40 border-black/5 hover:border-black/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-[var(--color-dark-text)]">{item.name}</span>
                    <span className="text-[10px] text-[var(--color-dark-text)]/40 font-light font-satoshi leading-snug">{item.desc}</span>
                  </button>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                {paymentMethod === 'card' && (
                  <motion.div
                    key="card-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-black/5 overflow-hidden"
                  >
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value.replace(/\D/g, '').substring(0, 16) }))}
                        className="w-full bg-white/40 border border-black/10 rounded-2xl py-4.5 px-4 text-base text-[var(--color-dark-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value.substring(0, 5) }))}
                        className="w-full bg-white/40 border border-black/10 rounded-2xl py-4.5 px-4 text-base text-[var(--color-dark-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all duration-300 text-center"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) }))}
                        className="w-full bg-white/40 border border-black/10 rounded-2xl py-4.5 px-4 text-base text-[var(--color-dark-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all duration-300 text-center"
                      />
                    </div>
                  </motion.div>
                )}
                
                {paymentMethod === 'upi' && (
                  <motion.div
                    key="upi-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-black/5 overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. username@okhdfcbank)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white/40 border border-black/10 rounded-2xl py-4.5 px-4 text-base text-[var(--color-dark-text)] focus:border-[var(--color-primary)] focus:outline-none transition-all duration-300"
                    />
                  </motion.div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <motion.div
                    key="paypal-redirect"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-black/5 text-center text-xs text-[var(--color-dark-text)]/60 font-light leading-relaxed"
                  >
                    You will be redirected to PayPal's secure authentication gateway to authorize payment upon clicking "Place Order".
                  </motion.div>
                )}
                
                {paymentMethod === 'cod' && (
                  <motion.div
                    key="cod-confirm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-black/5 text-center text-xs text-emerald-800 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Pay in cash or digital UPI upon receiving packages at your doorstep.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* RIGHT SIDE: Summary Card */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-[120px]">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white/50 backdrop-blur-xl border border-white/80 p-4 sm:p-6 md:p-8 rounded-[1.8rem] sm:rounded-[3rem] shadow-xl shadow-[var(--color-primary)]/5 space-y-6"
            >
              <h3 className="text-xl font-serif text-[var(--color-dark-text)] border-b border-black/5 pb-4">
                Order Review
              </h3>
              
              {/* Product cards stack */}
              <div className="max-h-[280px] overflow-y-auto pr-1 space-y-4">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white/40 border border-white/50 p-3.5 rounded-2xl">
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-[var(--color-beige)]/30 border border-black/5 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-[var(--color-dark-text)] truncate">{item.product.name}</h4>
                      <span className="text-[10px] text-[var(--color-dark-text)]/40 block mt-0.5 uppercase tracking-wider font-light">{item.product.tagline}</span>
                      {item.packingType && (
                        <div className="mt-1">
                          <span className="text-[9px] text-[var(--color-primary)] font-satoshi font-semibold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-md inline-block">
                            Packaging: {item.packingType}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[var(--color-primary)] font-bold">₹{item.product.price}</span>
                        <span className="text-[10px] text-[var(--color-dark-text)]/40 font-light">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-dark-text)] font-serif pl-2">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section */}
              <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-black/5 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="COUPON CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-white/50 border border-black/10 rounded-2xl py-3 px-4 text-xs font-semibold uppercase tracking-wider focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-[10px] font-semibold uppercase tracking-widest px-6 py-3 rounded-2xl transition-colors shadow-sm cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <span className="text-[10px] text-red-500 font-medium pl-1 block">{couponError}</span>}
                {couponSuccess && <span className="text-[10px] text-emerald-600 font-semibold pl-1 block">{couponSuccess}</span>}
              </form>
              
              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-black/5 text-xs text-[var(--color-dark-text)]/70">
                <div className="flex justify-between font-light">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-dark-text)]">₹{subtotal}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      Promo Discount ({discountPercent}%)
                    </span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-light">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-[var(--color-dark-text)]">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-semibold uppercase">Free</span> : `₹${shippingCost}`}
                  </span>
                </div>
                
                <div className="flex justify-between font-light">
                  <span>GST Tax (18%)</span>
                  <span className="font-semibold text-[var(--color-dark-text)]">₹{taxCost}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-4 border-t border-black/5 text-[var(--color-dark-text)] font-semibold font-serif">
                  <span className="text-xs uppercase font-sans font-bold tracking-wider text-[var(--color-dark-text)]/50">Order Total</span>
                  <span className="text-xl text-[var(--color-primary)] font-bold">₹{finalTotal}</span>
                </div>
              </div>
              
              {/* Order Placement Button */}
              <div className="pt-2">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] disabled:bg-[var(--color-primary)]/50 text-white text-xs font-semibold uppercase tracking-widest py-4.5 rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing Transaction...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>Place Order · ₹{finalTotal}</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Guaranteed badges */}
              <div className="bg-white/40 rounded-2xl p-4 border border-black/5 flex items-center justify-between text-[10px] text-[var(--color-dark-text)]/40 font-light">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]/60" />
                  <span>Secure Payments</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Sparkle className="w-4 h-4 text-[var(--color-primary)]/60" />
                  <span>100% Pure Actives</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[var(--color-primary)]/60" />
                  <span>Insured Care</span>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>

      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-cream)] w-full max-w-xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-black/5 bg-white/40">
                <h3 className="font-serif text-xl md:text-2xl text-[var(--color-dark-text)]">Select Delivery Address</h3>
                <button 
                  onClick={() => setIsAddressModalOpen(false)} 
                  className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[var(--color-dark-text)]" />
                </button>
              </div>
              
              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-10 text-[var(--color-dark-text)]/50">
                    <MapPin className="w-8 h-8 mx-auto mb-3 text-[var(--color-dark-text)]/30" />
                    No addresses found.
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <label 
                      key={addr.id}
                      className={`flex gap-4 p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${
                        selectedAddress?.id === addr.id 
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm"
                          : "border-black/10 bg-white/50 hover:border-black/20"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors bg-white ${
                          selectedAddress?.id === addr.id ? "border-[var(--color-primary)]" : "border-black/20"
                        }`}>
                          {selectedAddress?.id === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 relative">
                        {addr.isDefault && (
                          <span className="absolute top-0 right-0 text-[9px] bg-black/5 text-[var(--color-dark-text)] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            Default Address
                          </span>
                        )}
                        <h4 className="font-bold text-[var(--color-dark-text)] text-sm mb-0.5">{addr.customerName}</h4>
                        <p className="text-xs font-semibold text-[var(--color-dark-text)]/70 mb-2">{addr.mobileNo}</p>
                        <p className="text-xs text-[var(--color-dark-text)]/80 leading-relaxed pr-20">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          <br />
                          {addr.city} - {addr.postalCode}
                          <br />
                          {addr.stateName}, {addr.countryName}
                        </p>
                        
                        {selectedAddress?.id === addr.id && (
                          <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 w-fit px-2 py-1 rounded-md">
                            <Check className="w-3.5 h-3.5" />
                            Selected Address
                          </div>
                        )}
                      </div>
                      
                      {/* Hidden radio input for accessibility */}
                      <input 
                        type="radio" 
                        name="delivery_address" 
                        className="sr-only" 
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => setSelectedAddress(addr)}
                      />
                    </label>
                  ))
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-black/5 bg-white/50 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    window.location.hash = "#profile";
                  }} 
                  className="flex-1 py-4 rounded-full border border-black/10 text-[var(--color-dark-text)] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors text-center cursor-pointer shadow-sm"
                >
                  Add New Address
                </button>
                <button 
                  onClick={() => setIsAddressModalOpen(false)} 
                  className="flex-1 py-4 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md text-center cursor-pointer"
                >
                  Confirm Selection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
