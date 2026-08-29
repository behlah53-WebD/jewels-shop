"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface OtpModalProps {
  isOpen: boolean;
  email: string;
  purpose: "registration" | "forgot_password";
  onClose: () => void;
  onVerified: (otp: string) => void;
  onResendOtp: () => Promise<{ success: boolean; error?: string }>;
}

export function OtpModal({
  isOpen,
  email,
  purpose,
  onClose,
  onVerified,
  onResendOtp,
}: OtpModalProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setOtpDigits(Array(6).fill(""));
      setTimer(60);
      setCanResend(false);
      setError("");
      setSuccessMsg("");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (!isOpen) return;
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.substring(value.length - 1);
    setOtpDigits(newDigits);
    setError("");

    // Auto-focus next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp, purpose }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Verification failed.");
        return;
      }

      setSuccessMsg("Code verified successfully!");
      setTimeout(() => {
        onVerified(fullOtp);
      }, 500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError("");
    setSuccessMsg("");

    try {
      const result = await onResendOtp();
      if (result.success) {
        setSuccessMsg("A new verification code has been sent to your email.");
        setTimer(60);
        setCanResend(false);
        setOtpDigits(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setError(result.error || "Failed to resend code.");
      }
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResending(false);
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
            transition: "all 0.2s",
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
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
          <ShieldCheck size={28} />
        </div>

        <p style={{ color: "#d5ad67", fontSize: "10px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Security Verification
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: "500", margin: "0.4rem 0 0.75rem", color: "#0d251d" }}>
          Enter <i>Verification Code</i>
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#5a6e63", lineHeight: "1.6", marginBottom: "1.75rem" }}>
          We have dispatched a 6-digit security code to<br />
          <strong style={{ color: "#0d251d", wordBreak: "break-all" }}>{email}</strong>
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

        {/* 6 Digit OTP Input Grid */}
        <form onSubmit={handleVerifySubmit}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.75rem" }}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                style={{
                  width: "44px",
                  height: "52px",
                  textAlign: "center",
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  fontFamily: "'Courier New', monospace",
                  color: "#0d251d",
                  background: "#ffffff",
                  border: digit ? "2px solid #d5ad67" : "1px solid #c8bcab",
                  borderRadius: "8px",
                  outline: "none",
                  boxShadow: digit ? "0 0 10px rgba(213, 173, 103, 0.25)" : "none",
                  transition: "all 0.15s ease",
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otpDigits.join("").length !== 6}
            style={{
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
              cursor: loading || otpDigits.join("").length !== 6 ? "not-allowed" : "pointer",
              opacity: loading || otpDigits.join("").length !== 6 ? 0.6 : 1,
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
                <span>Verifying Code&hellip;</span>
              </>
            ) : (
              <span>Verify &amp; Continue</span>
            )}
          </button>
        </form>

        {/* Resend Timer Footer */}
        <div style={{ marginTop: "1.5rem", fontSize: "0.82rem", color: "#5a6e63" }}>
          Didn&apos;t receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResendClick}
              disabled={resending}
              style={{
                background: "transparent",
                border: "none",
                color: "#8c734b",
                fontWeight: "700",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          ) : (
            <span style={{ color: "#8c734b", fontWeight: "600" }}>
              Resend in {timer}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
