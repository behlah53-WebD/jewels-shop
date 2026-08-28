"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.user?.role !== "admin") {
        setError("Access denied. You do not have administrator permissions.");
        await fetch("/api/auth/logout", { method: "POST" });
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-brand">
          <Logo />
          <div className="admin-login-badge">
            <ShieldCheck size={13} />
            <span>Curator &amp; Operations Portal</span>
          </div>
        </div>

        <h1 className="admin-login-title">Sign in to Aurelia Admin</h1>
        <p className="admin-login-subtitle">
          Enter your executive credentials to access commerce controls, inventory, and storefront CMS.
        </p>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={17} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label>Admin Email</label>
            <div className="admin-login-input-wrap">
              <Mail size={15} className="admin-login-icon" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aureliajewels.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label>Password</label>
            <div className="admin-login-input-wrap">
              <Lock size={15} className="admin-login-icon" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? "Authenticating..." : "Access Operations"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link href="/">← Return to Storefront</Link>
          <span>Aurelia Security v2.0</span>
        </div>
      </div>
    </main>
  );
}
