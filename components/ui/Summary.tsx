"use client";
import React from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";

export function Summary() {
  const { cartItems, count, proceedToCheckout } = useStore();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) || (count ? 186000 : 0);

  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!proceedToCheckout()) {
      e.preventDefault();
    }
  };

  return (
    <aside className="summary">
      <p>Order summary</p>
      <div className="progress">
        <span />
        Complimentary insured delivery included
      </div>
      <label>
        Coupon code
        <input placeholder="Enter code" />
        <button>Apply</button>
      </label>
      <label>
        Gift card
        <input placeholder="Enter card number" />
        <button>Apply</button>
      </label>
      <label className="gift-line">
        <input type="checkbox" /> Add signature gift box
      </label>
      <dl>
        <dt>Subtotal</dt>
        <dd>₹{subtotal.toLocaleString("en-IN")}</dd>
        <dt>Taxes & Shipping</dt>
        <dd>Complimentary</dd>
      </dl>
      <Link href="/checkout" className="btn gold" onClick={handleCheckoutClick} style={{ width: "100%", justifyContent: "center" }}>
        Proceed to Checkout
      </Link>
      <div className="secure">
        <LockKeyhole /> Encrypted 256-bit SSL transaction.
      </div>
    </aside>
  );
}
