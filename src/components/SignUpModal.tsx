import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { UserPlus, LogIn, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, X, Phone, User, Sparkle, Calendar, Users, Eye, EyeOff, Check, Sparkles, Chrome, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getLovDropdownList, post } from "../api/BaseService";
import { getCaseInsensitiveProperty } from "../api/productService";
import { showApiResponseToast, showToast } from "../utils/toastService";

// Particle positions for left branding panel
const LEFT_PARTICLES = [
  { x: 10, y: 15, s: 1.5, d: 0.0, dur: 12 },
  { x: 75, y: 10, s: 1.0, d: 1.2, dur: 15 },
  { x: 20, y: 70, s: 1.8, d: 0.5, dur: 11 },
  { x: 85, y: 50, s: 0.8, d: 2.0, dur: 17 },
  { x: 45, y: 85, s: 1.2, d: 0.3, dur: 14 },
  { x: 8,  y: 40, s: 1.0, d: 1.7, dur: 10 },
  { x: 60, y: 25, s: 1.4, d: 0.9, dur: 13 },
  { x: 30, y: 45, s: 0.9, d: 2.3, dur: 16 },
];

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  name: string;
  focusedField: string | null;
  onFocus: (name: string) => void;
  onBlur: () => void;
  autoComplete?: string;
  max?: string;
}

function FloatingInput({
  label, type = "text", value, onChange, error, icon, rightElement,
  name, focusedField, onFocus, onBlur, autoComplete, max
}: FloatingInputProps) {
  const isFocused = focusedField === name;
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  const formatDate = (d: string) => {
    if (!d) return "";
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return d;
  };

  const isDate = type === "date";
  const displayValue = isDate && value ? formatDate(value) : value;

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
          error
            ? "border-red-500/60 bg-red-50/10 shadow-sm"
            : isFocused
            ? "border-[var(--color-primary)] bg-white/95 shadow-md shadow-[var(--color-primary)]/5"
            : "border-black/10 bg-white/70 hover:border-black/20"
        }`}
      >
        {/* Left Icon */}
        {icon && (
          <div className={`absolute left-4 transition-colors duration-300 z-10 pointer-events-none ${isFocused ? "text-[var(--color-primary)]" : "text-black/30"}`}>
            {icon}
          </div>
        )}

        {/* Floating Label */}
        <label
          className={`absolute ${icon ? "left-11" : "left-4"} transition-all duration-300 pointer-events-none select-none z-10 ${
            isActive
              ? "top-2 text-[9px] text-[var(--color-primary)] font-bold uppercase tracking-wider"
              : "top-[17px] text-sm text-black/40 font-light"
          }`}
        >
          {label}
        </label>

        {/* Input */}
        <input
          type={isDate ? "text" : type}
          value={displayValue}
          autoComplete={autoComplete}
          onChange={isDate ? undefined : (e) => onChange(e.target.value)}
          onFocus={() => onFocus(name)}
          onBlur={onBlur}
          readOnly={isDate}
          className={`w-full bg-transparent border-none outline-none text-sm text-[var(--color-dark-text)] ${icon ? "pl-11" : "pl-4"} pr-11 transition-all duration-300 relative z-10 ${
            isActive ? "pt-[21px] pb-[7px]" : "py-4"
          } ${isDate ? "cursor-pointer pointer-events-none" : ""}`}
        />

        {/* Invisible native date picker over the entire area */}
        {isDate && (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => onFocus(name)}
            onBlur={onBlur}
            max={max || new Date().toISOString().split("T")[0]}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
          />
        )}

        {/* Right Element (Password visibility toggle) */}
        {rightElement && (
          <div className={`absolute right-4 transition-colors duration-300 z-10 ${isDate ? 'pointer-events-none' : 'cursor-pointer'} ${isFocused ? "text-[var(--color-primary)]" : "text-black/30"} hover:text-[var(--color-primary)]`}>
            {rightElement}
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-red-500 font-medium pl-4 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon?: React.ReactNode;
  options: {code: string, name: string}[];
  name: string;
  focusedField: string | null;
  onFocus: (name: string) => void;
  onBlur: () => void;
}

function FloatingSelect({
  label, value, onChange, error, icon, options,
  name, focusedField, onFocus, onBlur,
}: FloatingSelectProps) {
  const isFocused = focusedField === name;
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
          error
            ? "border-red-500/60 bg-red-50/10 shadow-sm"
            : isFocused
            ? "border-[var(--color-primary)] bg-white/95 shadow-md shadow-[var(--color-primary)]/5"
            : "border-black/10 bg-white/70 hover:border-black/20"
        }`}
      >
        {icon && (
          <div className={`absolute left-4 transition-colors duration-300 z-10 pointer-events-none ${isFocused ? "text-[var(--color-primary)]" : "text-black/30"}`}>
            {icon}
          </div>
        )}

        <label
          className={`absolute ${icon ? "left-11" : "left-4"} transition-all duration-300 pointer-events-none select-none z-10 ${
            isActive
              ? "top-2 text-[9px] text-[var(--color-primary)] font-bold uppercase tracking-wider"
              : "top-[17px] text-sm text-black/40 font-light"
          }`}
        >
          {label}
        </label>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocus(name)}
          onBlur={onBlur}
          className={`w-full bg-transparent border-none outline-none text-sm text-[var(--color-dark-text)] ${icon ? "pl-11" : "pl-4"} pr-11 transition-all duration-300 appearance-none cursor-pointer relative z-20 ${
            isActive ? "pt-[21px] pb-[7px]" : "py-4"
          } ${!hasValue ? "text-transparent" : "text-black"}`}
        >
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option key={opt.code} value={opt.code}>{opt.name}</option>
          ))}
        </select>
        
        <div className="absolute right-4 pointer-events-none text-black/30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-red-500 font-medium pl-4 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function SignUpModal({ isOpen, onClose, initialMode = 'signup' }: SignUpModalProps) {
  const { syncCartWithApi, mergeGuestCartToApi } = useCart();
  const [authMode, setAuthMode] = useState<'signup' | 'signin' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'>(initialMode);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    rememberMe: false,
  });
  const [genders, setGenders] = useState<{code: string, name: string}[]>([]);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Fetch genders
  useEffect(() => {
    getLovDropdownList("Gender")
      .then((json: any) => {
        if (json && json.data) setGenders(json.data);
      })
      .catch((err: any) => console.error("Failed to fetch genders", err));
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", gender: "", dateOfBirth: "", rememberMe: false });
        setForgotEmail("");
        setForgotOtp("");
        setForgotPassword("");
        setForgotConfirmPassword("");
        setErrors({});
        setIsSuccess(false);
        setIsLoading(false);
        setShowPassword(false);
        setShowConfirm(false);
      }, 500);
      return () => clearTimeout(t);
    } else {
      setAuthMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const setField = (key: keyof typeof form) => (v: string | boolean) => {
    setForm((f) => ({ ...f, [key]: v }));
    if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    if (authMode.startsWith('forgot_')) return true;
    const e: Partial<typeof form> = {};
    if (authMode === 'signup' && !form.firstName.trim()) {
      e.firstName = "First name is required";
    }
    if (authMode === 'signup' && !form.lastName.trim()) {
      e.lastName = "Last name is required";
    }
    if (authMode === 'signup' && !form.gender) {
      e.gender = "Gender is required";
    }
    if (authMode === 'signup') {
      if (!form.dateOfBirth) {
        e.dateOfBirth = "Date of birth is required";
      } else {
        const birthDate = new Date(form.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (birthDate > today) {
          e.dateOfBirth = "Date of birth cannot be in the future";
        } else if (age < 18) {
          e.dateOfBirth = "You must be at least 18 years old";
        }
      }
    }
    if (!form.email.trim()) {
      e.email = authMode === 'signup' ? "Email address is required" : "Username/Email is required";
    } else if (authMode === 'signup' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email";
    }
    if (!form.password) {
      e.password = "Password is required";
    } else if (authMode === 'signup' && form.password.length < 8) {
      e.password = "Minimum 8 characters required";
    }
    if (authMode === 'signup') {
      if (form.password !== form.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    if (authMode === 'forgot_email') {
      if (!forgotEmail.trim()) { setErrors({ email: "Email is required" }); setIsLoading(false); return; }
      try {
        const result: any = await post("/CustomerAuth/ForgotPassword_GenerateOTP", { email: forgotEmail });
        showApiResponseToast(result);
        if (result.isSuccess || result.statusCode === 1 || result.StatusCode === 1) {
          setAuthMode('forgot_otp');
        }
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || err.message || "Failed to generate OTP");
      }
      setIsLoading(false);
      return;
    }

    if (authMode === 'forgot_otp') {
      if (!forgotOtp.trim()) { setErrors({ email: "OTP is required" }); setIsLoading(false); return; }
      try {
        const result: any = await post("/CustomerAuth/ForgotPassword_VerifyOTP", { email: forgotEmail, otp: parseInt(forgotOtp) });
        showApiResponseToast(result);
        if (result.isSuccess || result.statusCode === 1 || result.StatusCode === 1) {
          setAuthMode('forgot_reset');
        }
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || err.message || "Failed to verify OTP");
      }
      setIsLoading(false);
      return;
    }

    if (authMode === 'forgot_reset') {
      if (!forgotPassword || forgotPassword !== forgotConfirmPassword) {
        showToast("error", "Passwords do not match or are empty");
        setIsLoading(false);
        return;
      }
      try {
        const result: any = await post("/CustomerAuth/ForgotPassword_ResetPassword", { 
           email: forgotEmail, 
           otp: parseInt(forgotOtp), 
           newPassword: forgotPassword, 
           confirmPassword: forgotConfirmPassword 
        });
        showApiResponseToast(result);
        if (result.isSuccess || result.statusCode === 1 || result.StatusCode === 1) {
          setAuthMode('signin');
          setForgotPassword("");
          setForgotConfirmPassword("");
          setForgotOtp("");
        }
      } catch (err: any) {
        showToast("error", err?.response?.data?.message || err.message || "Failed to reset password");
      }
      setIsLoading(false);
      return;
    }

    if (authMode === 'signin') {
      try {
        const payload = {
          username: form.email,
          password: form.password
        };

        console.log("[Login API Request] Sending payload to /CustomerAuth/Login", payload);

        let result: any;
        try {
          result = await post("/CustomerAuth/Login", payload);
        } catch (e: any) {
          result = e.response?.data || {};
          if (!result.message && !result.Message) {
             throw new Error(`Login failed`);
          }
        }

        console.log("[Login API Response] Raw response:", result);

        // Prepare object for toaster
        const toastResult = {
          statusCode: result.statusCode ?? result.StatusCode,
          message: result.message || result.Message || "",
          isSuccess: result.isSuccess ?? result.IsSuccess,
          isConfirm: result.isConfirm ?? result.IsConfirm
        };

        // If message contains "|", show only the part before it
        if (toastResult.message && toastResult.message.includes("|")) {
          toastResult.message = toastResult.message.split("|")[0];
        }

        // Show toast
        showApiResponseToast(toastResult);

        const isSuccessVal = result.isSuccess || result.IsSuccess;
        const messageVal = result.message || result.Message || "";

        if (isSuccessVal && messageVal.includes("|")) {
          const parts = messageVal.split("|");
          const token = parts[1];
          if (token) {
            console.log("[Login API Success] Storing auth token:", token);
            localStorage.setItem("authToken", token);
            
            // Extract and save Customer ID and Profile
            const customerData = getCaseInsensitiveProperty(result, "data") || {};
            const customerId = getCaseInsensitiveProperty(customerData, "Id") || 
                               getCaseInsensitiveProperty(customerData, "CustomerId") || 
                               getCaseInsensitiveProperty(customerData, "UserId") || 
                               getCaseInsensitiveProperty(result, "Id") || 
                               getCaseInsensitiveProperty(result, "CustomerId") || 
                               getCaseInsensitiveProperty(result, "UserId");
            if (customerId) {
              console.log("[Login API Success] Storing customerId:", customerId);
              localStorage.setItem("customerId", String(customerId));
            }
            localStorage.setItem("customerProfile", JSON.stringify(customerData));
            
            await mergeGuestCartToApi();
            window.dispatchEvent(new Event("auth-change"));
          }

          setIsLoading(false);
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2500);
        } else {
          const errorMsg = result.message || result.Message || "Login failed. Please check your credentials.";
          setErrors({ email: errorMsg });
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("[Login API Error] Exception occurred:", error);
        setErrors({ email: "Network error. Unable to reach authentication server." });
        showToast("error", "Network error. Unable to reach authentication server.");
        setIsLoading(false);
      }
    } else {
      try {
        const payload = {
          customerId: 0,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          mobileNo: form.phone,
          password: form.password,
          conformpasswordPassword: form.confirmPassword,
          dateOfBirth: form.dateOfBirth ? `${form.dateOfBirth}T00:00:00.000Z` : null,
          gender: form.gender
        };

        console.log("[Register API Request] Sending payload to /CustomerAuth/Register", payload);

        let result: any;
        try {
          result = await post("/CustomerAuth/Register", payload);
        } catch (e: any) {
          result = e.response?.data || {};
          if (!result.message && !result.Message) {
            throw new Error(`Register failed`);
          }
        }

        console.log("[Register API Response] Raw response:", result);

        // Prepare object for toaster
        const toastResult = {
          statusCode: result.statusCode ?? result.StatusCode,
          message: result.message || result.Message || "",
          isSuccess: result.isSuccess ?? result.IsSuccess,
          isConfirm: result.isConfirm ?? result.IsConfirm
        };

        // Show toast
        showApiResponseToast(toastResult);

        const isSuccessVal = result.isSuccess || result.IsSuccess;

        if (isSuccessVal) {
          setIsSuccess(true);
          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("[Register API Error] Exception occurred:", error);
        setErrors({ email: "Network error. Unable to reach authentication server." });
        showToast("error", "Network error. Unable to reach authentication server.");
        setIsLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            key="signup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F0C14]/75 backdrop-blur-[16px] z-[10000] cursor-pointer"
          />

          {/* Floating Ambient Lighting behind modal */}
          <div className="fixed inset-0 pointer-events-none z-[10001] flex items-center justify-center overflow-hidden">
            <div className="absolute w-[600px] h-[600px] bg-[var(--color-primary)]/15 rounded-full blur-[140px] animate-pulse"></div>
            <div className="absolute w-[400px] h-[400px] bg-[var(--color-accent)]/10 rounded-full blur-[120px] translate-x-[200px] -translate-y-[150px]"></div>
          </div>

          {/* Centering wrapper */}
          <div className="fixed inset-0 flex items-center justify-center z-[10002] pointer-events-none p-4">
            
            {/* Modal Card */}
            <motion.div
              key="signup-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-[940px] max-h-[660px] md:h-full flex rounded-[2rem] overflow-hidden shadow-[0_30px_90px_rgba(15,12,20,0.55),0_10px_30px_rgba(91,42,134,0.15)] border border-white/10"
            >
              {/* LEFT PANEL — Brand / Decorative (30% width) */}
              <div
                className="hidden md:flex w-[32%] flex-shrink-0 relative bg-gradient-to-b from-[#150E20] via-[#2A1155] to-[#150E20] flex-col justify-between p-10 overflow-hidden border-r border-white/5"
              >
                {/* Ambient Blur Circles */}
                <div className="absolute -top-[15%] -left-[15%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,rgba(91,42,134,0.45)_0%,transparent_70%)] blur-[40px] animate-pulse" />
                <div className="absolute -bottom-[15%] -right-[15%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(166,120,214,0.3)_0%,transparent_70%)] blur-[30px]" />

                {/* Floating Particles */}
                {LEFT_PARTICLES.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/20"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: p.s,
                      height: p.s,
                    }}
                    animate={{
                      y: [0, -12, 0],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: p.dur,
                      delay: p.d,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Top: Logo */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="relative z-10"
                >
                  <img
                    src="/logo.webp"
                    alt="Hridhay Connect"
                    className="h-9 w-auto object-contain brightness-0 invert opacity-90"
                  />
                </motion.div>

                {/* Center: Quote & Value statement */}
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#A678D6]" />
                    <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-white/70">
                      The Ritual
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-light italic leading-tight text-white/90">
                    A space <br /> to pause, <br /> restore & connect.
                  </h3>

                  <p className="text-[10px] text-white/40 leading-relaxed font-light font-satoshi max-w-[190px]">
                    Step into an experience of pure, handcrafted wellness crafted to honor the rhythms of your body.
                  </p>
                </div>

                {/* Bottom: Quality Tags */}
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="h-[1px] bg-white/10 w-12 mb-2" />
                  <span className="text-[9px] uppercase tracking-wider text-white/30 font-light font-general flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#A678D6]/80" /> 100% Certified Organic
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/30 font-light font-general flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#A678D6]/80" /> Handcrafted Batching
                  </span>
                </div>
              </div>

              {/* RIGHT PANEL — Form Area (70% width) */}
              <div className="flex-1 bg-[var(--color-cream)] relative flex flex-col p-8 sm:p-12 overflow-y-auto scrollbar-thin">
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full border border-black/5 bg-white/50 hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/20 hover:text-[var(--color-primary)] flex items-center justify-center cursor-pointer transition-all duration-300 z-50 text-black/40 group shadow-sm"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* SUCCESS STATE OVERLAY */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[var(--color-cream)] flex flex-col items-center justify-center gap-6 p-8 z-40"
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/10 border-4 border-white"
                      >
                        <Check className="w-7 h-7 text-white stroke-[2.5]" />
                      </motion.div>

                      <div className="text-center space-y-2">
                        <h4 className="font-serif text-2xl italic text-[var(--color-dark-text)]">
                          {authMode === 'signup' ? 'Welcome to the Circle' : 'Welcome Back'}
                        </h4>
                        <p className="text-xs text-[var(--color-dark-text)]/50 font-light font-satoshi max-w-[260px] mx-auto leading-relaxed">
                          Your authorization has been confirmed. Transitioning you to your wellness sanctuary...
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FORM HEADER & TAB SWITCHER */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <h2 className="font-serif text-2xl font-light text-[var(--color-dark-text)]">
                      {authMode === 'signup' ? 'Create Account' : authMode.startsWith('forgot_') ? 'Forgot Password' : 'Welcome Back'}
                    </h2>
                    <p className="text-[11px] text-[var(--color-dark-text)]/40 font-light mt-1 font-satoshi">
                      {authMode === 'signup' 
                        ? 'Join our community for pure, restorative daily rituals.' 
                        : authMode.startsWith('forgot_')
                        ? 'Securely reset your password to regain access.'
                        : 'Securely sign into your private profile.'}
                    </p>
                  </div>

                  {/* Mode Tab Switcher */}
                  {!authMode.startsWith('forgot_') && (
                  <div className="bg-black/5 p-1 rounded-xl flex items-center self-start sm:self-auto relative border border-black/5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setErrors({}); }}
                      className={`relative z-10 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                        authMode === 'signin' ? 'text-white' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setErrors({}); }}
                      className={`relative z-10 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                        authMode === 'signup' ? 'text-white' : 'text-black/50 hover:text-black'
                      }`}
                    >
                      Sign Up
                    </button>

                    {/* Sliding background tag */}
                    <motion.div
                      layout
                      className="absolute top-1 bottom-1 rounded-lg bg-[var(--color-primary)] shadow-md"
                      style={{
                        left: authMode === 'signin' ? '4px' : 'calc(50% + 2px)',
                        width: 'calc(50% - 6px)',
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  </div>
                  )}
                </div>

                {/* AUTHENTICATION FORM */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between gap-8">
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      {authMode === 'forgot_email' ? (
                        <motion.div key="forgot-email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <FloatingInput label="Email Address" type="email" value={forgotEmail} onChange={setForgotEmail} error={errors.email} icon={<Mail className="w-4 h-4" />} name="forgotEmail" focusedField={focusedField} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} />
                        </motion.div>
                      ) : authMode === 'forgot_otp' ? (
                        <motion.div key="forgot-otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <FloatingInput label="Enter OTP" type="text" value={forgotOtp} onChange={setForgotOtp} error={errors.email} icon={<Lock className="w-4 h-4" />} name="forgotOtp" focusedField={focusedField} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} />
                        </motion.div>
                      ) : authMode === 'forgot_reset' ? (
                        <motion.div key="forgot-reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <FloatingInput label="New Password" type={showPassword ? "text" : "password"} value={forgotPassword} onChange={setForgotPassword} error={errors.password} icon={<Lock className="w-4 h-4" />} name="forgotPassword" focusedField={focusedField} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
                          <FloatingInput label="Confirm Password" type={showConfirm ? "text" : "password"} value={forgotConfirmPassword} onChange={setForgotConfirmPassword} icon={<Lock className="w-4 h-4" />} name="forgotConfirmPassword" focusedField={focusedField} onFocus={setFocusedField} onBlur={() => setFocusedField(null)} rightElement={<button type="button" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
                        </motion.div>
                      ) : authMode === 'signup' ? (
                        <motion.div
                          key="signup-fields"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            <FloatingInput
                              label="First Name"
                              type="text"
                              value={form.firstName}
                              onChange={(v) => setField("firstName")(v)}
                              error={errors.firstName}
                              icon={<User className="w-4 h-4" />}
                              name="firstName"
                              focusedField={focusedField}
                              onFocus={setFocusedField}
                              onBlur={() => setFocusedField(null)}
                              autoComplete="given-name"
                            />
                            <FloatingInput
                              label="Last Name"
                              type="text"
                              value={form.lastName}
                              onChange={(v) => setField("lastName")(v)}
                              error={errors.lastName}
                              icon={<User className="w-4 h-4" />}
                              name="lastName"
                              focusedField={focusedField}
                              onFocus={setFocusedField}
                              onBlur={() => setFocusedField(null)}
                              autoComplete="family-name"
                            />
                          </div>

                          <FloatingInput
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={(v) => setField("email")(v)}
                            error={errors.email}
                            icon={<Mail className="w-4 h-4" />}
                            name="email"
                            focusedField={focusedField}
                            onFocus={setFocusedField}
                            onBlur={() => setFocusedField(null)}
                            autoComplete="email"
                          />

                          <FloatingInput
                            label="Phone Number (optional)"
                            type="tel"
                            value={form.phone}
                            onChange={(v) => setField("phone")(v)}
                            icon={<Phone className="w-4 h-4" />}
                            name="phone"
                            focusedField={focusedField}
                            onFocus={setFocusedField}
                            onBlur={() => setFocusedField(null)}
                            autoComplete="tel"
                          />

                          <div className="flex flex-col sm:flex-row gap-4">
                            <FloatingSelect
                              label="Gender"
                              value={form.gender}
                              onChange={(v) => setField("gender")(v)}
                              error={errors.gender}
                              icon={<User className="w-4 h-4" />}
                              name="gender"
                              focusedField={focusedField}
                              onFocus={setFocusedField}
                              onBlur={() => setFocusedField(null)}
                              options={genders}
                            />
                            <FloatingInput
                              label="Date of Birth"
                              type="date"
                              value={form.dateOfBirth}
                              onChange={(v) => setField("dateOfBirth")(v)}
                              error={errors.dateOfBirth}
                              rightElement={<Calendar className="w-4 h-4" />}
                              name="dateOfBirth"
                              focusedField={focusedField}
                              onFocus={setFocusedField}
                              onBlur={() => setFocusedField(null)}
                              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                            />
                          </div>

                          <FloatingInput
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(v) => setField("password")(v)}
                            error={errors.password}
                            icon={<Lock className="w-4 h-4" />}
                            name="password"
                            focusedField={focusedField}
                            onFocus={setFocusedField}
                            onBlur={() => setFocusedField(null)}
                            autoComplete="new-password"
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="background-none border-none outline-none focus:outline-none flex items-center cursor-pointer p-0"
                                tabIndex={-1}
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />

                          <FloatingInput
                            label="Confirm Password"
                            type={showConfirm ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={(v) => setField("confirmPassword")(v)}
                            error={errors.confirmPassword}
                            icon={<Lock className="w-4 h-4" />}
                            name="confirmPassword"
                            focusedField={focusedField}
                            onFocus={setFocusedField}
                            onBlur={() => setFocusedField(null)}
                            autoComplete="new-password"
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="background-none border-none outline-none focus:outline-none flex items-center cursor-pointer p-0"
                                tabIndex={-1}
                              >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signin-fields"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <FloatingInput
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={(v) => setField("email")(v)}
                            error={errors.email}
                            icon={<Mail className="w-4 h-4" />}
                            name="email"
                            focusedField={focusedField}
                            onFocus={setFocusedField}
                            onBlur={() => setFocusedField(null)}
                            autoComplete="email"
                          />

                          <FloatingInput
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(v) => setField("password")(v)}
                            error={errors.password}
                            icon={<Lock className="w-4 h-4" />}
                            name="password"
                            focusedField={focusedField}
                            onFocus={setFocusedField}
                            onBlur={() => setFocusedField(null)}
                            autoComplete="current-password"
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="background-none border-none outline-none focus:outline-none flex items-center cursor-pointer p-0"
                                tabIndex={-1}
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Checkbox and Forgot Password link */}
                    {!authMode.startsWith('forgot_') && (
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <div
                          onClick={() => setField("rememberMe")(!form.rememberMe)}
                          className={`w-[17px] h-[17px] rounded-md border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            form.rememberMe
                              ? "border-[var(--color-primary)] bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-sm"
                              : "border-black/20 hover:border-black/35"
                          }`}
                        >
                          {form.rememberMe && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="text-[11px] text-black/50 font-satoshi font-light">
                          Keep me signed in
                        </span>
                      </label>

                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot_email')}
                          className="text-[11px] text-[var(--color-primary)] hover:underline font-satoshi font-semibold tracking-wide cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="space-y-4">
                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full py-4.5 rounded-2xl font-semibold text-xs uppercase tracking-widest text-white shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 ${
                        isLoading
                          ? "bg-[var(--color-primary)]/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#5B2A86] via-[#7A49A5] to-[#A678D6] hover:shadow-lg hover:shadow-[var(--color-primary)]/20"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Preparing Ritual…</span>
                        </>
                      ) : (
                        <>
                          <span>{authMode === 'signup' ? 'Create Account' : authMode === 'forgot_email' ? 'Send OTP' : authMode === 'forgot_otp' ? 'Verify OTP' : authMode === 'forgot_reset' ? 'Reset Password' : 'Sign In'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </motion.button>



                    {/* Bottom toggle helper */}
                    {authMode.startsWith('forgot_') ? (
                      <p className="text-center text-[11px] text-black/45 font-light font-satoshi">
                        Remember your password?{' '}
                        <button type="button" onClick={() => setAuthMode('signin')} className="text-[var(--color-primary)] font-semibold hover:underline cursor-pointer">
                          Sign In
                        </button>
                      </p>
                    ) : (
                      <p className="text-center text-[11px] text-black/45 font-light font-satoshi">
                        {authMode === 'signup' ? 'Already have an account? ' : 'New to Hridhay Connect? '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode(authMode === 'signup' ? 'signin' : 'signup');
                            setErrors({});
                          }}
                          className="text-[var(--color-primary)] font-semibold hover:underline cursor-pointer"
                        >
                          {authMode === 'signup' ? 'Sign In' : 'Create Account'}
                        </button>
                      </p>
                    )}
                  </div>
                </form>

              </div>
            </motion.div>

          </div>
        </>
      )}
    </AnimatePresence>
  );
}
