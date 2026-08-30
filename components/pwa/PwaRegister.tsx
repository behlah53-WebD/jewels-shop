"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker safely
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("PWA Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      });
    }

    // 2. Listen for native PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const isDismissed = sessionStorage.getItem("aurelia_pwa_dismissed") === "true";
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted PWA installation");
    }
    sessionStorage.setItem("aurelia_pwa_dismissed", "true");
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("aurelia_pwa_dismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <aside
      role="banner"
      aria-label="App installation request"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        maxWidth: "380px",
        width: "calc(100vw - 3rem)",
        backgroundColor: "#0a100d",
        color: "#f5efe3",
        border: "1px solid rgba(213, 173, 103, 0.3)",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        animation: "anim-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#d5ad67", fontWeight: 700 }}>
          Aurelia Experience
        </p>
        <b style={{ display: "block", fontSize: "14px", margin: "2px 0 4px", fontFamily: "serif", fontStyle: "italic", fontWeight: 500 }}>
          Install Aurelia App
        </b>
        <span style={{ fontSize: "11px", color: "#a4b0a8", lineHeight: 1.3, display: "block" }}>
          Add to home screen for faster access & offline updates.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button
          onClick={handleInstallClick}
          style={{
            backgroundColor: "#d5ad67",
            color: "#0a100d",
            border: "none",
            borderRadius: "6px",
            padding: "0.45rem 0.85rem",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            transition: "all 0.2s ease",
          }}
        >
          <Download size={14} /> Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            color: "#a4b0a8",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Dismiss app install prompt"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
