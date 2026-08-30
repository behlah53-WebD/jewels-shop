"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import { SafeImage } from "@/components/ui/SafeImage";

export function BagDrawer() {
  const { count, cartItems, setBag, removeFromCart, proceedToCheckout } = useStore();

  const handleClose = () => {
    setBag(false);
  };

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!proceedToCheckout()) {
      e.preventDefault();
    } else {
      handleClose();
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <div className="overlay cart-overlay">
      <div className="cart-drawer">
        <button className="icon close" onClick={handleClose} aria-label="Close bag drawer">
          <X />
        </button>
        <p>Your selection ({count})</p>

        {cartItems.length > 0 ? (
          <>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.product}-${idx}`}
                  className="drawer-item"
                  style={{ display: "flex", gap: "1rem", color: "inherit", alignItems: "center", position: "relative" }}
                >
                  <div style={{ position: "relative", width: "60px", height: "60px", flexShrink: 0, borderRadius: "4px", overflow: "hidden" }}>
                    <SafeImage src={item.image} alt={item.name} fill sizes="80px" />
                  </div>
                  <span style={{ flex: 1 }}>
                    {item.name}
                    <small>
                      Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}
                    </small>
                    <b>₹{(item.price * item.quantity).toLocaleString("en-IN")}</b>
                  </span>
                  <button
                    onClick={() => removeFromCart(item.product, item.size)}
                    style={{ background: "transparent", border: 0, color: "#a4b0a8", cursor: "pointer", padding: "4px" }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "#e1bc71" }}>
                <span>Subtotal</span>
                <b>₹{subtotal.toLocaleString("en-IN")}</b>
              </div>
              <Link href="/checkout" className="btn gold" onClick={handleCheckoutClick} style={{ width: "100%", justifyContent: "center" }}>
                Continue to checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="drawer-empty">
            <ShoppingBag />
            <b>Your selection is waiting.</b>
            <span>Pieces you add appear here and sync to your account.</span>
            <Link href="/shop" className="btn gold" onClick={handleClose}>
              Explore jewellery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
