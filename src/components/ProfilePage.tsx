import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Shield, ArrowLeft, ShoppingBag, LogOut, Edit2, Save, X, MapPin, Gift, Ticket, Award, ChevronRight, Plus, Truck, CheckCircle2, Calendar, Sparkles, Copy, Users, Bell, Check, RefreshCw, Clock, CheckSquare, Trash2, Eye, EyeOff } from "lucide-react";
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
  RewardCoins?: number;
  ReferralCode?: string;
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

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return ['profile', 'orders', 'addresses', 'rewards', 'notifications', 'password'].includes(hash) ? hash : 'profile';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['profile', 'orders', 'addresses', 'rewards', 'notifications', 'password'].includes(hash)) {
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
  const [countries, setCountries] = useState<{ id: number, name: string }[]>([]);
  const [states, setStates] = useState<{ id: number, name: string }[]>([]);
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
  const [orderDetailsTab, setOrderDetailsTab] = useState<'ITEMS' | 'SHIPPING' | 'SUMMARY'>('ITEMS');

  // Reward states
  const [rewardSettings, setRewardSettings] = useState<any>(null);
  const [rewardLedger, setRewardLedger] = useState<any[]>([]);
  const [isRewardsLoading, setIsRewardsLoading] = useState(false);
  const [rewardEntryTypeFilter, setRewardEntryTypeFilter] = useState<'' | 'CREDIT' | 'DEBIT'>('');

  // Notifications states
  const [notificationsPageData, setNotificationsPageData] = useState<any[]>([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isLoadingMoreNotifications, setIsLoadingMoreNotifications] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  const fetchNotificationsPage = async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMoreNotifications(true);
    } else {
      setIsNotificationsLoading(true);
    }
    try {
      const start = isLoadMore ? notificationsPageData.length : 0;
      const res: any = await post('/Notification/GetAll', {
        search: "",
        start: start,
        length: 10,
        sortColumnIndex: 0,
        sortDirection: ""
      });
      if (res && res.data) {
        const newNotifs = res.data.table2 || [];
        const total = res.data.table1?.[0]?.TotalRecords || 0;

        if (isLoadMore) {
          setNotificationsPageData(prev => [...prev, ...newNotifs]);
        } else {
          setNotificationsPageData(newNotifs);
        }
        setTotalNotifications(total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsNotificationsLoading(false);
      setIsLoadingMoreNotifications(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotificationsPage();
    }
    const handleUpdate = () => {
      if (activeTab === 'notifications') fetchNotificationsPage();
    };
    window.addEventListener('notificationsUpdated', handleUpdate);
    return () => window.removeEventListener('notificationsUpdated', handleUpdate);
  }, [activeTab]);

  const handleReadNotificationPage = async (id: number) => {
    try {
      await post(`/Notification/Read?id=${id}`, {});
      // Optimistically update
      setNotificationsPageData(prev => prev.map(n => n.Id === id ? { ...n, IsRead: true } : n));
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (err) { }
  };

  const handleReadAllPage = async () => {
    try {
      await post('/Notification/ReadAll', {});
      setNotificationsPageData(prev => prev.map(n => ({ ...n, IsRead: true })));
      window.dispatchEvent(new Event('notificationsUpdated'));
      showToast('success', 'All notifications marked as read');
    } catch (err) { }
  };

  const handleDeleteNotificationPage = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await post(`/Notification/Delete?id=${id}`, {});
      setNotificationsPageData(prev => prev.map(n => n.Id === id ? { ...n, IsRead: true } : n)); // Avoid UI jump, let filter handle it
      setNotificationsPageData(prev => prev.filter(n => n.Id !== id));
      setTotalNotifications(prev => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('notificationsUpdated'));
      showToast('success', 'Notification deleted');
    } catch (err) { }
  };

  const toggleNotificationSelection = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    try {
      await post('/Notification/BulkDelete', { ids: selectedNotifications.join(',') });
      setNotificationsPageData(prev => prev.filter(n => !selectedNotifications.includes(n.Id)));
      setTotalNotifications(prev => Math.max(0, prev - selectedNotifications.length));
      setSelectedNotifications([]);
      window.dispatchEvent(new Event('notificationsUpdated'));
      showToast('success', `${selectedNotifications.length} notifications deleted`);
    } catch (err) {
      console.error(err);
    }
  };

  // Helpers
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just Now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (diffInSeconds < 172800) return 'Yesterday';

    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationGroup = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateToCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dateToCompare.getTime() === today.getTime()) return 'TODAY';
    if (dateToCompare.getTime() === yesterday.getTime()) return 'YESTERDAY';

    const diffTime = Math.abs(today.getTime() - dateToCompare.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 'THIS WEEK';
    return 'OLDER';
  };

  const getNotificationStyle = (message: string) => {
    const msg = message.toLowerCase();
    if (msg.includes('order') && msg.includes('placed')) return { icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
    if (msg.includes('order') && msg.includes('shipped')) return { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' };
    if (msg.includes('order') || msg.includes('status')) return { icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' };
    if (msg.includes('reward') && msg.includes('refund')) return { icon: RefreshCw, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' };
    if (msg.includes('reward') || msg.includes('coin')) return { icon: Gift, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' };
    if (msg.includes('referral')) return { icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
    if (msg.includes('login')) return { icon: User, color: 'text-teal-500', bg: 'bg-teal-50', border: 'border-teal-100' };
    return { icon: Bell, color: 'text-neutral-500', bg: 'bg-neutral-50', border: 'border-neutral-100' };
  };

  const groupedNotifications = notificationsPageData.reduce((groups: any, notif: any) => {
    const group = getNotificationGroup(notif.CreatedDate);
    if (!groups[group]) groups[group] = [];
    groups[group].push(notif);
    return groups;
  }, {});

  const groupOrder = ['TODAY', 'YESTERDAY', 'THIS WEEK', 'OLDER'];

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

  useEffect(() => {
    if (activeTab === 'rewards') {
      fetchRewardsData();
    }
  }, [activeTab, rewardEntryTypeFilter]);

  const fetchRewardsData = async () => {
    try {
      setIsRewardsLoading(true);
      const customerId = localStorage.getItem("customerId");
      if (!customerId) return;

      // Fetch Settings
      const settingsResult: any = await get("/Reward/GetAll");
      if (settingsResult?.data && settingsResult.data.length > 0) {
        setRewardSettings(settingsResult.data[0]);
      }

      // Fetch Ledger
      const payload = {
        customerId: Number(customerId),
        entryType: rewardEntryTypeFilter,
        start: 0,
        length: 100, // Get top 100
        sortColumnIndex: 0,
        sortDirection: ""
      };
      const ledgerResult: any = await post("/Reward/CustomerGetAll", payload);
      const dataObj = getCaseInsensitiveProperty(ledgerResult, "data") || ledgerResult;

      let table2 = getCaseInsensitiveProperty<any[]>(dataObj, "table2") || [];
      if (!Array.isArray(table2) || table2.length === 0) {
        for (const key of Object.keys(dataObj)) {
          if (Array.isArray(dataObj[key]) && key.toLowerCase().includes("table2")) {
            table2 = dataObj[key];
            break;
          }
        }
      }
      setRewardLedger(table2 || []);
    } catch (err) {
      console.error("Failed to fetch rewards", err);
      showToast("error", "Failed to load rewards data");
    } finally {
      setIsRewardsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelingOrder) return;
    try {
      setIsSubmittingCancel(true);
      const payload = {
        id: cancelingOrder.Id,
        status: "12",
        reason: cancelReason
      };

      // We pass the payload in the body AND as query parameters. 
      // .NET binds primitive parameters (int id, string status) from the query string 
      // unless there is a [FromBody] wrapper class defined.
      const queryParams = new URLSearchParams({
        id: cancelingOrder.Id.toString(),
        status: "12",
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

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      const payload = {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      };
      
      const result: any = await post("/CustomerAuth/ChangePassword", payload);
      showApiResponseToast(result);
      if (result.isSuccess || result.statusCode === 1 || result.StatusCode === 1) {
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || err.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
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
        addressLine2: typeof addressForm.AddressLine2 === 'string' && addressForm.AddressLine2.trim() !== "" ? addressForm.AddressLine2 : null,
        city: addressForm.City || "",
        postalCode: addressForm.PostalCode || "",
        mobileNo: addressForm.MobileNo || "",
        alternativeMobileNo: typeof addressForm.AlternativeMobileNo === 'string' && addressForm.AlternativeMobileNo.trim() !== "" ? addressForm.AlternativeMobileNo : null,
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
    } catch (err: any) {
      showToast("error", "Failed to set default address");
    }
  };

  // Navigation Menu Items
  const navItems = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'password', label: 'Change Password', icon: Shield }
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
                      onClick={() => {
                        setActiveTab(item.id);
                        window.location.hash = item.id;
                      }}
                      className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 ${isActive
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

                      {/* Premium Welcome Hero */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2rem] p-8 sm:p-10 mb-10 shadow-2xl shadow-[var(--color-primary)]/20 text-white border border-white/10">
                        {/* Decorative glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-[80px] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-8 sm:items-center">
                          <div className="relative shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-3xl font-serif shadow-inner border border-white/20">
                              {profileData.FirstName ? profileData.FirstName[0].toUpperCase() : <User className="w-10 h-10" />}
                            </div>
                          </div>

                          <div className="flex flex-col justify-center min-w-0 w-full">
                            <p className="text-white/60 text-sm font-satoshi uppercase tracking-widest font-semibold mb-2">Welcome Back</p>
                            
                            <h2 className="text-[32px] md:text-[36px] font-serif text-white mb-5 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                              {getPrefix(profileData.Gender)}{profileData.FirstName} {profileData.LastName}
                            </h2>
                            
                            {/* Quick Stats - Below Name */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              {/* Total Orders Badge */}
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 w-max max-w-full overflow-hidden shadow-sm">
                                <span className="text-lg shrink-0">📦</span>
                                <span className="text-white/90 text-sm font-medium whitespace-nowrap shrink-0">Total Orders:</span>
                                <span className="text-white font-bold text-base truncate ml-1">{orders.length}</span>
                              </div>
                              
                              {/* Reward Coins Badge */}
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 relative overflow-hidden w-max max-w-full shadow-sm">
                                {/* Subtle Glow */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-20 h-20 bg-[#FFD54F]/20 blur-xl rounded-full"></div>
                                </div>
                                <span className="text-lg shrink-0 relative z-10">🪙</span>
                                <span className="text-white/90 text-sm font-medium whitespace-nowrap shrink-0 relative z-10">Reward Coins:</span>
                                <span className="text-[#FFD54F] font-bold text-base relative z-10 truncate ml-1">{profileData?.RewardCoins || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Header Section */}
                      <div className="flex items-center justify-between mb-8 px-2">
                        <h3 className="text-2xl font-serif text-neutral-900 tracking-tight">Personal Details</h3>
                      </div>

                      {/* Information Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* First Name */}
                        <div className="group bg-white rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-neutral-100/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-neutral-200 transition-all duration-500 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="flex items-center gap-3 mb-3 text-neutral-400">
                            <User className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors duration-300" />
                            <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">First Name</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={form.firstName}
                              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm"
                              placeholder="Enter your first name"
                            />
                          ) : (
                            <p className="text-neutral-900 font-serif text-xl tracking-tight">
                              {profileData.FirstName || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="group bg-white rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-neutral-100/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-neutral-200 transition-all duration-500 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="flex items-center gap-3 mb-3 text-neutral-400">
                            <User className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors duration-300" />
                            <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">Last Name</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={form.lastName}
                              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm"
                              placeholder="Enter your last name"
                            />
                          ) : (
                            <p className="text-neutral-900 font-serif text-xl tracking-tight">
                              {profileData.LastName || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Email Address */}
                        <div className="group bg-white rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-neutral-100/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-neutral-200 transition-all duration-500 relative overflow-hidden md:col-span-2">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="flex items-center gap-3 mb-3 text-neutral-400">
                            <Mail className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors duration-300" />
                            <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">Email Address</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm"
                              placeholder="Enter your email address"
                            />
                          ) : (
                            <p className="text-neutral-900 font-serif text-xl tracking-tight">
                              {profileData.Email || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Mobile Number */}
                        <div className="group bg-white rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-neutral-100/60 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-neutral-200 transition-all duration-500 relative overflow-hidden md:col-span-2">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="flex items-center gap-3 mb-3 text-neutral-400">
                            <Phone className="w-4 h-4 group-hover:text-[var(--color-primary)] transition-colors duration-300" />
                            <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">Mobile Number</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={form.mobileNo}
                              onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
                              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm"
                              placeholder="Enter your mobile number"
                            />
                          ) : (
                            <p className="text-neutral-900 font-serif text-xl tracking-tight">
                              {profileData.MobileNo || "Not provided"}
                            </p>
                          )}
                        </div>

                        {/* Referral Code */}
                        {profileData.ReferralCode && (
                          <div className="group bg-white rounded-[1.5rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-[var(--color-primary)]/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[var(--color-primary)]/40 transition-all duration-500 relative overflow-hidden md:col-span-2">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-100"></div>
                            <div className="flex items-center gap-3 mb-3 text-[var(--color-primary)]">
                              <Users className="w-4 h-4" />
                              <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">Your Referral Code</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <p className="text-neutral-900 font-serif text-2xl tracking-tight">
                                  {profileData.ReferralCode}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1 font-satoshi">Share this link with your friends to earn rewards when they sign up!</p>
                              </div>
                              <button
                                onClick={() => {
                                  const link = `${window.location.origin}/?ref=${profileData.ReferralCode}`;
                                  navigator.clipboard.writeText(link);
                                  showToast("success", "Referral link copied to clipboard!");
                                }}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                              >
                                <Copy className="w-4 h-4" /> Copy Referral Link
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="mt-8 flex justify-end">
                        {isEditing ? (
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none px-6 py-3 rounded-xl hover:bg-neutral-100 text-neutral-600 transition-colors font-medium text-[15px] flex items-center justify-center gap-2 border border-transparent hover:border-neutral-200">
                              <X className="w-4 h-4" /> Cancel
                            </button>
                            <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition-all shadow-lg shadow-[var(--color-primary)]/25 font-medium text-[15px] flex items-center justify-center gap-2 disabled:opacity-70">
                              {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-neutral-200/80 bg-white text-neutral-700 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all font-medium text-[15px] shadow-sm group">
                            <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="p-6 sm:p-12 space-y-12">
                  <div className="flex items-center justify-between border-b border-neutral-100/80 pb-6">
                    <h2 className="text-3xl font-serif text-neutral-900 tracking-tight">Change Password</h2>
                  </div>

                  <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-neutral-100/60 max-w-2xl">
                    <div className="grid grid-cols-1 gap-6 mb-8">
                      {/* Old Password */}
                      <div>
                        <div className="flex items-center gap-3 mb-3 text-neutral-400">
                          <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                          <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">Old Password</span>
                        </div>
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm pr-12"
                            placeholder="Enter old password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[var(--color-primary)] transition-colors"
                          >
                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* New Password */}
                      <div>
                        <div className="flex items-center gap-3 mb-3 text-neutral-400">
                          <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                          <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">New Password</span>
                        </div>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm pr-12"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[var(--color-primary)] transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Confirm Password */}
                      <div>
                        <div className="flex items-center gap-3 mb-3 text-neutral-400">
                          <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                          <span className="font-satoshi text-[10px] uppercase tracking-[0.2em] font-bold">Confirm Password</span>
                        </div>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary)]/10 text-neutral-900 font-medium transition-all text-sm pr-12"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[var(--color-primary)] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end border-t border-neutral-100/80 pt-6">
                      <button 
                        onClick={handleChangePassword} 
                        disabled={isChangingPassword} 
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition-all font-medium text-[15px] flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                      >
                        {isChangingPassword ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
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
                          <div className="group bg-white rounded-[1.5rem] p-8 border border-neutral-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-[var(--color-primary)]/20 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <span className="absolute top-6 right-6 text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1.5 rounded-full uppercase tracking-[0.15em] font-bold">HOME</span>

                            <h4 className="font-serif text-2xl text-neutral-900 mb-4 tracking-tight">{profileData?.FirstName} {profileData?.LastName}</h4>

                            <div className="space-y-1.5 mb-6">
                              <p className="text-[14px] text-neutral-600 leading-relaxed font-satoshi">
                                {safeRender(homeAddress.AddressLine1)}
                                {homeAddress.AddressLine2 && typeof homeAddress.AddressLine2 !== 'object' ? `, ${homeAddress.AddressLine2}` : ''}
                              </p>
                              <p className="text-[14px] text-neutral-600 font-satoshi">{safeRender(homeAddress.City)}, {safeRender(homeAddress.PostalCode)}</p>
                              <p className="text-[14px] text-neutral-600 font-satoshi">{safeRender(homeAddress.State)}, {safeRender(homeAddress.Country)}</p>
                            </div>

                            <p className="text-[14px] font-medium text-neutral-700 mb-6 bg-neutral-50/80 px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-neutral-100">
                              <Phone className="w-4 h-4 text-neutral-400" />
                              {safeRender(homeAddress.MobileNo)}
                            </p>

                            <div className="pt-5 border-t border-neutral-100/80 flex items-center">
                              <button onClick={() => openAddressModal('HOME', homeAddress)} className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5 uppercase tracking-wider">
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
                              <div key={addr.Id} className={`group bg-white rounded-[1.5rem] p-8 border ${addr.IsDefault ? 'border-[var(--color-primary)]/40 shadow-[0_8px_30px_rgba(91,42,134,0.08)]' : 'border-neutral-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-[var(--color-primary)]/20'} relative transition-all duration-500 overflow-hidden`}>
                                {addr.IsDefault && (
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]"></div>
                                )}

                                <div className="absolute top-6 right-6">
                                  <label className="flex items-center gap-2 cursor-pointer group/radio">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${addr.IsDefault ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-neutral-300 group-hover/radio:border-[var(--color-primary)]/50'}`}>
                                      {addr.IsDefault && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                    </div>
                                    <input
                                      type="radio"
                                      name="defaultShipping"
                                      className="sr-only"
                                      checked={addr.IsDefault}
                                      onChange={() => !addr.IsDefault && handleSetDefaultShipping(addr.Id)}
                                    />
                                    <span className={`text-[10px] uppercase tracking-[0.15em] font-bold ${addr.IsDefault ? 'text-[var(--color-primary)]' : 'text-neutral-400 group-hover/radio:text-[var(--color-primary)]/70'}`}>
                                      Default
                                    </span>
                                  </label>
                                </div>

                                <h4 className="font-serif text-2xl text-neutral-900 mb-4 tracking-tight">{profileData?.FirstName} {profileData?.LastName}</h4>

                                <div className="space-y-1.5 mb-6">
                                  <p className="text-[14px] text-neutral-600 leading-relaxed font-satoshi">
                                    {safeRender(addr.AddressLine1)}
                                    {addr.AddressLine2 && typeof addr.AddressLine2 !== 'object' ? `, ${addr.AddressLine2}` : ''}
                                  </p>
                                  <p className="text-[14px] text-neutral-600 font-satoshi">{safeRender(addr.City)}, {safeRender(addr.PostalCode)}</p>
                                  <p className="text-[14px] text-neutral-600 font-satoshi">{safeRender(addr.State)}, {safeRender(addr.Country)}</p>
                                </div>

                                <p className="text-[14px] font-medium text-neutral-700 mb-6 bg-neutral-50/80 px-4 py-2 rounded-xl inline-flex items-center gap-2 border border-neutral-100">
                                  <Phone className="w-4 h-4 text-neutral-400" />
                                  {safeRender(addr.MobileNo)}
                                </p>

                                <div className="flex items-center gap-6 pt-5 border-t border-neutral-100/80">
                                  <button onClick={() => openAddressModal('SHIPPING', addr)} className="text-xs font-semibold text-neutral-500 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                  </button>
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
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
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

                              <div className="bg-white rounded-[1.5rem] border border-neutral-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col p-8 sm:p-10 relative">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)] opacity-80"></div>

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                  <div>
                                    <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Order Summary Hero</p>
                                    <div className="flex items-center gap-3 mb-2">
                                      <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 tracking-tight">Order #{safeRender(order.OrderNumber)}</h2>
                                    </div>
                                    <p className="text-neutral-500 font-medium flex items-center gap-2 font-satoshi">
                                      <Calendar className="w-4 h-4 text-neutral-400" />
                                      Placed on {new Date(safeRender(order.OrderDate)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-6 lg:gap-10 border-t lg:border-t-0 lg:border-l border-neutral-100/80 pt-6 lg:pt-0 lg:pl-10 relative z-10">
                                    <div className="flex flex-col items-start gap-2">
                                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order Status</span>
                                      <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border ${['Cancelled', 'Returned', 'Refunded', 'Cancel'].some(s => safeRender(order.OrderStatusName).includes(s))
                                        ? 'bg-red-50 text-red-600 border-red-100'
                                        : 'bg-[var(--color-cream)] text-[var(--color-primary)] border-[var(--color-primary)]/10'
                                        }`}>
                                        {safeRender(order.OrderStatusName)}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-start gap-2">
                                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Payment Status</span>
                                      <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border ${order.PaymentStatusName === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                        {safeRender(order.PaymentStatusName)}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Total Amount</span>
                                      <span className="text-3xl font-serif tracking-tight text-neutral-900">₹{safeRender(order.FinalAmount)}</span>
                                    </div>
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
                                  className={`absolute top-5 left-[5%] h-1.5 rounded-full transition-all duration-1000 ease-in-out ${timeline.some(t => t.isErrorState) ? 'bg-red-500' : 'bg-[var(--color-primary)]'
                                    }`}
                                  style={{ width: `${timeline.length > 1 ? (activeStepIndex / (timeline.length - 1)) * 90 : 0}%` }}
                                ></div>

                                <div className="relative flex justify-between">
                                  {timeline.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center w-24 relative z-10">
                                      <div className={`w-11 h-11 rounded-full flex items-center justify-center border-[3px] bg-white transition-colors duration-500 ${step.isErrorState
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
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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

                            {/* Order Details Tabs */}
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-4 scrollbar-hide border-b border-neutral-100 mb-6">
                              <button
                                onClick={() => setOrderDetailsTab('ITEMS')}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-[14px] font-bold transition-all ${orderDetailsTab === 'ITEMS' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300'}`}
                              >
                                Item Details
                              </button>
                              <button
                                onClick={() => setOrderDetailsTab('SHIPPING')}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-[14px] font-bold transition-all ${orderDetailsTab === 'SHIPPING' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300'}`}
                              >
                                Shipping Address
                              </button>
                              <button
                                onClick={() => setOrderDetailsTab('SUMMARY')}
                                className={`whitespace-nowrap px-6 py-3 rounded-xl text-[14px] font-bold transition-all ${orderDetailsTab === 'SUMMARY' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300'}`}
                              >
                                Order Summary
                              </button>
                            </div>

                            <div className="animate-fade-in">
                              {orderDetailsTab === 'ITEMS' && (
                                <div className="space-y-6 sm:space-y-8 max-w-4xl">

                                  {/* Vertical Status Timeline */}
                                  <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/50">
                                    <h3 className="font-serif text-xl text-neutral-900 mb-6">Status History</h3>
                                    <div className="relative pl-6 border-l-2 border-neutral-100 space-y-8">
                                      {trackingSteps.map((step, idx) => {
                                        const isFirst = idx === trackingSteps.length - 1; // latest is first in array usually, or last depending on parse. Assuming chron.
                                        const isError = step.status.toLowerCase().includes('cancel') || step.status.toLowerCase().includes('return') || step.status.toLowerCase().includes('refund');
                                        return (
                                          <div key={idx} className="relative">
                                            <div className={`absolute -left-[35px] w-4 h-4 rounded-full border-4 border-white shadow-sm ${isFirst
                                              ? (isError ? 'bg-red-500' : 'bg-[var(--color-primary)]')
                                              : 'bg-neutral-300'
                                              }`}></div>
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 -mt-1.5">
                                              <div>
                                                <p className={`font-bold text-sm ${isFirst ? 'text-neutral-900' : 'text-neutral-500'}`}>{step.status}</p>
                                                {step.date && <p className="text-xs text-neutral-400 font-medium mt-1">{step.date}</p>}
                                              </div>
                                              {isFirst && (
                                                <span className="px-3 py-1 bg-neutral-50 text-neutral-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-neutral-200">
                                                  Latest Update
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Product List */}
                                  <div className="space-y-4">
                                    <h3 className="font-serif text-xl text-neutral-900 px-2">Items Ordered ({items.length})</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                      {items.map(item => (
                                        <div key={item.Id} className="group bg-white rounded-[1.5rem] p-5 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-neutral-100/60 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-neutral-200 transition-all duration-300">
                                          <div className="w-24 h-24 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
                                            {item.ImagePath && typeof item.ImagePath === 'string' && item.ImagePath.trim() !== '' ? (
                                              <img
                                                src={`https://hridhayconnectreact.bsite.net${item.ImagePath}`}
                                                alt={safeRender(item.ProductName)}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = 'none';
                                                  if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.classList.remove('hidden');
                                                }}
                                              />
                                            ) : null}
                                            <ShoppingBag className={`w-8 h-8 text-neutral-300 ${item.ImagePath && typeof item.ImagePath === 'string' && item.ImagePath.trim() !== '' ? 'hidden' : ''}`} />
                                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md rounded-lg px-2 py-0.5 shadow-sm border border-black/5 flex items-center justify-center">
                                              <span className="text-[10px] font-bold text-neutral-900">x{safeRender(item.Quantity)}</span>
                                            </div>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-serif text-xl text-neutral-900 truncate group-hover:text-[var(--color-primary)] transition-colors">{safeRender(item.ProductName)}</p>
                                            {item.VariantName && typeof item.VariantName === 'string' && item.VariantName.trim() !== '' && (
                                              <p className="text-[14px] text-neutral-500 mt-1 font-satoshi">{item.VariantName}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-3">
                                              <p className="text-[14px] font-medium text-neutral-500 font-satoshi">Unit Price: ₹{safeRender(item.UnitPrice)}</p>
                                            </div>
                                          </div>
                                          <div className="sm:text-right mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100/80 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Item Total</p>
                                            <p className="font-serif text-2xl text-neutral-900 tracking-tight">₹{safeRender(item.TotalPrice)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                </div>
                              )}

                              {orderDetailsTab === 'SHIPPING' && (
                                <div className="max-w-2xl">
                                  {/* Shipping Address */}
                                  <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/60 h-fit relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-primary)]/40"></div>
                                    <div className="flex items-center gap-4 mb-6">
                                      <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center border border-[var(--color-primary)]/10">
                                        <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                                      </div>
                                      <h3 className="font-serif text-2xl text-neutral-900 tracking-tight">Shipping Address</h3>
                                    </div>
                                    <div className="space-y-5">
                                      <div>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1.5">Deliver To</p>
                                        <p className="font-serif text-xl text-neutral-900">{profileData?.FirstName} {profileData?.LastName}</p>
                                        <p className="text-[14px] font-medium text-neutral-600 flex items-center gap-1.5 mt-2 font-satoshi">
                                          <Phone className="w-4 h-4 text-neutral-400" /> {safeRender(order.MobileNo)}
                                          {order.AlternativeMobileNo && typeof order.AlternativeMobileNo === 'string' && <span className="text-neutral-300">|</span>}
                                          {order.AlternativeMobileNo && typeof order.AlternativeMobileNo === 'string' && order.AlternativeMobileNo}
                                        </p>
                                      </div>
                                      <div className="w-full h-px bg-neutral-100/80"></div>
                                      <div>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">Address Details</p>
                                        <div className="space-y-1">
                                          <p className="text-[15px] text-neutral-700 leading-relaxed font-satoshi">{safeRender(order.AddressLine1)}</p>
                                          {order.AddressLine2 && typeof order.AddressLine2 === 'string' && (
                                            <p className="text-[15px] text-neutral-700 leading-relaxed font-satoshi">{order.AddressLine2}</p>
                                          )}
                                          <p className="text-[15px] text-neutral-700 leading-relaxed font-satoshi">{safeRender(order.City)} - {safeRender(order.PostalCode)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {orderDetailsTab === 'SUMMARY' && (
                                <div className="max-w-md">
                                  <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/60 h-fit">
                                    <h3 className="font-serif text-2xl text-neutral-900 mb-8 tracking-tight">Order Summary</h3>

                                    <div className="space-y-5 mb-8">
                                      <div className="flex justify-between items-center text-[15px] font-medium text-neutral-600 font-satoshi">
                                        <span>Subtotal ({items.length} items)</span>
                                        <span>₹{safeRender(order.TotalAmount)}</span>
                                      </div>

                                      {order.DeliveryFee > 0 ? (
                                        <div className="flex justify-between items-center text-[15px] font-medium text-neutral-600 font-satoshi">
                                          <span>Delivery Fee</span>
                                          <span>+₹{safeRender(order.DeliveryFee)}</span>
                                        </div>
                                      ) : (
                                        <div className="flex justify-between items-center text-[15px] font-medium text-green-600 font-satoshi">
                                          <span>Delivery Fee</span>
                                          <span className="uppercase text-xs font-bold tracking-wider">Free</span>
                                        </div>
                                      )}

                                      {order.DiscountAmount > 0 && (
                                        <div className="flex justify-between items-center text-[15px] font-medium text-green-600 bg-green-50/50 p-3 rounded-xl border border-green-100/50 font-satoshi">
                                          <span>Offer Discount</span>
                                          <span className="font-bold">-₹{safeRender(order.DiscountAmount)}</span>
                                        </div>
                                      )}

                                      {order.CoinDiscountAmount > 0 && (
                                        <div className="flex justify-between items-center text-[15px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/5 p-3 rounded-xl border border-[var(--color-primary)]/10 font-satoshi">
                                          <span>Coins Used ({safeRender(order.UsedCoins)})</span>
                                          <span className="font-bold">-₹{safeRender(order.CoinDiscountAmount)}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="pt-6 border-t border-neutral-100/80 border-dashed relative">
                                      <div className="absolute -top-3 -left-10 w-6 h-6 bg-neutral-50 rounded-full border-r border-neutral-100/80"></div>
                                      <div className="absolute -top-3 -right-10 w-6 h-6 bg-neutral-50 rounded-full border-l border-neutral-100/80"></div>

                                      <div className="flex justify-between items-end mb-4">
                                        <span className="text-[15px] font-bold text-neutral-900 font-satoshi">Total Amount</span>
                                        <span className="font-serif text-4xl text-neutral-900 tracking-tight">₹{safeRender(order.FinalAmount)}</span>
                                      </div>

                                      <div className="flex items-center justify-between mt-6 bg-neutral-50/80 px-5 py-4 rounded-xl border border-neutral-100/80">
                                        <div className="flex items-center gap-3">
                                          <Award className="w-5 h-5 text-neutral-400" />
                                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Payment Mode</span>
                                        </div>
                                        <span className="text-[14px] font-bold text-neutral-900">{safeRender(order.PaymentModeName)}</span>
                                      </div>
                                    </div>

                                    <button onClick={() => { /* Need Help Logic */ }} className="w-full mt-6 py-4 bg-white border border-neutral-200/80 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all text-[14px] shadow-sm flex items-center justify-center gap-2 group">
                                      Need Help?
                                    </button>
                                  </div>
                                </div>
                              )}
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
                            <svg className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
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
                              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${orderStatusFilter === filterValue
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
                        <div className="mt-8">
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

                            return (
                              <div className="bg-white rounded-[1.5rem] border border-neutral-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                      <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Order #</th>
                                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Date Purchased</th>
                                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Total</th>
                                        <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100/80">
                                      {filteredOrders.map(order => (
                                        <tr key={order.Id} className="group hover:bg-neutral-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                          <td className="px-6 py-5 align-middle">
                                            <div>
                                              <p className="font-serif text-lg text-neutral-900 group-hover:text-[var(--color-primary)] transition-colors tracking-tight">#{safeRender(order.OrderNumber)}</p>
                                              <p className="text-xs font-medium text-neutral-500 mt-1 flex items-center gap-1">
                                                <Award className="w-3 h-3" />
                                                {safeRender(order.PaymentModeName)}
                                              </p>
                                            </div>
                                          </td>
                                          <td className="px-6 py-5 align-middle">
                                            <p className="text-[14px] font-medium text-neutral-600 font-satoshi flex items-center gap-2">
                                              <Calendar className="w-4 h-4 text-neutral-400" />
                                              {new Date(safeRender(order.OrderDate)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                          </td>
                                          <td className="px-6 py-5 align-middle space-y-2">
                                            <div>
                                              <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] rounded-full shadow-sm border ${['Cancelled', 'Returned', 'Refunded', 'Cancel'].some(s => safeRender(order.OrderStatusName).includes(s))
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : 'bg-[var(--color-cream)] text-[var(--color-primary)] border-[var(--color-primary)]/10'
                                                }`}>
                                                {safeRender(order.OrderStatusName)}
                                              </span>
                                            </div>
                                            {order.PaymentStatusName && (
                                              <div>
                                                <span className={`inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] rounded-full border ${order.PaymentStatusName === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                  {safeRender(order.PaymentStatusName)}
                                                </span>
                                              </div>
                                            )}
                                          </td>
                                          <td className="px-6 py-5 align-middle">
                                            <p className="font-serif text-xl text-neutral-900 tracking-tight">₹{safeRender(order.FinalAmount)}</p>
                                          </td>
                                          <td className="px-6 py-5 align-middle text-right">
                                            <button
                                              onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                              className="inline-flex px-5 py-2.5 bg-white border border-neutral-200/80 text-neutral-700 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30 rounded-full text-[13px] font-bold transition-all shadow-sm items-center justify-center gap-2 group/btn"
                                            >
                                              View
                                              <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div className="p-4 sm:p-8 lg:p-12 space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between pb-2">
                    <h2 className="text-3xl font-serif text-neutral-900 tracking-tight">My Rewards</h2>
                  </div>

                  {isRewardsLoading && !rewardSettings ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                      <div className="w-10 h-10 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {/* Hero Section */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-[var(--color-primary)]/20 text-white border border-white/10">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-[80px] opacity-20 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                          <div>
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                              <Gift className="w-3.5 h-3.5" /> Total Coin Balance
                            </p>
                            <div className="flex items-end gap-3">
                              <h2 className="text-5xl sm:text-6xl font-serif text-white tracking-tight flex items-center gap-2">
                                {profileData?.RewardCoins || 0}
                                <span className="text-amber-400">🪙</span>
                              </h2>
                            </div>
                            {rewardSettings && rewardSettings.CoinToRupeeRate && (
                              <p className="text-white/90 font-medium mt-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full inline-block border border-white/10 text-sm">
                                Equivalent to <strong className="text-amber-300">₹{((profileData?.RewardCoins || 0) / rewardSettings.CoinToRupeeRate).toFixed(2)}</strong>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* How It Works */}
                      {rewardSettings && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-1">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-serif text-neutral-900">{rewardSettings.SignupCoins} 🪙</span>
                            <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">On Signup</span>
                          </div>
                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-1">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-serif text-neutral-900">{rewardSettings.LoginCoins} 🪙</span>
                            <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Daily Login</span>
                          </div>
                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-1">
                              <Gift className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-serif text-neutral-900">{rewardSettings.ReferralCoins} 🪙</span>
                            <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Per Referral</span>
                          </div>
                          <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-1">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-serif text-neutral-900">Up to {rewardSettings.MaxCoinUsagePercent}%</span>
                            <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Usage per Order</span>
                          </div>
                        </div>
                      )}

                      {/* Referral Code Share in Rewards Tab */}
                      {profileData?.ReferralCode && (
                        <div className="group bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-primary)]/20 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-[var(--color-primary)]/40 transition-all duration-500 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-accent)] opacity-100"></div>
                          <div className="flex items-center gap-3 mb-4 text-[var(--color-primary)]">
                            <Users className="w-5 h-5" />
                            <span className="font-satoshi text-[11px] uppercase tracking-[0.2em] font-bold">Refer & Earn</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                              <p className="text-neutral-900 font-serif text-3xl tracking-tight">
                                {profileData.ReferralCode}
                              </p>
                              <p className="text-sm text-neutral-500 mt-2 font-satoshi">Share this link with your friends to earn <strong className="text-[var(--color-primary)]">{rewardSettings?.ReferralCoins || 0} 🪙</strong> when they sign up!</p>
                            </div>
                            <button
                              onClick={() => {
                                const link = `${window.location.origin}/?ref=${profileData.ReferralCode}`;
                                navigator.clipboard.writeText(link);
                                showToast("success", "Referral link copied to clipboard!");
                              }}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] shadow-lg shadow-[var(--color-primary)]/20 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                            >
                              <Copy className="w-4 h-4" /> Copy Referral Link
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Ledger History Passbook */}
                      <div className="bg-white rounded-[1.5rem] border border-neutral-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-neutral-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/30">
                          <h3 className="text-xl font-serif text-neutral-900 tracking-tight">Transaction History</h3>
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
                            {[
                              { label: 'ALL', value: '' },
                              { label: 'EARNED', value: 'CREDIT' },
                              { label: 'USED', value: 'DEBIT' }
                            ].map(tab => (
                              <button
                                key={tab.label}
                                onClick={() => setRewardEntryTypeFilter(tab.value as any)}
                                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${rewardEntryTypeFilter === tab.value
                                    ? 'bg-neutral-900 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
                                    : 'bg-white text-neutral-500 border border-neutral-200 hover:text-neutral-900 hover:border-neutral-300 shadow-sm'
                                  }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {isRewardsLoading ? (
                          <div className="p-16 flex justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin"></div>
                          </div>
                        ) : rewardLedger.length === 0 ? (
                          <div className="p-16 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-100/50 shadow-inner">
                              <Gift className="w-10 h-10 text-amber-400" />
                            </div>
                            <h4 className="text-2xl font-serif text-neutral-900 mb-2">No Transactions Found</h4>
                            <p className="text-neutral-500 font-satoshi text-sm max-w-sm">Your reward wallet history will appear here once you start earning or spending coins.</p>
                          </div>
                        ) : (
                          <div className="divide-y-[3px] divide-neutral-900 md:divide-y md:divide-neutral-100/80 bg-neutral-50/20">
                            {rewardLedger.map((entry, idx) => {
                              const isCredit = entry.EntryType === 'CREDIT' || entry.Coins > 0;

                              // Format Date
                              const dateObj = new Date(entry.CreatedDate);
                              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
                              const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                              // Badge Style
                              let badgeStyle = "bg-neutral-100 text-neutral-600";
                              const typeStr = (entry.TransactionType || entry.EntryType || '').toUpperCase();
                              if (typeStr.includes('LOGIN')) badgeStyle = "bg-purple-50 text-purple-600 border border-purple-100 shadow-[0_2px_8px_rgba(168,85,247,0.1)]";
                              else if (typeStr.includes('SIGNUP')) badgeStyle = "bg-blue-50 text-blue-600 border border-blue-100 shadow-[0_2px_8px_rgba(59,130,246,0.1)]";
                              else if (typeStr.includes('REFERRAL')) badgeStyle = "bg-orange-50 text-orange-600 border border-orange-100 shadow-[0_2px_8px_rgba(249,115,22,0.1)]";
                              else if (typeStr.includes('RETURN') || typeStr.includes('ADMIN')) badgeStyle = "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.1)]";
                              else if (typeStr.includes('USED') || typeStr.includes('DEBIT')) badgeStyle = "bg-red-50 text-red-600 border border-red-100 shadow-[0_2px_8px_rgba(239,68,68,0.1)]";
                              else if (typeStr.includes('EARNED') || typeStr.includes('CREDIT')) badgeStyle = "bg-green-50 text-green-600 border border-green-100 shadow-[0_2px_8px_rgba(34,197,94,0.1)]";

                              return (
                                <div key={idx} className="p-5 sm:p-6 bg-white hover:bg-neutral-50/80 hover:shadow-[inset_4px_0_0_var(--color-primary)] transition-all duration-300 group">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6">

                                    {/* DATE & TIME - Column 1 */}
                                    <div className="w-full md:w-32 flex-shrink-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start text-xs font-bold text-neutral-400 tracking-widest border-b md:border-b-0 border-neutral-100 pb-3 md:pb-0 mb-1 md:mb-0">
                                      <span className="text-neutral-600 uppercase">{formattedDate}</span>
                                      <span className="mt-1 md:mt-1.5">{formattedTime}</span>
                                    </div>

                                    {/* CENTER: Badge & Description - Column 2 & 3 */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] rounded-md ${badgeStyle}`}>
                                          {typeStr.replace(/_/g, ' ')}
                                        </span>
                                      </div>
                                      <h4 className="text-[15px] sm:text-base font-bold text-neutral-900 tracking-tight leading-snug">
                                        {entry.DisplayText}
                                      </h4>
                                      {entry.OrderNumber && (
                                        <p className="text-xs text-neutral-500 mt-1.5 font-satoshi flex items-center gap-1.5 bg-neutral-50 inline-flex px-2 py-1 rounded-md border border-neutral-100">
                                          <ShoppingBag className="w-3.5 h-3.5" />
                                          Order {entry.OrderNumber}
                                        </p>
                                      )}
                                    </div>

                                    {/* Divider for Desktop */}
                                    <div className="hidden md:block w-px h-14 bg-gradient-to-b from-transparent via-neutral-200 to-transparent mx-2 opacity-50"></div>

                                    {/* Divider for Mobile */}
                                    <div className="md:hidden w-full h-px bg-neutral-100 my-2"></div>

                                    {/* COINS & BALANCE - Column 4 */}
                                    <div className="w-full md:w-48 flex-shrink-0 flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-2">
                                      <div className={`text-xl sm:text-3xl font-serif tracking-tight flex items-center gap-2 drop-shadow-sm ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                        {isCredit ? '+' : ''}{entry.Coins} <span className="text-amber-400 text-lg sm:text-2xl filter drop-shadow-sm">🪙</span>
                                      </div>
                                      <div className="text-xs font-bold text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100 flex items-center gap-1.5 shadow-inner">
                                        Balance: <span className="text-neutral-900">{entry.RemainingBalance ?? 0}</span> 🪙
                                      </div>
                                    </div>

                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-4 sm:p-8 lg:p-12 space-y-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div>
                      <h2 className="text-3xl font-serif text-neutral-900 tracking-tight">Notifications</h2>
                      <p className="text-sm font-medium text-neutral-500 mt-1 flex items-center gap-2">
                        {totalNotifications} total notifications
                        {notificationsPageData.some((n: any) => !n.IsRead) && (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            Unread Messages
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Action Toolbar */}
                    {notificationsPageData.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedNotifications.length > 0 ? (
                          <>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded-xl text-sm font-bold shadow-sm">
                              <Trash2 className="w-4 h-4" /> Delete ({selectedNotifications.length})
                            </button>
                            <button onClick={() => setSelectedNotifications([])} className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors rounded-xl text-sm font-bold shadow-sm">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => fetchNotificationsPage(false)} className="p-2 text-neutral-400 hover:text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all shadow-sm">
                              <RefreshCw className={`w-4 h-4 ${isNotificationsLoading ? 'animate-spin text-[var(--color-primary)]' : ''}`} />
                            </button>
                            {notificationsPageData.some((n: any) => !n.IsRead) && (
                              <button onClick={handleReadAllPage} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors rounded-xl text-sm font-bold shadow-sm">
                                <CheckCircle2 className="w-4 h-4" /> Mark all read
                              </button>
                            )}
                            <button onClick={() => {
                              if (selectedNotifications.length === notificationsPageData.length) setSelectedNotifications([]);
                              else setSelectedNotifications(notificationsPageData.map(n => n.Id));
                            }} className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors rounded-xl text-sm font-bold shadow-sm">
                              <CheckSquare className="w-4 h-4" /> Select All
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {isNotificationsLoading && notificationsPageData.length === 0 ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[1.5rem] border border-neutral-100/60 p-6 flex gap-4 animate-pulse">
                          <div className="w-12 h-12 rounded-full bg-neutral-100 flex-shrink-0"></div>
                          <div className="flex-1 space-y-3 py-1">
                            <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-100 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notificationsPageData.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-12 sm:p-20 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-8">
                        <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 rounded-full flex items-center justify-center">
                          <Bell className="w-16 h-16 text-[var(--color-primary)]/20" />
                        </div>
                        <div className="absolute top-0 right-0 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center animate-bounce">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-serif text-neutral-900 mb-3 tracking-tight">No Notifications Yet</h3>
                      <p className="text-neutral-500 font-medium max-w-md mx-auto">
                        When you get orders, rewards, or special offers, they'll show up here. You're all caught up for now!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-fade-in">
                      {groupOrder.map(group => {
                        const notifsInGroup = groupedNotifications[group];
                        if (!notifsInGroup || notifsInGroup.length === 0) return null;

                        return (
                          <div key={group} className="space-y-4">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-2">
                              {group}
                            </h3>
                            <div className="space-y-3">
                              {notifsInGroup.map((notif: any) => {
                                const isSelected = selectedNotifications.includes(notif.Id);
                                const style = getNotificationStyle(notif.Message);
                                const Icon = style.icon;

                                return (
                                  <div
                                    key={notif.Id}
                                    onClick={() => !notif.IsRead && handleReadNotificationPage(notif.Id)}
                                    className={`relative p-5 sm:p-6 rounded-[1.5rem] transition-all duration-300 border flex gap-4 group cursor-pointer
                                      ${isSelected ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/30 ring-1 ring-[var(--color-primary)]/30' :
                                        notif.IsRead ? 'bg-neutral-50/50 border-neutral-100/60 hover:bg-white hover:border-neutral-200 hover:shadow-md' :
                                          'bg-white border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)]'
                                      }
                                    `}
                                  >
                                    {/* Unread Left Border Indicator */}
                                    {!notif.IsRead && (
                                      <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]"></div>
                                    )}

                                    {/* Multi-Select Checkbox */}
                                    <div className="pt-1.5 flex-shrink-0" onClick={(e) => toggleNotificationSelection(notif.Id, e)}>
                                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-neutral-300 bg-white group-hover:border-[var(--color-primary)]/50'}`}>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                      </div>
                                    </div>

                                    {/* Icon */}
                                    <div className="pt-0.5 flex-shrink-0">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 duration-300 ${notif.IsRead ? 'bg-white border-neutral-200 text-neutral-400' : `${style.bg} ${style.border} ${style.color} shadow-inner`}`}>
                                        <Icon className="w-6 h-6" />
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex-1">
                                        <p className={`text-[15px] leading-relaxed mb-2 ${notif.IsRead ? 'text-neutral-600 font-medium' : 'text-neutral-900 font-bold tracking-tight'}`}>
                                          {notif.Message}
                                        </p>
                                        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                                          <span className="flex items-center gap-1.5 text-neutral-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {getRelativeTime(notif.CreatedDate)}
                                          </span>
                                          {notif.IsRead && (
                                            <span className="text-neutral-300 flex items-center gap-1">
                                              <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                                              Read
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Quick Actions (Hover) */}
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 flex-shrink-0">
                                        <button
                                          onClick={(e) => handleDeleteNotificationPage(notif.Id, e)}
                                          className="p-2.5 bg-white border border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {/* Progressive Loading / View More */}
                      {notificationsPageData.length < totalNotifications && (
                        <div className="pt-6 pb-4 flex flex-col items-center justify-center border-t border-neutral-100">
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                            Showing {notificationsPageData.length} of {totalNotifications} Notifications
                          </p>
                          <button
                            onClick={() => fetchNotificationsPage(true)}
                            disabled={isLoadingMoreNotifications}
                            className="px-8 py-3 bg-white border-2 border-neutral-200 text-neutral-700 font-bold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isLoadingMoreNotifications ? (
                              <>
                                <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                              </>
                            ) : (
                              'View More'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Placeholder Content for other tabs */}
              {activeTab !== 'profile' && activeTab !== 'addresses' && activeTab !== 'orders' && activeTab !== 'rewards' && activeTab !== 'notifications' && (
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
                    <input required type="text" placeholder="Street address, house number" value={safeRender(addressForm.AddressLine1)} onChange={(e) => setAddressForm({ ...addressForm, AddressLine1: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                  </div>
                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Address Line 2</label>
                    <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" value={safeRender(addressForm.AddressLine2)} onChange={(e) => setAddressForm({ ...addressForm, AddressLine2: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                  </div>
                  {/* Grid for City & Postal Code */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">City*</label>
                      <input required type="text" value={safeRender(addressForm.City)} onChange={(e) => setAddressForm({ ...addressForm, City: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Postal Code*</label>
                      <input required type="text" value={safeRender(addressForm.PostalCode)} onChange={(e) => setAddressForm({ ...addressForm, PostalCode: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                  </div>
                  {/* Grid for Country & State */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Country*</label>
                      <select required value={addressForm.CountryId || 0} onChange={(e) => setAddressForm({ ...addressForm, CountryId: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium">
                        <option value={0} disabled>Select Country</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">State*</label>
                      <select required value={addressForm.StateId || 0} onChange={(e) => setAddressForm({ ...addressForm, StateId: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium disabled:opacity-50" disabled={!addressForm.CountryId}>
                        <option value={0} disabled>Select State</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Grid for Mobile & Alt Mobile */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Mobile No*</label>
                      <input required type="text" value={safeRender(addressForm.MobileNo)} onChange={(e) => setAddressForm({ ...addressForm, MobileNo: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1.5">Alt Mobile No</label>
                      <input type="text" value={safeRender(addressForm.AlternativeMobileNo)} onChange={(e) => setAddressForm({ ...addressForm, AlternativeMobileNo: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[var(--color-primary)] focus:bg-white transition-colors text-neutral-900 font-medium" />
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
                            <img src={`https://hridhayconnectreact.bsite.net${item.ImagePath}`} alt={safeRender(item.ProductName)} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextElementSibling) e.currentTarget.nextElementSibling.classList.remove('hidden'); }} />
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
