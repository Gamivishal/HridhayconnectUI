import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, CreditCard, ShieldCheck, Check, Trash2, Plus, Minus,
  Sparkles, Gift, Shield, CheckCircle2, ShoppingBag, Truck, Calendar, Sparkle, X, MapPin
} from "lucide-react";
import { useCart, CartItem } from "../context/CartContext";
import { StarButton } from "./ui/StarButton";
import { get, post, RAZORPAY_KEY_ID } from "../api/BaseService";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  const { checkoutItems, checkoutOffers, clearCheckout, clearCart } = useCart();

  // Local states
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressError, setAddressError] = useState("");

  // New Address Form States
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [countries, setCountries] = useState<{ id: number, name: string }[]>([]);
  const [states, setStates] = useState<{ id: number, name: string }[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressError, setAddAddressError] = useState("");
  const [newAddress, setNewAddress] = useState({
    countryId: 0,
    stateId: 0,
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    mobileNo: "",
    alternativeMobileNo: "",
  });

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

  // Reward Coins usage
  const [rewardSettings, setRewardSettings] = useState<any>(null);
  const [availableCoins, setAvailableCoins] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  useEffect(() => {
    const fetchRewardData = async () => {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return;
      try {
        const [profileRes, settingsRes]: any = await Promise.all([
          post("/Customer/GetAll", { Id: Number(customerId), Search: "" }),
          get("/Reward/GetAll")
        ]);

        let dataObj = profileRes;
        if (profileRes && profileRes.data) {
          dataObj = profileRes.data;
        }

        if (dataObj) {
          let table1 = dataObj.table1 || [];
          if (!Array.isArray(table1) || table1.length === 0) {
            for (const key of Object.keys(dataObj)) {
              if (Array.isArray(dataObj[key]) && key.toLowerCase().includes("table1")) {
                table1 = dataObj[key];
                break;
              }
            }
          }
          if (table1 && table1.length > 0) {
            setAvailableCoins(table1[0].RewardCoins || 0);
          }
        }

        if (settingsRes && settingsRes.data && settingsRes.data.length > 0) {
          setRewardSettings(settingsRes.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch reward details", err);
      }
    };
    fetchRewardData();
  }, []);

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

  // Fetch Countries
  useEffect(() => {
    if (isAddAddressModalOpen && countries.length === 0) {
      get("/Dropdown/CountryList").then((res: any) => {
        if (res && res.data) setCountries(res.data);
      }).catch(console.error);
    }
  }, [isAddAddressModalOpen]);

  // Fetch States based on Country
  useEffect(() => {
    if (newAddress.countryId > 0) {
      get(`/Dropdown/StateList?CountryId=${newAddress.countryId}`).then((res: any) => {
        if (res && res.data) setStates(res.data);
      }).catch(console.error);
    } else {
      setStates([]);
    }
  }, [newAddress.countryId]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAddressError("");
    setIsAddingAddress(true);

    try {
      const customerId = localStorage.getItem("customerId");
      if (!customerId) throw new Error("Not logged in");

      const payload = {
        id: 0,
        customerId: Number(customerId),
        countryId: Number(newAddress.countryId),
        stateId: Number(newAddress.stateId),
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        city: newAddress.city,
        postalCode: newAddress.postalCode,
        mobileNo: newAddress.mobileNo,
        alternativeMobileNo: newAddress.alternativeMobileNo,
        addressType: "SHIPPING"
      };

      const res: any = await post("/Customer/Save", payload);

      if (res.isSuccess || res.statusCode === 1 || res.statusCode === 200) {
        setIsAddAddressModalOpen(false);
        // Refresh addresses
        const fetchRes: any = await get(`/Dropdown/CustomerAdress?customerId=${customerId}`);
        if (fetchRes && fetchRes.data) {
          setAddresses(fetchRes.data);
          const data = fetchRes.data;
          // Set the last added address as selected
          if (data.length > 0) {
            setSelectedAddress(data[data.length - 1]);
          }
        }
        // Reset form
        setNewAddress({
          countryId: 0, stateId: 0, addressLine1: "", addressLine2: "", city: "", postalCode: "", mobileNo: "", alternativeMobileNo: ""
        });
      } else {
        setAddAddressError(res.message || "Failed to add address");
      }
    } catch (err) {
      console.error(err);
      setAddAddressError("A network error occurred. Please try again.");
    } finally {
      setIsAddingAddress(false);
    }
  };

  // Redirect back if checkout items are empty and not completed
  useEffect(() => {
    if (checkoutItems.length === 0 && !orderCompleted) {
      window.location.hash = "#cart";
    }
  }, [checkoutItems, orderCompleted]);

  // Calculate pricing
  const subtotal = checkoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const passedDiscountAmount = checkoutOffers?.reduce((sum, offer) => sum + (offer.FinalDiscount || offer.DiscountValue || 0), 0) || 0;
  const discountAmount = passedDiscountAmount > 0 ? passedDiscountAmount : Math.round((subtotal * discountPercent) / 100);

  // --- REWARD COIN CALCULATION ---
  let possibleMaxCoinsAllowed = 0;
  let possibleMaxDiscountRs = 0;

  // Final usage variables
  let finalUsedCoins = 0;
  let finalCoinDiscount = 0;
  let remainingCoins = availableCoins;

  if (rewardSettings && availableCoins > 0) {
    const baseAmountForCoins = subtotal - discountAmount;
    const maxCoinUsagePercent = rewardSettings.MaxCoinUsagePercent || 0;
    const coinToRupeeRate = rewardSettings.CoinToRupeeRate || 1;

    // Max usage rule based on cart value
    const maxDiscountAllowedRs = (baseAmountForCoins * maxCoinUsagePercent) / 100;
    const maxCoinsAllowed = maxDiscountAllowedRs * coinToRupeeRate;

    // Final limit (minimum of available or maximum allowed)
    const rawCoinsLimit = Math.min(availableCoins, maxCoinsAllowed);

    // Rounding rule: Allow only full rupee redemption
    possibleMaxCoinsAllowed = Math.floor(rawCoinsLimit / coinToRupeeRate) * coinToRupeeRate;
    possibleMaxDiscountRs = possibleMaxCoinsAllowed / coinToRupeeRate;
  }

  // Checkbox Opt-In Logic
  if (useCoins && possibleMaxCoinsAllowed > 0) {
    finalUsedCoins = possibleMaxCoinsAllowed;
    finalCoinDiscount = possibleMaxDiscountRs;
  }

  remainingCoins = availableCoins - finalUsedCoins;

  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold || shippingOption === 'express' ? (shippingOption === 'express' ? 120 : 0) : 60;

  const taxCost = 0; // Math.round((subtotal - discountAmount) * 0.18); // 18% GST
  const finalTotal = subtotal - discountAmount - finalCoinDiscount + shippingCost + taxCost;

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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsProcessing(true);
    setAddressError(""); // Reset any errors

    const customerId = localStorage.getItem("customerId");
    const createdBy = customerId ? Number(customerId) : 0;

    // For Cash on Delivery (COD) - bypass Razorpay online flow and complete immediately
    if (paymentMethod === "cod") {
      try {
        const json: any = await post(
          `/Cart/CheckOut?customerId=${customerId}&CustomerAddressId=${selectedAddress?.id}&deliveryFee=${shippingCost || 0}&usedCoins=${finalUsedCoins}&coinDiscountAmount=${finalCoinDiscount}`,
          {}
        );

        if (json.isSuccess || json.statusCode === 1 || json.statusCode === 200) {
          const orderNum = json.data?.items?.[0]?.OrderNumber || json.data?.Items?.[0]?.OrderNumber || "HC-" + Math.floor(100000 + Math.random() * 900000);
          setGeneratedOrderId(orderNum);
          setIsProcessing(false);
          setOrderCompleted(true);
          clearCart();
          clearCheckout();
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setAddressError(json.message || "Failed to place order.");
          setIsProcessing(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        console.error("COD Checkout error:", err);
        setAddressError("A network error occurred. Please try again.");
        setIsProcessing(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // For Online Payments (Card, UPI, PayPal) - use Razorpay Integration
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setAddressError("Failed to load payment gateway script. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const orderRes: any = await post("/Payment/create-order", {
        Amount: finalTotal
      });

      if (!orderRes || (!orderRes.razorpayOrderId && !orderRes.RazorpayOrderId)) {
        setAddressError(orderRes?.message || "Failed to create payment order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const razorpayOrderId = orderRes.razorpayOrderId || orderRes.RazorpayOrderId;
      const orderAmount = orderRes.amount || orderRes.Amount;
      const orderCurrency = orderRes.currency || orderRes.Currency || "INR";

      // Extract customer details for prefill
      let customerEmail = "";
      let customerName = selectedAddress?.customerName || "";
      let customerMobile = selectedAddress?.mobileNo || "";
      try {
        const profileStr = localStorage.getItem("customerProfile");
        if (profileStr) {
          const profile = JSON.parse(profileStr);
          customerEmail = profile.Email || profile.email || "";
          if (!customerName) {
            customerName = profile.Name || profile.name || profile.CustomerName || "";
          }
          if (!customerMobile) {
            customerMobile = profile.MobileNo || profile.mobileNo || profile.Mobile || "";
          }
        }
      } catch (err) {
        console.error("Error parsing customer profile", err);
      }

      // Determine prefill method based on selected paymentMethod
      let prefillMethod = "";
      if (paymentMethod === "card") {
        prefillMethod = ""; // Do not prefill card so that the modal shows the main options screen including UPI
      } else if (paymentMethod === "upi") {
        prefillMethod = "upi";
      } else if (paymentMethod === "paypal") {
        prefillMethod = "wallet";
      }

      let selectedMethod = "";

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: orderCurrency,
        name: "Hridhay Connect",
        description: "Artisanal Wellness Purchase",
        order_id: razorpayOrderId,
        image: "/logo.webp",
        handler: async (response: any) => {
          setIsProcessing(true);
          try {
            let paymentModeVal = "3"; // Default fallback (Card)
            const finalMethod = (selectedMethod || paymentMethod || "").toLowerCase();
            if (finalMethod === "card") {
              paymentModeVal = "3";
            } else if (finalMethod === "netbanking") {
              paymentModeVal = "4";
            } else if (finalMethod === "wallet" || finalMethod === "paypal") {
              paymentModeVal = "1";
            } else if (finalMethod === "upi") {
              paymentModeVal = "2";
            }

            const verifyPayload = {
              RazorpayOrderId: response.razorpay_order_id,
              RazorpayPaymentId: response.razorpay_payment_id,
              RazorpaySignature: response.razorpay_signature,
              CustomerId: Number(customerId),
              CustomerAddressId: selectedAddress?.id,
              CreatedBy: createdBy,
              UsedCoins: finalUsedCoins,
              CoinDiscountAmount: finalCoinDiscount,
              DeliveryFee: shippingCost || 0,
              PaymentMode: paymentModeVal,
              paymentMode: paymentModeVal
            };

            const verifyRes: any = await post("/Payment/verify", verifyPayload);

            const isSuccessVal = verifyRes.isSuccess || verifyRes.IsSuccess || verifyRes.statusCode === 1 || verifyRes.statusCode === 200;
            if (isSuccessVal) {
              const orderNum = verifyRes.data?.items?.[0]?.OrderNumber || verifyRes.data?.Items?.[0]?.OrderNumber || "HC-" + Math.floor(100000 + Math.random() * 900000);
              setGeneratedOrderId(orderNum);
              setIsProcessing(false);
              setOrderCompleted(true);
              clearCart();
              clearCheckout();
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setAddressError(verifyRes.message || "Payment verification failed. Please contact support.");
              setIsProcessing(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          } catch (err: any) {
            console.error("Payment verification network error:", err);
            setAddressError("A network error occurred while verifying payment. Please do not close this window and contact support.");
            setIsProcessing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerMobile,
          method: prefillMethod || undefined,
          vpa: paymentMethod === "upi" && upiId ? upiId : undefined
        },
        config: {
          display: {
            sequence: ["block.cards", "block.netbanking", "block.wallet", "block.upi"],
            preferences: {
              show_default_blocks: true
            },
            hide: [
              {
                method: "paylater"
              }
            ]
          }
        },
        theme: {
          color: "#5B2A86"
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setAddressError("Payment window was closed by the user. You can try placing the order again.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.submit", (response: any) => {
        if (response && response.method) {
          selectedMethod = response.method;
        }
      });
      rzp.on("payment.failed", (response: any) => {
        console.error("Razorpay Payment failed:", response.error);
        setIsProcessing(false);
        setAddressError(`Payment failed: ${response.error.description || "Unknown error"}. Please try again.`);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Razorpay creation error:", err);
      setAddressError("An unexpected error occurred while initiating the payment. Please try again.");
      setIsProcessing(false);
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
                      setIsAddAddressModalOpen(true);
                    }}
                    className="text-[10px] bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors text-white px-5 py-2.5 rounded-full uppercase tracking-widest font-semibold mt-2 shadow-sm cursor-pointer"
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
                  className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-3xl border transition-all duration-300 text-left ${shippingOption === 'standard'
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

                {/* <button
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
                </button> */}
              </div>
            </motion.div>

            {/* Payment Portal */}
            {/* <motion.div
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
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 ${paymentMethod === item.id
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
                      placeholder="Enter UPI ID (Optional - or leave blank to choose inside popup)"
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
            </motion.div> */}
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

              {/* Coin Usage Wallet Card */}
              {availableCoins > 0 && rewardSettings && (
                <div className="pt-4 border-t border-black/5">
                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${useCoins ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white/50 border-black/10'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${useCoins ? 'bg-emerald-100 border-emerald-200' : 'bg-amber-100 border-amber-200'}`}>
                          <Gift className={`w-5 h-5 ${useCoins ? 'text-emerald-600' : 'text-amber-500'}`} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[var(--color-dark-text)] block">Reward Coins</span>
                          {useCoins ? (
                            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">Coins Applied Successfully!</span>
                          ) : (
                            <span className="text-[10px] text-[var(--color-dark-text)]/60 block mt-0.5">
                              You can redeem up to ₹{possibleMaxDiscountRs} ({possibleMaxCoinsAllowed} coins)
                            </span>
                          )}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={useCoins} onChange={(e) => setUseCoins(e.target.checked)} disabled={possibleMaxCoinsAllowed === 0} />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-50"></div>
                      </label>
                    </div>

                    {useCoins && (
                      <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 space-y-2 text-[10px] mt-3">
                        <div className="flex justify-between items-center text-[var(--color-dark-text)]">
                          <span>Available Coins</span>
                          <span className="font-semibold">{availableCoins} 🪙</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-700">
                          <span>Using Coins</span>
                          <span className="font-semibold">-{finalUsedCoins} 🪙</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-700">
                          <span>Discount Applied</span>
                          <span className="font-semibold">-₹{finalCoinDiscount}</span>
                        </div>
                        <div className="w-full h-px bg-emerald-100 my-1"></div>
                        <div className="flex justify-between items-center text-[var(--color-dark-text)] font-medium">
                          <span>Remaining After Checkout</span>
                          <span className="font-bold">{remainingCoins} 🪙</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-black/5 text-xs text-[var(--color-dark-text)]/70">
                <div className="flex justify-between font-light">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-dark-text)]">₹{subtotal}</span>
                </div>

                {checkoutOffers && checkoutOffers.length > 0 ? (
                  checkoutOffers.map((offer, idx) => (
                    <div key={idx} className="flex justify-between text-emerald-700 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                      <span className="flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        🏷️ {offer.OfferName || "Applied Offer"}
                      </span>
                      <span className="font-semibold">-₹{offer.FinalDiscount || offer.DiscountValue || 0}</span>
                    </div>
                  ))
                ) : discountPercent > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      🏷️ {couponCode.toUpperCase()} Offer ({discountPercent}% Off)
                    </span>
                    <span className="font-semibold">-₹{discountAmount}</span>
                  </div>
                ) : null}

                {useCoins && finalCoinDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Reward Coin Discount
                    </span>
                    <span>-₹{finalCoinDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between font-light">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-[var(--color-dark-text)]">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-semibold uppercase">Free</span> : `₹${shippingCost}`}
                  </span>
                </div>

                {/* <div className="flex justify-between font-light">
                  <span>GST Tax (18%)</span>
                  <span className="font-semibold text-[var(--color-dark-text)]">₹{taxCost}</span>
                </div> */}

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
                      className={`flex gap-4 p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${selectedAddress?.id === addr.id
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm"
                        : "border-black/10 bg-white/50 hover:border-black/20"
                        }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors bg-white ${selectedAddress?.id === addr.id ? "border-[var(--color-primary)]" : "border-black/20"
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

                      <input
                        type="radio"
                        name="delivery_address"
                        className="sr-only"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => {
                          setSelectedAddress(addr);
                          setTimeout(() => setIsAddressModalOpen(false), 150); // slight delay for visual feedback
                        }}
                      />
                    </label>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-black/5 bg-white/50 flex">
                <button
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    setIsAddAddressModalOpen(true);
                  }}
                  className="w-full py-4 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md text-center cursor-pointer"
                >
                  Add New Address
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isAddAddressModalOpen && (
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
              className="bg-[var(--color-cream)] w-full max-w-xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              <div className="flex justify-between items-center p-6 border-b border-black/5 bg-white/40">
                <h3 className="font-serif text-xl md:text-2xl text-[var(--color-dark-text)]">Add New Address</h3>
                <button
                  onClick={() => setIsAddAddressModalOpen(false)}
                  className="p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[var(--color-dark-text)]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <form id="add-address-form" onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">Country *</label>
                      <select
                        required
                        value={newAddress.countryId}
                        onChange={(e) => setNewAddress({ ...newAddress, countryId: Number(e.target.value), stateId: 0 })}
                        className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                      >
                        <option value="0" disabled>Select Country</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">State *</label>
                      <select
                        required
                        value={newAddress.stateId}
                        onChange={(e) => setNewAddress({ ...newAddress, stateId: Number(e.target.value) })}
                        disabled={!newAddress.countryId || states.length === 0}
                        className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none disabled:opacity-50"
                      >
                        <option value="0" disabled>Select State</option>
                        {states.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">City *</label>
                      <input
                        required
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">Postal Code *</label>
                      <input
                        required
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                        placeholder="Enter zip/postal code"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">Address Line 1 *</label>
                    <input
                      required
                      type="text"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                      placeholder="House no., Building, Street"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                      placeholder="Area, Colony, Landmark"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">Mobile No *</label>
                      <input
                        required
                        type="tel"
                        value={newAddress.mobileNo}
                        onChange={(e) => setNewAddress({ ...newAddress, mobileNo: e.target.value })}
                        className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-dark-text)]/60">Alternative Mobile (Optional)</label>
                      <input
                        type="tel"
                        value={newAddress.alternativeMobileNo}
                        onChange={(e) => setNewAddress({ ...newAddress, alternativeMobileNo: e.target.value })}
                        className="w-full bg-white/50 border border-black/10 rounded-xl py-3 px-4 text-sm focus:border-[var(--color-primary)] outline-none"
                        placeholder="Enter alternative mobile"
                      />
                    </div>
                  </div>

                  {addAddressError && (
                    <div className="text-[10px] text-red-500 font-medium pl-1 mt-2">
                      {addAddressError}
                    </div>
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-black/5 bg-white/50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(false)}
                  className="flex-1 py-4 rounded-full border border-black/10 text-[var(--color-dark-text)] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors text-center cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  form="add-address-form"
                  type="submit"
                  disabled={isAddingAddress || newAddress.countryId === 0 || newAddress.stateId === 0}
                  className="flex-1 py-4 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest transition-colors shadow-md flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isAddingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
