"use client";
import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Trash2 } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import { Title } from "@/components/ui/Title";
import { Summary } from "@/components/ui/Summary";

export function Cart() {
  const { count, cartItems, updateQuantity, removeFromCart } = useStore();

  return (
    <main className="page cream">
      <section className="section" style={{ paddingTop: "3rem" }}>
        <Title
          eyebrow="Your selection"
          title={
            <>
              A considered <i>choice.</i>
            </>
          }
        />
        {!count ? (
          <div className="empty-cart">
            <ShoppingBag />
            <h2>Your bag is ready when you are.</h2>
            <p>
              Explore the collection and add a piece to begin checkout.
            </p>
            <Link href="/shop" className="btn gold">
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {cartItems.map((item, idx) => (
                <article key={`${item.product}-${idx}`} className="cart-product">
                  <Link
                    href={`/product/${item.product}`}
                    style={{ display: "block", flex: "none" }}
                  >
                    <img src={item.image || "/placeholder.jpg"} alt={item.name} />
                  </Link>
                  <div>
                    <p>Fine Jewellery {item.size ? `· Size ${item.size}` : ""}</p>
                    <Link href={`/product/${item.product}`} style={{ color: "inherit" }}>
                      <h3>{item.name}</h3>
                    </Link>
                    <b>₹{item.price.toLocaleString("en-IN")}</b>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
                      <button onClick={() => updateQuantity(item.product, item.quantity - 1, item.size)}>−</button>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.quantity + 1, item.size)}>+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product, item.size)} style={{ cursor: "pointer" }}>
                    <Trash2 size={16} /> Remove
                  </button>
                </article>
              ))}
              <div className="saved-later">
                <Heart />
                <div>
                  <b>Saved pieces sync automatically</b>
                  <span>
                    Your cart items and saved wishlist pieces sync across all your devices when logged in.
                  </span>
                </div>
              </div>
            </div>
            <Summary />
          </div>
        )}
      </section>
    </main>
  );
}
