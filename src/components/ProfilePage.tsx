import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Shield, ArrowLeft, ShoppingBag, LogOut, Edit2, Save, X, MapPin, Gift, Ticket, Award, ChevronRight, Plus, Truck, CheckCircle2, Calendar } from "lucide-react";
import { get, post } from "../api/BaseService";
import { getCaseInsensitiveProperty } from "../api/productService";
import { showApiResponseToast, showToast } from "../utils/toastService";

interface ProfileData {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  MobileNo: string;
  Gender: string;
  GenderName: string;
}

interface AddressInfo {
  Id: number;
  CustomerId: number;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  PostalCode: string;
  IsDefault: boolean;
  AddressType: string;
  MobileNo: string;
  AlternativeMobileNo: string;
  CountryId: number;
  StateId: number;
  Country?: string;
  State?: string;
}

interface OrderItem {
  Id: number;
  OrderId: number;
  ProductName: string;
  VariantName: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
  ImagePath?: string;
}

interface Order {
  Id: number;
  OrderNumber: string;
  OrderDate: string;
  TotalAmount: number;
  DiscountAmount: number;
  FinalAmount: number;
  GrandTotal: number;
  DeliveryFee: number;
  UsedCoins: number;
  CoinDiscountAmount: number;
  TrackingHistory: string;
  PaymentStatusName: string;
  OrderStatusName: string;
  PaymentModeName: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  PostalCode: string;
}

const safeRender = (val: any) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return '';
  return String(val);
};

const parseTrackingHistory = (historyStr: string) => {
  if (!historyStr || typeof historyStr !== 'string') return [];
  const parts = historyStr.split(',').map(s => s.trim()).filter(Boolean);
  return parts.map(part => {
    const match = part.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return { status: match[1].trim(), date: match[2].trim() };
    }
    return { status: part, date: '' };
  });
};

const STANDARD_TIMELINE_STEPS = [
  "Order Placed",
  "Order Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];

export const ProfilePage = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: ""
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return ['profile', 'orders', 'addresses', 'rewards'].includes(hash) ? hash : 'profile';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['profile', 'orders', 'addresses', 'rewards'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Address states
  const [homeAddress, setHomeAddress] = useState<AddressInfo | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<AddressInfo[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressFormMode, setAddressFormMode] = useState<'HOME' | 'SHIPPING'>('SHIPPING');
  const [addressForm, setAddressForm] = useState<Partial<AddressInfo>>({});
  const [countries, setCountries] = useState<{id: number, name: string}[]>([]);
  const [states, setStates] = useState<{id: number, name: string}[]>([]);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Order states
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Cancel Order states
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("I have changed my mind");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  
  // Order filtering states
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [isOrderFilterOpen, setIsOrderFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const customerId = localStorage.getItem("customerId");

      if (!customerId) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
      }

      const bodyObj = {
        Id: Number(customerId),
        Search: ""
      };

      const result: any = await post("/Customer/GetAll", bodyObj);
      const dataObj = getCaseInsensitiveProperty(result, "data") || result;

      // Look for table1 (Profile Details)
      let table1 = getCaseInsensitiveProperty<any[]>(dataObj, "table1") || [];
      if (!Array.isArray(table1) || table1.length === 0) {
        for (const key of Object.keys(dataObj)) {
          if (Array.isArray(dataObj[key]) && key.toLowerCase().includes("table1")) {
            table1 = dataObj[key];
            break;
          }
        }
      }

      if (table1 && table1.length > 0) {
        setProfileData(table1[0]);
        setForm({
          firstName: table1[0].FirstName || "",
          lastName: table1[0].LastName || "",
          email: table1[0].Email || "",
          mobileNo: table1[0].MobileNo || ""
        });
      } else {
        setError("Profile details not found.");
      }

      // Look for table2 (Addresses)
      let table2 = getCaseInsensitiveProperty<any[]>(dataObj, "table2") || [];
      if (!Array.isArray(table2) || table2.length === 0) {
        for (const key of Object.keys(dataObj)) {
          if (Array.isArray(dataObj[key]) && key.toLowerCase().includes("table2")) {
            table2 = dataObj[key];
            break;
          }
        }
      }

      if (table2 && table2.length > 0) {
        const home = table2.find(a => a.AddressType === "HOME");
        const shipping = table2.filter(a => a.AddressType === "SHIPPING");
        setHomeAddress(home || null);
        setShippingAddresses(shipping);
      } else {
        setHomeAddress(null);
        setShippingAddresses([]);
      }

      // Look for table4 (Orders)
      let table4 = getCaseInsensitiveProperty<any[]>(dataObj, "table4") || [];
      if (!Array.isArray(table4) || table4.length === 0) {
        for (const key of Object.keys(dataObj)) {
          if (Array.isArray(dataObj[key]) && key.toLowerCase().includes("table4")) {
            table4 = dataObj[key];
            break;
          }
        }
      }
      setOrders(table4 || []);

      // Look for table5 (Order Items)
      let table5 = getCaseInsensitiveProperty<any[]>(dataObj, "table5") || [];
      if (!Array.isArray(table5) || table5.length === 0) {
        for (const key of Object.keys(dataObj)) {
          if (Array.isArray(dataObj[key]) && key.toLowerCase().includes("table5")) {
            table5 = dataObj[key];
            break;
          }
        }
      }
      setOrderItems(table5 || []);

    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError("Failed to load profile details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelingOrder) return;
    try {
      setIsSubmittingCancel(true);
      const payload = {
        id: cancelingOrder.Id,
        status: "8",
        reason: cancelReason
      };
      
      // We pass the payload in the body AND as query parameters. 
      // .NET binds primitive parameters (int id, string status) from the query string 
      // unless there is a [FromBody] wrapper class defined.
      const queryParams = new URLSearchParams({
        id: cancelingOrder.Id.toString(),
        status: "8",
        reason: cancelReason
      }).toString();

      const response: any = await post(`/Orders/UpdateChnageStatus?${queryParams}`, payload);
      
      if (response && response.statusCode === 200) {
        showToast("success", "Order cancelled successfully!");
        setCancelingOrder(null);
        setSelectedOrder(null);
        fetchProfile();
      } else {
        showToast("error", response?.message || "Failed to cancel order.");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      showToast("error", "An error occurred while canceling the order.");
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const getPrefix = (genderId: string) => {
    if (genderId === "1") return "Mr. ";
    if (genderId === "2") return "Ms. ";
    return "";
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return;

      const payload = {
        id: Number(customerId),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        mobileNo: form.mobileNo
      };

      const result: any = await post("/Customer/UpdateProfile", payload);
      showApiResponseToast(result);

      if (result.isSuccess || result.statusCode === 1 || result.StatusCode === 1) {
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch Countries
  useEffect(() => {
    if (isAddressModalOpen && countries.length === 0) {
      get("/Dropdown/CountryList").then((res: any) => {
        if (res && res.data) setCountries(res.data);
      }).catch(console.error);
    }
  }, [isAddressModalOpen]);

  // Fetch States based on Country
  useEffect(() => {
    if (addressForm.CountryId && addressForm.CountryId > 0) {
      get(`/Dropdown/StateList?CountryId=${addressForm.CountryId}`).then((res: any) => {
        if (res && res.data) setStates(res.data);
      }).catch(console.error);
    } else {
      setStates([]);
    }
  }, [addressForm.CountryId]);

  const openAddressModal = (mode: 'HOME' | 'SHIPPING', existingAddr?: AddressInfo) => {
    setAddressFormMode(mode);
    if (existingAddr) {
      setAddressForm({ ...existingAddr });
    } else {
      setAddressForm({ CountryId: 0, StateId: 0 });
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingAddress(true);
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return;

      const payload = {
        id: addressForm.Id || 0,
        customerId: Number(customerId),
        countryId: Number(addressForm.CountryId),
        stateId: Number(addressForm.StateId),
        addressLine1: addressForm.AddressLine1 || "",
        addressLine2: addressForm.AddressLine2 || "",
        city: addressForm.City || "",
        postalCode: addressForm.PostalCode || "",
        mobileNo: addressForm.MobileNo || "",
        alternativeMobileNo: addressForm.AlternativeMobileNo || "",
        addressType: addressFormMode
      };

      const res: any = await post("/Customer/Save", payload);
      showApiResponseToast(res);
      
      if (res.isSuccess || res.statusCode === 1 || res.StatusCode === 1) {
        setIsAddressModalOpen(false);
        fetchProfile(); 
      }
    } catch (err: any) {
      showToast("error", "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSetDefaultShipping = async (addressId: number) => {
    try {
      const res: any = await post(`/Customer/ChangeDefaultAddress?CustomerAddressId=${addressId}`, {});
      showApiResponseToast(res);
      fetchProfile();
    } catch(err: any) {
      showToast("error", "Failed to set default address");
    }
  };

  // Navigation Menu Items
  const navItems = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'rewards', label: 'Rewards', icon: Gift }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-24 relative overflow-hidden">
      {/* Background decoration for glassmorphism context */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-80 -right-20 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <a href="#home" className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80 transition-opacity text-sm font-medium mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </a>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-neutral-900 tracking-tight">
              My Account
            </h1>
            <p className="text-neutral-500 mt-2 font-satoshi text-base">
              Manage your personal information, orders, and preferences.
            </p>
          </motion.div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-4 lg:sticky lg:top-32">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20' 
                          : 'text-neutral-600 hover:bg-neutral-50/80 hover:text-[var(--color-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                        <span className="font-satoshi font-medium text-sm">{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : 'opacity-0 -translate-x-2'}`} />
                    </button>
                  );
                })}
                
                <div className="h-px bg-neutral-100 my-2"></div>
                
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("customerId");
                    localStorage.removeItem("customerProfile");
                    window.location.hash = "#home";
                    window.location.reload();
                  }}
                  className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50/80 transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
                  <span className="font-satoshi font-medium text-sm">Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden min-h-[600px]">
              
              {/* Profile Details Tab */}
              {activeTab === 'profile' && (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                      <div className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin"></div>
                      <p className="text-sm text-neutral-500 font-satoshi animate-pulse">Loading your profile...</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4 px-6">
                      <Shield className="w-16 h-16 text-red-300 opacity-50 mb-2" />
                      <p className="text-red-500 font-satoshi">{error}</p>
                      <button
                        onClick={fetchProfile}
                        className="mt-4 px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-sm font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : profileData ? (
                    <div className="p-6 sm:p-12">
                      
                      {/* Profile Header Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-10 border-b border-neutral-100/80">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-4xl font-serif shadow-xl shadow-[var(--color-primary)]/20 border-4 border-white">
                              {profileData.FirstName ? profileData.FirstName[0].toUpperCase() : <User className="w-12 h-12" />}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-sm border border-neutral-100">
                              <Award className="w-6 h-6 text-yellow-500" />
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <h2 className="text-3xl font-serif text-neutral-900 mb-1 tracking-tight">
                              {getPrefix(profileData.Gender)}
                              {profileData.FirstName} {profileData.LastName}
                            </h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/5 rounded-full w-fit mt-1">
                              <Award className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                              <span className="text-[var(--color-primary)] text-xs font-semibold tracking-wider uppercase">
                                Hridhay Connect Member
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:ml-auto mt-4 sm:mt-0">
                          {isEditing ? (
                            <div className="flex items-center gap-3">
                              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors font-medium text-sm flex items-center gap-2">
                                <X className="w-4 h-4" /> Cancel
                              </button>
                              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition-all shadow-lg shadow-[var(--color-primary)]/25 font-medium text-sm flex items-center gap-2 disabled:opacity-70">
                                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-200/80 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all font-medium text-sm shadow-sm">
                              <Edit2 className="w-4 h-4" />
                              Edit Profile
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Information Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* First Name */}
                        <div className="group bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-100 hover:border-[var(--color-primary)]/30 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4 text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-satoshi text-xs uppercase tracking-widest font-semibold">First Name</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={form.firstName}
                              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white text-neutral-900 font-medium transition-all"
                              placeholder="Enter your first name"
                            />
                          ) : (
                            <p className="text-neutral-900 font-medium text-lg px-2">
                              {profileData.FirstName || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="group bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-100 hover:border-[var(--color-primary)]/30 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4 text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-satoshi text-xs uppercase tracking-widest font-semibold">Last Name</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={form.lastName}
                              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white text-neutral-900 font-medium transition-all"
                              placeholder="Enter your last name"
                            />
                          ) : (
                            <p className="text-neutral-900 font-medium text-lg px-2">
                              {profileData.LastName || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Email Address */}
                        <div className="group bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-100 hover:border-[var(--color-primary)]/30 transition-all duration-300 md:col-span-2">
                          <div className="flex items-center gap-3 mb-4 text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                              <Mail className="w-4 h-4" />
                            </div>
                            <span className="font-satoshi text-xs uppercase tracking-widest font-semibold">Email Address</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white text-neutral-900 font-medium transition-all"
                              placeholder="Enter your email address"
                            />
                          ) : (
                            <p className="text-neutral-900 font-medium text-lg px-2">
                              {profileData.Email || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Mobile Number */}
                        <div className="group bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-100 hover:border-[var(--color-primary)]/30 transition-all duration-300 md:col-span-2">
                          <div className="flex items-center gap-3 mb-4 text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                              <Phone className="w-4 h-4" />
                            </div>
                            <span className="font-satoshi text-xs uppercase tracking-widest font-semibold">Mobile Number</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={form.mobileNo}
                              onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white text-neutral-900 font-medium transition-all"
                              placeholder="Enter your mobile number"
                            />
                          ) : (
                            <p className="text-neutral-900 font-medium text-lg px-2">
                              {profileData.MobileNo || "Not provided"}
                            </p>
                          )}
                        </div>

                      </div>
                    </div>
                  ) : null}
                </>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6 sm:p-12 space-y-12">
                  <div className="flex items-center justify-between border-b border-neutral-100/80 pb-6">
                    <h2 className="text-3xl font-serif text-neutral-900 tracking-tight">Saved Addresses</h2>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {/* HOME ADDRESS */}
                      <section className="space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-neutral-800 flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                            Home Address
                          </h3>
                          {!homeAddress && (
                            <button onClick={() => openAddressModal('HOME')} className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1.5 transition-colors">
                              <Plus className="w-4 h-4" /> Add Home Address
                            </button>
                          )}
                        </div>
                        
                        {homeAddress ? (
                          <div className="bg-white rounded-3xl p-7 border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative hover:border-[var(--color-primary)]/30 transition-colors">
                            <span className="absolute top-5 right-5 text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-1 rounded-md uppercase tracking-wider font-bold">HOME</span>
                            <p className="font-semibold text-neutral-900 text-lg mb-2">{profileData?.FirstName} {profileData?.LastName}</p>
                            <p className="text-sm text-neutral-600 mb-1 leading-relaxed">{safeRender(homeAddress.AddressLine1)} {homeAddress.AddressLine2 && typeof homeAddress.AddressLine2 !== 'object' ? `, ${homeAddress.AddressLine2}` : ''}</p>
                            <p className="text-sm text-neutral-600 mb-1">{safeRender(homeAddress.City)}, {safeRender(homeAddress.PostalCode)}</p>
                            <p className="text-sm text-neutral-600 mb-1">{safeRender(homeAddress.State)} {safeRender(homeAddress.Country)}</p>
                            <p className="text-sm font-medium text-neutral-700 mb-4 mt-2 bg-neutral-50 px-3 py-1.5 rounded-lg inline-block">Mobile: {safeRender(homeAddress.MobileNo)}</p>
                            <div className="pt-4 border-t border-neutral-50">
                              <button onClick={() => openAddressModal('HOME', homeAddress)} className="text-xs font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity flex items-center gap-1.5">
                                <Edit2 className="w-3.5 h-3.5" /> Edit Address
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white/50 rounded-3xl p-10 border border-neutral-200 border-dashed text-center hover:bg-white transition-colors">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MapPin className="w-6 h-6 text-neutral-400" />
                            </div>
                            <p className="text-sm text-neutral-500 mb-4">You haven't saved a home address yet.</p>
                            <button onClick={() => openAddressModal('HOME')} className="px-6 py-2.5 bg-white border border-neutral-200 shadow-sm rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                              Add Home Address
                            </button>
                          </div>
                        )}
                      </section>

                      {/* SHIPPING ADDRESSES */}
                      <section className="space-y-5 pt-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-neutral-800 flex items-center gap-3">
                            <Truck className="w-5 h-5 text-[var(--color-primary)]" />
                            Shipping Addresses
                          </h3>
                          <button onClick={() => openAddressModal('SHIPPING')} className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1.5 transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                          </button>
                        </div>

                        {shippingAddresses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {shippingAddresses.map(addr => (
                              <div key={addr.Id} className={`bg-white rounded-3xl p-7 border ${addr.IsDefault ? 'border-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/10' : 'border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-neutral-200'} relative transition-colors`}>
                                {addr.IsDefault && (
                                  <span className="absolute top-5 right-5 text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2.5 py-1 rounded-md uppercase tracking-wider font-bold flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Default
                                  </span>
                                )}
                                <p className="font-semibold text-neutral-900 text-lg mb-2">{profileData?.FirstName} {profileData?.LastName}</p>
                                <p className="text-sm text-neutral-600 mb-1 leading-relaxed">{safeRender(addr.AddressLine1)} {addr.AddressLine2 && typeof addr.AddressLine2 !== 'object' ? `, ${addr.AddressLine2}` : ''}</p>
                                <p className="text-sm text-neutral-600 mb-1">{safeRender(addr.City)}, {safeRender(addr.PostalCode)}</p>
                                <p className="text-sm text-neutral-600 mb-1">{safeRender(addr.State)} {safeRender(addr.Country)}</p>
                                <p className="text-sm font-medium text-neutral-700 mb-4 mt-2 bg-neutral-50 px-3 py-1.5 rounded-lg inline-block">Mobile: {safeRender(addr.MobileNo)}</p>
                                
                                <div className="flex items-center gap-4 pt-4 border-t border-neutral-50">
                                  <button onClick={() => openAddressModal('SHIPPING', addr)} className="text-xs font-semibold text-neutral-500 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                  </button>
                                  {!addr.IsDefault && (
                                    <>
                                      <span className="text-neutral-200">|</span>
                                      <button onClick={() => handleSetDefaultShipping(addr.Id)} className="text-xs font-semibold text-neutral-500 hover:text-[var(--color-primary)] transition-colors">
                                        Set as Default
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white/50 rounded-3xl p-10 border border-neutral-200 border-dashed text-center hover:bg-white transition-colors">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Truck className="w-6 h-6 text-neutral-400" />
                            </div>
                            <p className="text-sm text-neutral-500 mb-4">You haven't saved any shipping addresses yet.</p>
                            <button onClick={() => openAddressModal('SHIPPING')} className="px-6 py-2.5 bg-white border border-neutral-200 shadow-sm rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                              Add Shipping Address
                            </button>
                          </div>
                        )}
                      </section>
                    </>
                  )}
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div className="p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
                  {selectedOrder ? (
                    /* FULL SCREEN ORDER DETAILS VIEW */
                    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-10">
                      {(() => {
                        const order = selectedOrder;
                        const items = orderItems.filter(item => item.OrderId === order.Id);
                        const trackingSteps = parseTrackingHistory(order.TrackingHistory);
                        
                        // Determine active step index
                        let activeStepIndex = 0;
                        const completedStatuses = trackingSteps.map(t => t.status.toLowerCase());
                        let timeline: any[] = [];
                        
                        const isCancelled = completedStatuses.some(s => s.includes('cancel'));
                        const isReturned = completedStatuses.some(s => s.includes('return') || s.includes('refund'));

                        if (isCancelled || isReturned) {
                          // For cancelled/returned, the standard timeline doesn't apply. Just show actual history exactly.
                          timeline = trackingSteps.map((step, idx) => {
                            activeStepIndex = idx;
                            return {
                              name: step.status,
                              isCompleted: true,
                              date: step.date,
                              isActive: false,
                              isErrorState: step.status.toLowerCase().includes('cancel') || step.status.toLowerCase().includes('return')
                            };
                          });
                        } else {
                          // Map standard steps for active orders
                          timeline = STANDARD_TIMELINE_STEPS.map((step, idx) => {
                             const isCompleted = completedStatuses.some(s => s.includes(step.toLowerCase()) || step.toLowerCase().includes(s));
                             const trackingDetail = trackingSteps.find(t => t.status.toLowerCase().includes(step.toLowerCase()) || step.toLowerCase().includes(t.status.toLowerCase()));
                             if (isCompleted) activeStepIndex = idx;
                             return {
                               name: step,
                               isCompleted,
                               date: trackingDetail ? trackingDetail.date : null,
                               isActive: false
                             };
                          });
                        }
                        
                        // Fix active step highlighting
                        timeline.forEach((step, idx) => {
                          step.isActive = idx === activeStepIndex;
                        });

                        return (
                          <>
                            {/* Back Button & Header Card */}
                            <div className="flex flex-col gap-6">
                              <div className="flex items-center justify-between">
                                <button 
                                  onClick={() => setSelectedOrder(null)} 
                                  className="flex items-center gap-2 text-neutral-500 hover:text-[var(--color-primary)] font-semibold text-sm transition-colors bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm hover:shadow-md"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                  Back to Orders
                                </button>

                                {order.OrderStatusName !== 'Cancelled' && order.OrderStatusName !== 'Delivered' && order.OrderStatusName !== 'Returned' && order.OrderStatusName !== 'Refunded' && (
                                  <button 
                                    onClick={() => setCancelingOrder(order)}
                                    className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 font-semibold text-sm transition-colors bg-white px-5 py-2 rounded-full border border-red-200 hover:border-red-500 shadow-sm hover:shadow-md"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel Order
                                  </button>
                                )}
                              </div>
                              
                              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                                
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight">Order #{safeRender(order.OrderNumber)}</h2>
                                  </div>
                                  <p className="text-neutral-500 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Placed on {new Date(safeRender(order.OrderDate)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                  </p>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex flex-col items-start md:items-end gap-1.5">
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Order Status</span>
                                    <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-xl ${
                                      ['Cancelled', 'Returned', 'Refunded', 'Cancel'].some(s => safeRender(order.OrderStatusName).includes(s)) 
                                        ? 'bg-red-50 text-red-600 border border-red-100' 
                                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                    }`}>
                                      {safeRender(order.OrderStatusName)}
                                    </span>
                                  </div>
                                  <div className="w-px h-10 bg-neutral-200 hidden md:block mx-2"></div>
                                  <div className="flex flex-col items-start gap-1.5">
                                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Payment Status</span>
                                    <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-xl ${order.PaymentStatusName === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                      {safeRender(order.PaymentStatusName)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tracking Timeline (Horizontal) */}
                            <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/50 overflow-x-auto">
                              <h3 className="font-serif text-xl text-neutral-900 mb-8 sm:mb-10">Order Status</h3>
                              <div className="min-w-[600px] relative">
                                {/* Connecting Line Background */}
                                <div className="absolute top-5 left-[5%] right-[5%] h-1.5 bg-neutral-100 rounded-full"></div>
                                {/* Connecting Line Active */}
                                <div 
                                  className={`absolute top-5 left-[5%] h-1.5 rounded-full transition-all duration-1000 ease-in-out ${
                                    timeline.some(t => t.isErrorState) ? 'bg-red-500' : 'bg-[var(--color-primary)]'
                                  }`}
                                  style={{ width: `${timeline.length > 1 ? (activeStepIndex / (timeline.length - 1)) * 90 : 0}%` }}
                                ></div>

                                <div className="relative flex justify-between">
                                  {timeline.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center w-24 relative z-10">
                                      <div className={`w-11 h-11 rounded-full flex items-center justify-center border-[3px] bg-white transition-colors duration-500 ${
                                        step.isErrorState
                                          ? 'border-red-500 text-red-500'
                                          : step.isCompleted 
                                            ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                                            : step.isActive 
                                              ? 'border-[var(--color-primary)] text-[var(--color-primary)] shadow-[0_0_0_4px_rgba(var(--color-primary-rgb),0.1)]' 
                                              : 'border-neutral-200 text-neutral-300'
                                      }`}>
                                        {step.isErrorState ? (
                                          <X className="w-5 h-5" />
                                        ) : step.isCompleted ? (
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        ) : (
                                          <div className={`w-3 h-3 rounded-full ${step.isActive ? 'bg-[var(--color-primary)]' : 'bg-neutral-200'}`}></div>
                                        )}
                                      </div>
                                      <div className="text-center mt-3">
                                        <p className={`text-xs font-bold leading-tight uppercase tracking-wider ${step.isCompleted || step.isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                          {step.name}
                                        </p>
                                        {step.date && (
                                          <p className="text-[10px] text-neutral-500 font-medium mt-1">{step.date}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                              {/* Left Column: Products & Status History & Address */}
                              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                                
                                {/* Product List */}
                                <div className="space-y-4">
                                  <h3 className="font-serif text-xl text-neutral-900 px-2">Items Ordered ({items.length})</h3>
                                  <div className="grid grid-cols-1 gap-4">
                                    {items.map(item => (
                                      <div key={item.Id} className="bg-white rounded-[1.5rem] p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-neutral-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                                        <div className="w-20 h-20 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                                          {item.ImagePath && typeof item.ImagePath === 'string' && item.ImagePath.trim() !== '' ? (
                                            <img 
                                              src={`https://localhost:7103${item.ImagePath}`} 
                                              alt={safeRender(item.ProductName)} 
                                              className="w-full h-full object-cover" 
                                              onError={(e) => { 
                                                e.currentTarget.style.display = 'none'; 
                                                if(e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.classList.remove('hidden'); 
                                              }} 
                                            />
                                          ) : null}
                                          <ShoppingBag className={`w-8 h-8 text-neutral-300 ${item.ImagePath && typeof item.ImagePath === 'string' && item.ImagePath.trim() !== '' ? 'hidden' : ''}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-neutral-900 text-lg truncate">{safeRender(item.ProductName)}</p>
                                          {item.VariantName && typeof item.VariantName === 'string' && item.VariantName.trim() !== '' && (
                                            <p className="text-sm text-neutral-500 mt-0.5">Variant: {item.VariantName}</p>
                                          )}
                                          <div className="flex items-center gap-4 mt-2">
                                            <p className="text-sm font-semibold text-neutral-600 bg-neutral-50 px-3 py-1 rounded-lg">Qty: {safeRender(item.Quantity)}</p>
                                            <p className="text-sm font-medium text-neutral-500">₹{safeRender(item.UnitPrice)} each</p>
                                          </div>
                                        </div>
                                        <div className="sm:text-right mt-2 sm:mt-0">
                                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total</p>
                                          <p className="font-bold text-xl text-neutral-900">₹{safeRender(item.TotalPrice)}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                                  {/* Shipping Address */}
                                  <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/50 h-fit">
                                    <div className="flex items-center gap-3 mb-6">
                                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                                      </div>
                                      <h3 className="font-serif text-xl text-neutral-900">Shipping Address</h3>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Deliver To</p>
                                        <p className="font-bold text-neutral-900">{profileData?.FirstName} {profileData?.LastName}</p>
                                        <p className="text-sm font-medium text-neutral-600 flex items-center gap-1.5 mt-1">
                                          <Phone className="w-3.5 h-3.5" /> {safeRender(order.MobileNo)}
                                          {order.AlternativeMobileNo && typeof order.AlternativeMobileNo === 'string' && ` / ${order.AlternativeMobileNo}`}
                                        </p>
                                      </div>
                                      <div className="w-full h-px bg-neutral-100"></div>
                                      <div>
                                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Address</p>
                                        <p className="text-sm text-neutral-700 leading-relaxed">{safeRender(order.AddressLine1)}</p>
                                        {order.AddressLine2 && typeof order.AddressLine2 === 'string' && (
                                          <p className="text-sm text-neutral-700 leading-relaxed">{order.AddressLine2}</p>
                                        )}
                                        <p className="text-sm text-neutral-700 leading-relaxed">{safeRender(order.City)} - {safeRender(order.PostalCode)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Order Summary */}
                              <div className="lg:col-span-1">
                                <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/50 sticky top-32">
                                  <h3 className="font-serif text-xl text-neutral-900 mb-6">Order Summary</h3>
                                  
                                  <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm font-medium text-neutral-600">
                                      <span>Subtotal ({items.length} items)</span>
                                      <span>₹{safeRender(order.TotalAmount)}</span>
                                    </div>
                                    
                                    {order.DeliveryFee > 0 ? (
                                      <div className="flex justify-between items-center text-sm font-medium text-neutral-600">
                                        <span>Delivery Fee</span>
                                        <span>+₹{safeRender(order.DeliveryFee)}</span>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-center text-sm font-medium text-green-600">
                                        <span>Delivery Fee</span>
                                        <span>Free</span>
                                      </div>
                                    )}

                                    {order.DiscountAmount > 0 && (
                                      <div className="flex justify-between items-center text-sm font-medium text-green-600 bg-green-50/50 p-2 rounded-lg -mx-2">
                                        <span>Offer Discount</span>
                                        <span>-₹{safeRender(order.DiscountAmount)}</span>
                                      </div>
                                    )}

                                    {order.CoinDiscountAmount > 0 && (
                                      <div className="flex justify-between items-center text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/5 p-2 rounded-lg -mx-2">
                                        <span>Coins Used ({safeRender(order.UsedCoins)})</span>
                                        <span>-₹{safeRender(order.CoinDiscountAmount)}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-5 border-t border-neutral-100 border-dashed">
                                    <div className="flex justify-between items-end mb-2">
                                      <span className="text-base font-bold text-neutral-900">Grand Total</span>
                                      <span className="text-3xl font-bold text-[var(--color-primary)] tracking-tight">₹{safeRender(order.GrandTotal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100">
                                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Payment Mode</span>
                                      <span className="text-sm font-bold text-neutral-900">{safeRender(order.PaymentModeName)}</span>
                                    </div>
                                  </div>
                                  
                                  <button onClick={() => { /* Need Help Logic */ }} className="w-full mt-6 py-3.5 bg-white border-2 border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
                                    Need Help?
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    /* LIST VIEW - CARDS */
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                        <h2 className="text-3xl font-serif text-neutral-900 tracking-tight">Order History</h2>
                        
                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative">
                          <div className="relative w-full sm:w-64">
                            <input 
                              type="text" 
                              placeholder="Search by Order #..." 
                              value={orderSearchQuery}
                              onChange={(e) => setOrderSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all shadow-sm hover:border-neutral-300"
                            />
                            <svg className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                          </div>
                          
                        </div>
                      </div>

                      {/* Filter Chips Premium */}
                      <div className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(filter => {
                          const filterLabel = filter === 'All' ? 'All Orders' : filter;
                          const filterValue = filter === 'All' ? 'All' : filter;
                          return (
                            <button
                              key={filterValue}
                              onClick={() => setOrderStatusFilter(filterValue)}
                              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                                orderStatusFilter === filterValue 
                                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20' 
                                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm'
                              }`}
                            >
                              {filterLabel}
                            </button>
                          );
                        })}
                      </div>

                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                          <div className="w-10 h-10 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin"></div>
                        </div>
                      ) : (
                        <div className="mt-8 space-y-5">
                          {(() => {
                            // Apply filters
                            const filteredOrders = orders.filter(o => {
                              const matchesSearch = o.OrderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase());
                              const matchesFilter = orderStatusFilter === 'All' || o.OrderStatusName.toLowerCase().includes(orderStatusFilter.toLowerCase());
                              return matchesSearch && matchesFilter;
                            });

                            if (filteredOrders.length === 0) {
                              return (
                                <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-12 flex flex-col items-center justify-center text-center">
                                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-5 border border-neutral-100">
                                    <ShoppingBag className="w-10 h-10 text-neutral-300" />
                                  </div>
                                  <p className="text-neutral-900 font-serif text-xl mb-2">No orders found</p>
                                  <p className="text-neutral-500 font-medium">We couldn't find any orders matching your current filters.</p>
                                </div>
                              );
                            }

                            return filteredOrders.map(order => (
                              <div key={order.Id} className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[var(--color-primary)]/20 transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center justify-between group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
                                  {/* Thumbnail Preview */}
                                  <div className="w-20 h-20 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-200 shadow-inner overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                                    {(() => {
                                      const firstItem = orderItems.find(i => i.OrderId === order.Id);
                                      if (firstItem && firstItem.ImagePath && typeof firstItem.ImagePath === 'string' && firstItem.ImagePath.trim() !== '') {
                                        return (
                                          <img 
                                            src={`https://localhost:7103${firstItem.ImagePath}`} 
                                            alt="Product" 
                                            className="w-full h-full object-cover absolute inset-0" 
                                            onError={(e) => { 
                                              e.currentTarget.style.display = 'none'; 
                                              if(e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.classList.remove('hidden'); 
                                            }} 
                                          />
                                        );
                                      }
                                      return null;
                                    })()}
                                    <ShoppingBag className={`w-8 h-8 text-neutral-300 relative z-10 ${orderItems.find(i => i.OrderId === order.Id)?.ImagePath ? 'hidden' : ''}`} />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
                                  </div>
                                  
                                  <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                      <h3 className="font-bold text-neutral-900 text-lg group-hover:text-[var(--color-primary)] transition-colors">#{safeRender(order.OrderNumber)}</h3>
                                      <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:block"></span>
                                      <p className="text-neutral-500 text-sm font-medium flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(safeRender(order.OrderDate)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm border ${
                                        ['Cancelled', 'Returned', 'Refunded', 'Cancel'].some(s => safeRender(order.OrderStatusName).includes(s))
                                          ? 'bg-red-50 text-red-600 border-red-100'
                                          : 'bg-[var(--color-cream)] text-[var(--color-primary)] border-[var(--color-primary)]/10'
                                      }`}>
                                        {safeRender(order.OrderStatusName)}
                                      </span>
                                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${order.PaymentStatusName === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                        {safeRender(order.PaymentStatusName)}
                                      </span>
                                      <span className="px-3 py-1 bg-neutral-50 text-neutral-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-neutral-200 flex items-center gap-1.5">
                                        <Award className="w-3.5 h-3.5" />
                                        {safeRender(order.PaymentModeName)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t border-neutral-100 md:border-t-0 md:border-l pt-5 md:pt-0 md:pl-6 shrink-0 min-w-[140px]">
                                  <div className="text-left md:text-right">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="font-bold text-2xl text-neutral-900 tracking-tight">₹{safeRender(order.GrandTotal)}</p>
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                    className="px-6 py-2.5 bg-white border-2 border-neutral-200 text-neutral-700 hover:text-white hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]"
                                  >
                                    View Details
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>

                              </div>
                            ));
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Placeholder Content for other tabs */}
              {activeTab !== 'profile' && activeTab !== 'addresses' && activeTab !== 'orders' && (
                <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-12 text-center">
                  <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 text-neutral-300">
                    {(() => {
                      const Icon = navItems.find(item => item.id === activeTab)?.icon;
                      return Icon ? <Icon className="w-10 h-10" /> : null;
                    })()}
                  </div>
                  <h3 className="text-2xl font-serif text-neutral-900 mb-3 tracking-tight">
                    {navItems.find(item => item.id === activeTab)?.label}
                  </h3>
                  <p className="text-neutral-500 font-satoshi max-w-sm">
                    This section is currently under development. Check back later for updates!
                  </p>
                  <button onClick={() => setActiveTab('profile')} className="mt-8 px-6 py-2.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                    Back to Profile
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Address Form Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              <div className="flex justify-between items-center p-6 sm:p-8 border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="font-serif text-2xl text-neutral-900 tracking-tight">
                  {addressForm.Id ? 'Edit' : 'Add'} {addressFormMode === 'HOME' ? 'Home' : 'Shipping'} Address
                </h3>
                <button onClick={() => setIsAddressModalOpen(false)} className="p-2 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-colors shadow-sm">
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
              <div className="p-6 sm:p-8 overflow-y-auto">
                <form onSubmit={handleSaveAddress} className="space-y-5">
                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Address Line 1*</label>
                    <input required type="text" placeholder="Street address, house number" value={safeRender(addressForm.AddressLine1)} onChange={(e) => setAddressForm({...addressForm, AddressLine1: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                  </div>
                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Address Line 2</label>
                    <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" value={safeRender(addressForm.AddressLine2)} onChange={(e) => setAddressForm({...addressForm, AddressLine2: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                  </div>
                  {/* Grid for City & Postal Code */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">City*</label>
                      <input required type="text" value={safeRender(addressForm.City)} onChange={(e) => setAddressForm({...addressForm, City: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Postal Code*</label>
                      <input required type="text" value={safeRender(addressForm.PostalCode)} onChange={(e) => setAddressForm({...addressForm, PostalCode: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                  </div>
                  {/* Grid for Country & State */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Country*</label>
                      <select required value={addressForm.CountryId || 0} onChange={(e) => setAddressForm({...addressForm, CountryId: Number(e.target.value)})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium">
                        <option value={0} disabled>Select Country</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">State*</label>
                      <select required value={addressForm.StateId || 0} onChange={(e) => setAddressForm({...addressForm, StateId: Number(e.target.value)})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium disabled:opacity-50" disabled={!addressForm.CountryId}>
                        <option value={0} disabled>Select State</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Grid for Mobile & Alt Mobile */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Mobile No*</label>
                      <input required type="text" value={safeRender(addressForm.MobileNo)} onChange={(e) => setAddressForm({...addressForm, MobileNo: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Alt Mobile No</label>
                      <input type="text" value={safeRender(addressForm.AlternativeMobileNo)} onChange={(e) => setAddressForm({...addressForm, AlternativeMobileNo: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-neutral-100 mt-8">
                    <button disabled={isSavingAddress} type="submit" className="w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition-all py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[var(--color-primary)]/20 disabled:opacity-70">
                      {isSavingAddress ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                      {isSavingAddress ? 'Saving Address...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cancel Order Modal */}
      <AnimatePresence>
        {cancelingOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
            >
              <div className="flex justify-between items-center p-6 sm:p-8 border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="font-serif text-2xl text-neutral-900 tracking-tight text-red-600">
                  Cancel Order
                </h3>
                <button onClick={() => setCancelingOrder(null)} className="p-2 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-full transition-colors shadow-sm">
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-neutral-50/30">
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 mb-6">
                  <h4 className="font-bold text-neutral-900 mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {orderItems.filter(i => i.OrderId === cancelingOrder.Id).map(item => (
                      <div key={item.Id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {item.ImagePath && typeof item.ImagePath === 'string' && item.ImagePath.trim() !== '' ? (
                            <img src={`https://localhost:7103${item.ImagePath}`} alt={safeRender(item.ProductName)} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; if(e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.classList.remove('hidden'); }} />
                          ) : null}
                          <ShoppingBag className={`w-6 h-6 text-neutral-300 ${item.ImagePath && typeof item.ImagePath === 'string' && item.ImagePath.trim() !== '' ? 'hidden' : ''}`} />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-sm">{safeRender(item.ProductName)}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Qty: {safeRender(item.Quantity)} • ₹{safeRender(item.TotalPrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6">
                  <h4 className="font-bold text-neutral-900 mb-4">Why are you canceling this order?</h4>
                  <div className="space-y-3">
                    {[
                      "I have changed my mind",
                      "Expected delivery time is very long",
                      "I want to change address for the order",
                      "I want to convert my order to Prepaid",
                      "Price for the product has decreased",
                      "I have purchased the product elsewhere"
                    ].map(reason => (
                      <label key={reason} onClick={() => setCancelReason(reason)} className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl border border-neutral-100 hover:border-[var(--color-primary)]/30 hover:bg-neutral-50 transition-colors">
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${cancelReason === reason ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-neutral-300'}`}>
                          {cancelReason === reason && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <span className={`text-sm font-medium ${cancelReason === reason ? 'text-neutral-900' : 'text-neutral-600'}`}>{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-neutral-100 bg-white flex justify-end gap-4">
                <button 
                  onClick={() => setCancelingOrder(null)} 
                  className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-all text-sm"
                  disabled={isSubmittingCancel}
                >
                  Keep Order
                </button>
                <button 
                  onClick={handleCancelOrder} 
                  className="px-8 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md shadow-red-600/20 hover:bg-red-700 transition-all text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmittingCancel}
                >
                  {isSubmittingCancel ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Canceling...</>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
