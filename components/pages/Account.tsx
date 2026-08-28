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
} from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

export function Account() {
  const { count, save, syncCartAndWishlist, clearCart } = useStore();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");

  // Auth form state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // User orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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
        fetchUserOrders();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
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
      setUser(data.user);
      setEditName(data.user.name);
      setEditPhone(data.user.phone || "");
      fetchUserOrders();
      await syncCartAndWishlist();
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Registration failed");
        return;
      }
      setUser(data.user);
      setEditName(data.user.name);
      setEditPhone(data.user.phone || "");
      fetchUserOrders();
      await syncCartAndWishlist();
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
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
                <label htmlFor="acct-pass">Password</label>
                <div className="acct-input-wrap">
                  <Lock size={15} className="acct-field-icon" />
                  <input id="acct-pass" type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autoComplete="current-password" />
                </div>
              </div>
              <button type="submit" disabled={authLoading} className="acct-submit-btn">
                <span>{authLoading ? "Authenticating\u2026" : "Sign In to Account"}</span>
                {!authLoading && <ArrowRight size={16} />}
              </button>
              <p className="acct-switch-hint">
                New to Aurelia?{" "}
                <button type="button" onClick={() => setAuthMode("register")}>Create your account &rarr;</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="acct-form">
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
              <div className="acct-field">
                <label htmlFor="acct-reg-pass">Password</label>
                <div className="acct-input-wrap">
                  <Lock size={15} className="acct-field-icon" />
                  <input id="acct-reg-pass" type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters" autoComplete="new-password" />
                </div>
              </div>
              <button type="submit" disabled={authLoading} className="acct-submit-btn">
                <span>{authLoading ? "Creating account\u2026" : "Complete Registration"}</span>
                {!authLoading && <ArrowRight size={16} />}
              </button>
              <p className="acct-switch-hint">
                Already a patron?{" "}
                <button type="button" onClick={() => setAuthMode("login")}>Sign in here &rarr;</button>
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
            {ordersLoading ? (
              <p className="dash-loading">Loading your order history&hellip;</p>
            ) : orders.length > 0 ? (
              orders.map((o) => (
                <article key={o._id} className="dash-order-card">
                  <div className="dash-order-head">
                    <div className="dash-order-meta">
                      <div className="dash-order-id">Order #{o._id.substring(0, 10).toUpperCase()}</div>
                      <div className="dash-order-date">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div className="dash-order-badges">
                      <span className="dash-badge dash-badge-status">{o.orderStatus}</span>
                      <span className="dash-badge dash-badge-pay">Payment: {o.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="dash-order-items">
                    {o.items?.map((item: any, idx: number) => (
                      <div key={idx} className="dash-order-item">
                        <img src={item.image || "/placeholder.jpg"} alt={item.name} className="dash-order-item-img" />
                        <div className="dash-order-item-info">
                          <div className="dash-order-item-name">{item.name}</div>
                          <div className="dash-order-item-meta">
                            Qty: {item.quantity}{item.size ? ` \u00b7 Size: ${item.size}` : ""}
                          </div>
                        </div>
                        <div className="dash-order-item-price">
                          &#x20B9;{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dash-order-foot">
                    <div className="dash-order-address">
                      {o.shippingAddress?.street && <>{o.shippingAddress.street}, {o.shippingAddress.city}</>}
                    </div>
                    <div>
                      <span className="dash-order-total-label">Order Total</span>
                      <div className="dash-order-total-amount">&#x20B9;{o.total?.toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="dash-empty">
                <PackageCheck size={44} />
                <h3>No orders placed yet</h3>
                <p>When you acquire fine jewellery from Aurelia, your orders and tracking updates will appear here.</p>
                <Link href="/shop" className="dash-empty-btn">Explore the Collection</Link>
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
    </main>
  );
}
