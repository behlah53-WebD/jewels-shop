"use client";
import React from "react";
import Link from "next/link";
import { Lock, ArrowRight, X } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

export function AuthModal() {
  const { authModal, setAuthModal } = useStore();

  if (!authModal) return null;

  return (
    <div className="overlay" style={{ zIndex: 100 }}>
      <div className="modal" style={{ maxWidth: "460px", textAlign: "center", padding: "2.5rem 2rem" }}>
        <button
          className="icon close"
          onClick={() => setAuthModal(false)}
          aria-label="Close modal"
        >
          <X />
        </button>
        <div
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: "rgba(213, 173, 103, 0.12)",
            border: "1px solid rgba(213, 173, 103, 0.3)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 1.25rem",
            color: "var(--gold)",
          }}
        >
          <Lock size={24} />
        </div>
        <p style={{ color: "var(--gold)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Aurelia Patron Access
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: "500", margin: "0.5rem 0 1rem", color: "var(--ink)" }}>
          Sign in to <i>continue</i>
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: "1.6", marginBottom: "1.75rem" }}>
          Please sign in or create an account to save pieces to your selection, manage your wishlist, and enjoy express checkout.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href="/account"
            onClick={() => setAuthModal(false)}
            className="btn gold"
            style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }}
          >
            Sign In or Register <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => setAuthModal(false)}
            style={{
              background: "transparent",
              border: "1px solid #b7a689",
              padding: "0.7rem",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
