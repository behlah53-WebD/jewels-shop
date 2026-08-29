"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, X, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  email: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onClose: () => void;
  onSubmit: (password: string) => Promise<{ success: boolean; error?: string }>;
}

export function PasswordModal({
  isOpen,
  email,
  title,
  subtitle,
  buttonText,
  onClose,
  onSubmit,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const result = await onSubmit(password);
      if (result.success) {
        setSuccessMsg("Password accepted!");
      } else {
        setError(result.error || "Failed to save password.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 24, 18, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        animation: "fadeIn 0.25s ease-out",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#fbf7ee",
          border: "1px solid #d5ad67",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          textAlign: "center",
          color: "#143025",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            color: "#8c734b",
            cursor: "pointer",
            padding: "0.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Lock Header Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(213, 173, 103, 0.12)",
            border: "1px solid rgba(213, 173, 103, 0.4)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 1.25rem",
            color: "#d5ad67",
          }}
        >
          <Lock size={26} />
        </div>

        <p style={{ color: "#d5ad67", fontSize: "10px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Security Setup
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: "500", margin: "0.4rem 0 0.75rem", color: "#0d251d" }}>
          {title}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#5a6e63", lineHeight: "1.6", marginBottom: "1.75rem" }}>
          {subtitle}<br />
          <strong style={{ color: "#0d251d" }}>{email}</strong>
        </p>

        {error && (
          <div
            style={{
              background: "#fff0f0",
              border: "1px solid #f5c2c2",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              color: "#c02b2b",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textAlign: "left",
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              color: "#166534",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textAlign: "left",
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "left" }}>
          {/* Password Field */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d251d", marginBottom: "0.4rem" }}>
              New Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="At least 6 characters"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.75rem 0.75rem 0.85rem",
                  background: "#ffffff",
                  border: "1px solid #c8bcab",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#0d251d",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  background: "transparent",
                  border: "none",
                  color: "#8c734b",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d251d", marginBottom: "0.4rem" }}>
              Confirm Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Re-enter password"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.75rem 0.75rem 0.85rem",
                  background: "#ffffff",
                  border: "1px solid #c8bcab",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#0d251d",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  background: "transparent",
                  border: "none",
                  color: "#8c734b",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.85rem",
              background: "#0d251d",
              color: "#fbf7ee",
              border: "1px solid #d5ad67",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Processing&hellip;</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
