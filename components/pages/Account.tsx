"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  LogIn,
  UserPlus,
  Save,
  RefreshCw,
  RotateCcw,
  Truck,
  Package,
  Copy,
  Calendar,
  CreditCard,
  Hash,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  Star,
  ArrowUpRight,
  Download,
  FileText,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import dynamic from "next/dynamic";

const OtpModal = dynamic(() => import("@/components/auth/OtpModal").then((m) => m.OtpModal), { ssr: false });
const PasswordModal = dynamic(() => import("@/components/auth/PasswordModal").then((m) => m.PasswordModal), { ssr: false });
import { useDispatch } from "react-redux";
import { apiSlice, useGetOrdersQuery } from "@/lib/redux/api/apiSlice";
import { invalidateCache } from "@/lib/apiClient";

export function Account() {
  const dispatch = useDispatch();
  const { count, save, syncCartAndWishlist, clearCart } = useStore();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  // RTK Query for user orders
  const { data: ordersData, isLoading: rtkOrdersLoading, refetch: refetchUserOrders } = useGetOrdersQuery(undefined, { skip: !user });
  const orders = ordersData?.success && Array.isArray(ordersData.orders) ? ordersData.orders : [];
  const ordersLoading = rtkOrdersLoading;

  // Auth form state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // OTP & Password Modal States
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<"registration" | "forgot_password">("registration");
  const [verifiedOtp, setVerifiedOtp] = useState("");

  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [expandedOrderCards, setExpandedOrderCards] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Return modal state
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);
  const [returnReason, setReturnReason] = useState("Size fit issue");
  const [returnComments, setReturnComments] = useState("");
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState("");

  // Profile edit state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // New address state
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  useEffect(() => {
    fetchAuthUser();
  }, []);

  const fetchAuthUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setEditName(data.user.name);
        setEditPhone(data.user.phone || "");
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder) return;

    setReturnLoading(true);
    setReturnError("");

    try {
      const res = await fetch(`/api/orders/${returnModalOrder._id}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: returnReason, comments: returnComments }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setReturnError(data.error || "Failed to submit return request");
        setReturnLoading(false);
        return;
      }

      setReturnModalOrder(null);
      setReturnReason("Size fit issue");
      setReturnComments("");
      refetchUserOrders();
    } catch (err: any) {
      setReturnError(err.message || "Failed to submit return request");
    } finally {
      setReturnLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Login failed");
        return;
      }
      invalidateCache();
      dispatch(apiSlice.util.resetApiState());
      setUser(data.user);
      setEditName(data.user.name);
      setEditPhone(data.user.phone || "");
      await syncCartAndWishlist();
      refetchUserOrders();
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRequestRegistrationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");

    if (!email || !name) {
      setAuthError("Please fill in your name and email address.");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "registration" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Failed to send verification code.");
        return;
      }

      setOtpPurpose("registration");
      setOtpModalOpen(true);
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRequestForgotPasswordOtp = async () => {
    setAuthError("");
    setAuthSuccessMsg("");

    if (!email) {
      setAuthError("Please enter your email address to reset your password.");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "forgot_password" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Failed to send verification code.");
        return;
      }

      setOtpPurpose("forgot_password");
      setOtpModalOpen(true);
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: otpPurpose }),
    });
    return await res.json();
  };

  const handleOtpVerified = (otpCode: string) => {
    setVerifiedOtp(otpCode);
    setOtpModalOpen(false);
    setPasswordModalOpen(true);
  };

  const handlePasswordModalSubmit = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (otpPurpose === "registration") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password: newPassword, phone }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Registration failed." };
        }
        invalidateCache();
        dispatch(apiSlice.util.resetApiState());
        setUser(data.user);
        setEditName(data.user.name);
        setEditPhone(data.user.phone || "");
        setPasswordModalOpen(false);
        await syncCartAndWishlist();
        refetchUserOrders();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Registration failed." };
      }
    } else {
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: verifiedOtp, newPassword }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Failed to reset password." };
        }
        setPasswordModalOpen(false);
        setAuthMode("login");
        setPassword("");
        setAuthSuccessMsg("Password updated successfully! Please sign in with your new password.");
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to reset password." };
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    invalidateCache();
    dispatch(apiSlice.util.resetApiState());
    setUser(null);
    clearCart();
    await syncCartAndWishlist();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setProfileMsg("Profile updated successfully!");
        setTimeout(() => setProfileMsg(""), 3500);
      } else {
        setProfileMsg(data.error || "Failed to update profile");
      }
    } catch {
      setProfileMsg("Update failed");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !addrState || !postalCode) return;
    const newAddress = {
      street, city, state: addrState, postalCode, country,
      isDefault: user?.addresses?.length === 0,
    };
    const updatedAddresses = [...(user?.addresses || []), newAddress];
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: updatedAddresses }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setStreet(""); setCity(""); setAddrState(""); setPostalCode("");
        setProfileMsg("Address added successfully!");
        setTimeout(() => setProfileMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="dash-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="dash-loading">Loading your Aurelia account&hellip;</p>
      </main>
    );
  }

  // Unauthenticated: Auth split-panel
  if (!user) {
    return (
      <main className="acct-auth-root">
        <div className="acct-mini-nav">
          <Link href="/" className="acct-mini-logo">Aurelia</Link>
          <Link href="/shop" className="acct-mini-back">&larr; Back to shop</Link>
        </div>

        {/* LEFT PANEL */}
        <div className="acct-auth-left">
          <div className="acct-deco-ring acct-deco-ring-1" />
          <div className="acct-deco-ring acct-deco-ring-2" />
          <div className="acct-deco-ring acct-deco-ring-3" />
          <div className="acct-ornament">
            <span />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5H22L16 14.5L18.5 22L12 17.5L5.5 22L8 14.5L2 9.5H9.5L12 2Z" fill="#d5ad67" opacity="0.8" />
            </svg>
            <span />
          </div>
          <div className="acct-left-copy">
            <p className="acct-eyebrow">Aurelia Patron Account</p>
            <h1 className="acct-left-heading">
              Your private<br /><i>sanctuary.</i>
            </h1>
            <p className="acct-left-sub">
              A space crafted for the discerning wearer &mdash; track your orders, curate your wishlist, and manage your bespoke commissions.
            </p>
            <div className="acct-trust-grid">
              {[
                { icon: "✦", label: "Express Checkout", sub: "Saved addresses" },
                { icon: "◈", label: "Order Tracking", sub: "Real-time updates" },
                { icon: "❖", label: "Exclusive Access", sub: "Member previews" },
              ].map((t) => (
                <div key={t.label} className="acct-trust-item">
                  <span className="acct-trust-icon">{t.icon}</span>
                  <div>
                    <b>{t.label}</b>
                    <span>{t.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="acct-bag-indicator">
            <span className="acct-bag-dot" />
            <span>{count} in bag &middot; {save.length} saved</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="acct-auth-right">
          <div className="acct-mode-tabs">
            <button onClick={() => { setAuthMode("login"); setAuthError(""); }}
              className={authMode === "login" ? "active" : ""}>
              <LogIn size={14} /><span>Sign In</span>
            </button>
            <button onClick={() => { setAuthMode("register"); setAuthError(""); }}
              className={authMode === "register" ? "active" : ""}>
              <UserPlus size={14} /><span>Register</span>
            </button>
          </div>

          <div className="acct-form-header">
            <p className="acct-form-eyebrow">
              {authMode === "login" ? "Welcome back" : "Join Aurelia"}
            </p>
            <h2 className="acct-form-title">
              {authMode === "login"
                ? <><span>Sign in to your </span><i>account</i></>
                : <><span>Create your </span><i>patron account</i></>}
            </h2>
            <p className="acct-form-subtitle">
              {authMode === "login"
                ? "Access your order history, delivery details, and saved pieces."
                : "Register to enjoy express checkout, order tracking, and exclusive previews."}
            </p>
          </div>

          {authError && (
            <div className="acct-error-banner">
              <AlertCircle size={16} /><span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="acct-success-banner" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "0.85rem 1rem", borderRadius: "8px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <CheckCircle2 size={16} /><span>{authSuccessMsg}</span>
            </div>
          )}

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="acct-form">
              <div className="acct-field">
                <label htmlFor="acct-email">Email Address</label>
                <div className="acct-input-wrap">
                  <Mail size={15} className="acct-field-icon" />
                  <input id="acct-email" type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>
              <div className="acct-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label htmlFor="acct-pass" style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={handleRequestForgotPasswordOtp}
                    disabled={authLoading}
                    style={{ background: "transparent", border: "none", color: "#8c734b", fontSize: "11px", fontWeight: "600", cursor: "pointer", padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="acct-input-wrap" style={{ position: "relative" }}>
                  <Lock size={15} className="acct-field-icon" />
                  <input id="acct-pass" type={showLoginPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autoComplete="current-password"
                    style={{ paddingRight: "2.5rem" }} />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{ position: "absolute", right: "0.75rem", background: "transparent", border: "none", color: "#8c734b", cursor: "pointer", display: "flex", alignItems: "center" }}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={authLoading} className="acct-submit-btn">
                <span>{authLoading ? "Authenticating\u2026" : "Sign In to Account"}</span>
                {!authLoading && <ArrowRight size={16} />}
              </button>
              <p className="acct-switch-hint">
                New to Aurelia?{" "}
                <button type="button" onClick={() => { setAuthMode("register"); setAuthError(""); setAuthSuccessMsg(""); }}>Create your account &rarr;</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRequestRegistrationOtp} className="acct-form">
              <div className="acct-field">
                <label htmlFor="acct-name">Full Name</label>
                <div className="acct-input-wrap">
                  <User size={15} className="acct-field-icon" />
                  <input id="acct-name" type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name" autoComplete="name" />
                </div>
              </div>
              <div className="acct-field">
                <label htmlFor="acct-reg-email">Email Address</label>
                <div className="acct-input-wrap">
                  <Mail size={15} className="acct-field-icon" />
                  <input id="acct-reg-email" type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>
              <div className="acct-field">
                <label htmlFor="acct-phone">Phone <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <div className="acct-input-wrap">
                  <Phone size={15} className="acct-field-icon" />
                  <input id="acct-phone" type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210" autoComplete="tel" />
                </div>
              </div>
              <button type="submit" disabled={authLoading} className="acct-submit-btn">
                <span>{authLoading ? "Sending Code\u2026" : "Verify Email & Continue"}</span>
                {!authLoading && <ArrowRight size={16} />}
              </button>
              <p className="acct-switch-hint">
                Already a patron?{" "}
                <button type="button" onClick={() => { setAuthMode("login"); setAuthError(""); setAuthSuccessMsg(""); }}>Sign in here &rarr;</button>
              </p>
            </form>
          )}

          <div className="acct-admin-link">
            <Link href="/admin/login">
              <ShieldCheck size={12} />
              Operations Portal
            </Link>
          </div>
        </div>

        {/* OTP Modal */}
        <OtpModal
          isOpen={otpModalOpen}
          email={email}
          purpose={otpPurpose}
          onClose={() => setOtpModalOpen(false)}
          onVerified={handleOtpVerified}
          onResendOtp={handleResendOtp}
        />

        {/* Password Setup/Reset Modal */}
        <PasswordModal
          isOpen={passwordModalOpen}
          email={email}
          title={otpPurpose === "registration" ? "Create Account Password" : "Reset Your Password"}
          subtitle={otpPurpose === "registration" ? "Choose a secure password to protect your patron account." : "Set a new password for your patron account."}
          buttonText={otpPurpose === "registration" ? "Complete Account Creation" : "Reset Password"}
          onClose={() => setPasswordModalOpen(false)}
          onSubmit={handlePasswordModalSubmit}
        />
      </main>
    );
  }

  // Authenticated Dashboard
  const initials = user.name
    ? user.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <main className="dash-root">
      {/* Sticky Top Bar */}
      <nav className="dash-topbar">
        <Link href="/" className="dash-topbar-logo">Aurelia</Link>
        <div className="dash-topbar-actions">
          {user.role === "admin" && (
            <Link href="/admin" className="dash-topbar-admin">
              <ShieldCheck size={12} /> Operations
            </Link>
          )}
          <button onClick={handleLogout} className="dash-topbar-logout">
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </nav>

      {/* Profile Hero */}
      <section className="dash-profile-hero">
        <div className="dash-profile-inner">
          <div className="dash-avatar">{initials}</div>
          <div className="dash-profile-copy">
            <p className="dash-eyebrow">Aurelia Patron Account</p>
            <h1 className="dash-profile-name">
              Welcome, <i>{user.name.split(" ")[0]}.</i>
            </h1>
            <p className="dash-profile-email">{user.email}</p>
          </div>
        </div>
        <div className="dash-stats-row">
          <div className="dash-stat">
            <div className="dash-stat-icon"><ShoppingBag size={16} /></div>
            <div className="dash-stat-info">
              <div className="dash-stat-num">{orders.length}</div>
              <div className="dash-stat-label">Orders placed</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon"><MapPin size={16} /></div>
            <div className="dash-stat-info">
              <div className="dash-stat-num">{user.addresses?.length || 0}</div>
              <div className="dash-stat-label">Saved addresses</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-icon"><User size={16} /></div>
            <div className="dash-stat-info">
              <div className="dash-stat-num" style={{ fontSize: ".85rem", lineHeight: "1.8" }}>
                {user.role === "admin" ? "Admin" : "Patron"}
              </div>
              <div className="dash-stat-label">Account type</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Nav */}
      <div className="dash-tabs">
        {([
          { id: "orders" as const, label: "Order History", icon: ShoppingBag, count: orders.length },
          { id: "profile" as const, label: "My Profile", icon: User, count: null as null },
          { id: "addresses" as const, label: "Addresses", icon: MapPin, count: user.addresses?.length || 0 },
        ]).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"dash-tab" + (activeTab === tab.id ? " active" : "")}
            >
              <Icon size={14} />
              {tab.label}
              {tab.count !== null && (
                <span className="dash-tab-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="dash-content">
        {profileMsg && (
          <div className="dash-success">
            <CheckCircle size={16} />
            <span>{profileMsg}</span>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            {/* Section header */}
            <div className="orders-section-header">
              <h2 className="orders-section-title">
                <ClipboardList size={22} />
                Order History
              </h2>
              {orders.length > 0 && (
                <span className="orders-count-pill">
                  <ShoppingBag size={11} />
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </span>
              )}
            </div>

            {ordersLoading ? (
              <p className="dash-loading">Loading your order history&hellip;</p>
            ) : orders.length > 0 ? (
              orders.map((o: any) => {
                const steps = [
                  { label: "Order Placed", key: "placed", icon: "✦" },
                  { label: "Processing", key: "processing", icon: "⚙" },
                  { label: "Shipped", key: "shipped", icon: "⬆" },
                  { label: "Delivered", key: "delivered", icon: "✓" },
                ];

                let currentStepIndex = 1;
                if (o.orderStatus === "processing") currentStepIndex = 1;
                if (o.orderStatus === "shipped") currentStepIndex = 2;
                if (o.orderStatus === "delivered") currentStepIndex = 3;

                const isReturned = o.orderStatus === "returned";
                const isReturnRequested = o.orderStatus === "return_requested";
                const isExpanded = expandedOrders.has(o._id);
                const isCardExpanded = expandedOrderCards.has(o._id);
                const visibleItems = isExpanded ? o.items : o.items?.slice(0, 2);
                const hasMoreItems = (o.items?.length || 0) > 2;

                const toggleCard = () => {
                  const next = new Set(expandedOrderCards);
                  if (isCardExpanded) next.delete(o._id);
                  else next.add(o._id);
                  setExpandedOrderCards(next);
                };

                const statusClass = o.orderStatus === "delivered"
                  ? "status-delivered"
                  : o.orderStatus === "shipped"
                  ? "status-shipped"
                  : o.orderStatus === "processing"
                  ? "status-processing"
                  : (isReturned || isReturnRequested)
                  ? "status-returned"
                  : "";

                const handleCopyId = () => {
                  navigator.clipboard.writeText(o._id);
                  setCopiedId(o._id);
                  setTimeout(() => setCopiedId(null), 2000);
                };

                return (
                  <article key={o._id} className={`dash-order-card ${isCardExpanded ? "is-expanded" : ""}`}>

                    {/* ── ORDER HEAD ── */}
                    <div className="dash-order-head" onClick={toggleCard} style={{ cursor: "pointer" }}>
                      <div className="dash-order-meta">
                        <div className="dash-order-number-row">
                          <span className="dash-order-hash"><Hash size={10} /></span>
                          <span className="dash-order-id">{o._id.substring(0, 12).toUpperCase()}</span>
                          <button
                            className="dash-order-id-copy"
                            onClick={(e) => { e.stopPropagation(); handleCopyId(); }}
                            title="Copy order ID"
                          >
                            {copiedId === o._id
                              ? <CheckCircle size={11} />
                              : <Copy size={11} />
                            }
                          </button>
                        </div>
                        <div className="dash-order-date-row">
                          <span className="dash-order-date">
                            <Calendar size={11} />
                            {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          {o.items?.length > 0 && (
                            <span className="dash-order-date" style={{ marginLeft: ".75rem" }}>
                              <Package size={11} />
                              {o.items.length} {o.items.length === 1 ? "item" : "items"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="dash-order-head-right">
                        <div className="dash-order-badges">
                          {o.razorpayPaymentId && (
                            <span className="dash-badge dash-badge-razorpay">
                              <ShieldCheck size={9} />
                              Razorpay · {o.razorpayPaymentId.substring(0, 10)}
                            </span>
                          )}
                          <span className={`dash-badge dash-badge-status ${statusClass}`}>
                            {o.orderStatus === "delivered" && <CheckCircle size={9} />}
                            {o.orderStatus === "shipped" && <Truck size={9} />}
                            {o.orderStatus === "processing" && <RefreshCw size={9} />}
                            {(isReturned || isReturnRequested) && <RotateCcw size={9} />}
                            {o.orderStatus.replace(/_/g, " ")}
                          </span>
                          <span className={`dash-badge dash-badge-pay ${o.paymentStatus === "paid" ? "pay-paid" : ""}`}>
                            <CreditCard size={9} />
                            {o.paymentStatus}
                          </span>
                        </div>
                        <button
                          className="dash-order-expand-arrow"
                          onClick={(e) => { e.stopPropagation(); toggleCard(); }}
                          title={isCardExpanded ? "Collapse order" : "Expand order"}
                          aria-expanded={isCardExpanded}
                        >
                          {isCardExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* ── COLLAPSIBLE BODY ── */}
                    <div className="dash-order-body">
                      {/* ── TIMELINE STEPPER ── */}
                      {isReturned || isReturnRequested ? (
                        <div className="order-return-banner">
                          <div className="order-return-info">
                            <div className="order-return-title">
                              <RotateCcw size={13} />
                              {isReturned ? "Return Processed & Refunded" : "Return Request Pending Review"}
                            </div>
                            <div className="order-return-reason">
                              Reason: {o.returnDetails?.reason || "Customer return request"}
                            </div>
                          </div>
                          <span className="order-return-chip">
                            {o.orderStatus.replace(/_/g, " ")}
                          </span>
                        </div>
                      ) : (
                        <div className="order-timeline-wrap">
                          <div className="order-timeline-steps">
                            {steps.map((step, idx) => {
                              const isDone = idx <= currentStepIndex;
                              const isCurrent = idx === currentStepIndex;
                              return (
                                <div key={step.key} className="order-step">
                                  {/* Connector line to next step */}
                                  {idx < steps.length - 1 && (
                                    <div className={`order-step-connector ${idx < currentStepIndex ? "done" : ""}`} />
                                  )}
                                  <div className={`order-step-dot ${isCurrent ? "current" : isDone ? "done" : ""}`}>
                                    {isDone ? (isCurrent ? idx + 1 : "✓") : idx + 1}
                                  </div>
                                  <span className={`order-step-label ${isCurrent ? "current" : isDone ? "done" : ""}`}>
                                    {step.label}
                                  </span>
                                  {isCurrent && (
                                    <span className="order-step-sub">In progress</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ── ORDER SUMMARY BAR ── */}
                      <div className="order-summary-bar">
                        <div className="order-summary-cell">
                          <span className="order-summary-label">Items</span>
                          <span className="order-summary-value">{o.items?.length || 0}</span>
                        </div>
                        <div className="order-summary-cell">
                          <span className="order-summary-label">Payment</span>
                          <span className="order-summary-value" style={{ textTransform: "capitalize" }}>{o.paymentMethod || "Online"}</span>
                        </div>
                        <div className="order-summary-cell">
                          <span className="order-summary-label">Total</span>
                          <span className="order-summary-value">&#x20B9;{o.total?.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* ── ORDER ITEMS ── */}
                      <div className="dash-order-items">
                        {visibleItems?.map((item: any, idx: number) => (
                          <div key={idx} className="dash-order-item">
                            <img
                              src={item.image || "/placeholder.jpg"}
                              alt={item.name}
                              className="dash-order-item-img"
                            />
                            <div className="dash-order-item-info">
                              <div className="dash-order-item-name">{item.name}</div>
                              <div className="dash-order-item-meta">
                                <span>Qty: {item.quantity}</span>
                                {item.size && (
                                  <>
                                    <span className="dash-order-item-meta-sep" />
                                    <span>Size: {item.size}</span>
                                  </>
                                )}
                                {item.price && (
                                  <>
                                    <span className="dash-order-item-meta-sep" />
                                    <span className="dash-order-item-badge">
                                      &#x20B9;{item.price.toLocaleString("en-IN")} ea.
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="dash-order-item-price-col">
                              <div className="dash-order-item-price">
                                &#x20B9;{(item.price * item.quantity).toLocaleString("en-IN")}
                              </div>
                              <div className="dash-order-item-qty">
                                {item.quantity > 1 ? `${item.quantity} × ₹${item.price?.toLocaleString("en-IN")}` : ""}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expand/collapse more items */}
                      {hasMoreItems && (
                        <button
                          className="order-expand-btn"
                          onClick={() => {
                            const next = new Set(expandedOrders);
                            if (isExpanded) next.delete(o._id);
                            else next.add(o._id);
                            setExpandedOrders(next);
                          }}
                        >
                          {isExpanded
                            ? <><ChevronUp size={12} /> Show less</>
                            : <><ChevronDown size={12} /> Show {o.items.length - 2} more item{o.items.length - 2 !== 1 ? "s" : ""}</>
                          }
                        </button>
                      )}

                      {/* ── ORDER FOOTER ── */}
                      <div className="dash-order-foot">
                        <div className="dash-order-foot-left">
                          {o.shippingAddress?.street && (
                            <div className="dash-order-address">
                              <MapPin size={12} />
                              <span>
                                {o.shippingAddress.street}, {o.shippingAddress.city}
                                {o.shippingAddress.state ? `, ${o.shippingAddress.state}` : ""}
                                {o.shippingAddress.postalCode ? ` – ${o.shippingAddress.postalCode}` : ""}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="dash-order-foot-right">
                          <a
                            href={`/api/orders/${o._id}/invoice?download=true`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="order-return-btn"
                            style={{ background: "rgba(213,173,103,0.12)", borderColor: "rgba(213,173,103,0.3)", color: "#8b6d3a" }}
                            title="View / Download Official Tax Invoice"
                          >
                            <Download size={12} /> Download Invoice
                          </a>
                          {o.orderStatus === "delivered" && (
                            <button
                              onClick={() => setReturnModalOrder(o)}
                              className="order-return-btn"
                            >
                              <RotateCcw size={12} /> Return Order
                            </button>
                          )}
                          <div className="dash-order-total-block">
                            <span className="dash-order-total-label">Order Total</span>
                            <div className="dash-order-total-amount">
                              &#x20B9;{o.total?.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </article>
                );
              })
            ) : (
              <div className="dash-empty">
                <div className="dash-empty-icon">
                  <PackageCheck size={32} />
                </div>
                <h3>No orders placed yet</h3>
                <p>When you acquire fine jewellery from Aurelia, your orders and tracking updates will appear here.</p>
                <Link href="/shop" className="dash-empty-btn">
                  <ArrowUpRight size={14} />
                  Explore the Collection
                </Link>
              </div>
            )}
          </div>
        )}


        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="dash-form-card">
            <h2 className="dash-form-title">
              <User size={20} style={{ color: "var(--gold)", flexShrink: 0 }} />
              Personal Details
            </h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="dash-form-field">
                <label className="dash-form-label">Full Name</label>
                <input type="text" className="dash-form-input" value={editName}
                  onChange={(e) => setEditName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="dash-form-field">
                <label className="dash-form-label">Email Address (read-only)</label>
                <input type="email" className="dash-form-input" disabled value={user.email} />
              </div>
              <div className="dash-form-field">
                <label className="dash-form-label">Phone Number</label>
                <input type="tel" className="dash-form-input" value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <button type="submit" className="dash-form-submit">
                <Save size={14} /> Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* ADDRESSES */}
        {activeTab === "addresses" && (
          <div>
            {user.addresses?.length > 0 && (
              <div className="dash-address-grid">
                {user.addresses.map((addr: any, idx: number) => (
                  <div key={idx} className="dash-address-card">
                    {addr.isDefault && <span className="dash-address-default">Default</span>}
                    <div className="dash-address-name">{addr.name || user.name}</div>
                    <div className="dash-address-line">
                      {addr.street}<br />
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="dash-add-address">
              <h3 className="dash-add-address-title">
                <Plus size={18} /> Add New Delivery Address
              </h3>
              <form onSubmit={handleAddAddress}>
                <div className="dash-form-field">
                  <label className="dash-form-label">Street Address *</label>
                  <input type="text" required className="dash-form-input"
                    placeholder="e.g. 12 Marine Drive, Flat 4B"
                    value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div className="dash-input-grid-2">
                  <div className="dash-form-field">
                    <label className="dash-form-label">City *</label>
                    <input type="text" required className="dash-form-input" placeholder="Mumbai"
                      value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="dash-form-field">
                    <label className="dash-form-label">State *</label>
                    <input type="text" required className="dash-form-input" placeholder="Maharashtra"
                      value={addrState} onChange={(e) => setAddrState(e.target.value)} />
                  </div>
                </div>
                <div className="dash-input-grid-2">
                  <div className="dash-form-field">
                    <label className="dash-form-label">Postal Code *</label>
                    <input type="text" required className="dash-form-input" placeholder="400001"
                      value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                  <div className="dash-form-field">
                    <label className="dash-form-label">Country</label>
                    <input type="text" required className="dash-form-input"
                      value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="dash-form-submit">
                  <Plus size={14} /> Save Address
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {returnModalOrder && (
        <div className="return-modal-overlay" onClick={() => setReturnModalOrder(null)}>
          <div className="return-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="return-modal-header">
              <div className="return-modal-header-left">
                <div className="return-modal-icon-ring">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <h3 className="return-modal-title">Return Request</h3>
                  <div className="return-modal-order-tag">
                    ORDER #{returnModalOrder._id.substring(0, 10).toUpperCase()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="return-modal-close-btn"
                title="Close window"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="return-modal-body">

              {/* Order Item Preview */}
              {returnModalOrder.items?.length > 0 && (
                <div className="return-items-preview">
                  <img
                    src={returnModalOrder.items[0].image || "/placeholder.jpg"}
                    alt={returnModalOrder.items[0].name}
                    className="return-items-preview-img"
                  />
                  <div className="return-items-preview-info">
                    <div className="return-items-preview-name">
                      {returnModalOrder.items[0].name}
                    </div>
                    <div className="return-items-preview-meta">
                      {returnModalOrder.items.length > 1 
                        ? `+ ${returnModalOrder.items.length - 1} other item(s) · ₹${returnModalOrder.total?.toLocaleString("en-IN")}`
                        : `Qty: ${returnModalOrder.items[0].quantity} · ₹${returnModalOrder.total?.toLocaleString("en-IN")}`
                      }
                    </div>
                  </div>
                </div>
              )}

              {returnError && (
                <div className="return-error-box">
                  <AlertCircle size={15} />
                  <span>{returnError}</span>
                </div>
              )}

              <form onSubmit={handleRequestReturn}>
                <div className="return-field-group">
                  <label className="return-field-label">
                    <RotateCcw size={12} /> Return Reason *
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="return-select"
                  >
                    <option value="Size fit issue">Size fit issue</option>
                    <option value="Defective or Damaged">Defective or Damaged</option>
                    <option value="Item different from description">Item different from description</option>
                    <option value="Changed mind">Changed mind</option>
                    <option value="Other reason">Other reason</option>
                  </select>
                </div>

                <div className="return-field-group">
                  <label className="return-field-label">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={returnComments}
                    onChange={(e) => setReturnComments(e.target.value)}
                    placeholder="Provide any additional comments about your return request..."
                    className="return-textarea"
                  />
                </div>

                <div className="return-modal-actions">
                  <button
                    type="button"
                    onClick={() => setReturnModalOrder(null)}
                    className="return-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={returnLoading}
                    className="return-submit-btn"
                  >
                    {returnLoading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={13} /> Confirm Return Request
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
