"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockKeyhole, AlertCircle, CheckCircle } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import { Logo } from "@/components/ui/Logo";
import { Title } from "@/components/ui/Title";
import { Btn } from "@/components/ui/Btn";
import { Summary } from "@/components/ui/Summary";
import { products as fallbackProducts } from "@/lib/data";

export function Checkout() {
  const router = useRouter();
  const { count, cartItems, clearCart } = useStore();
  const [user, setUser] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          if (data.user.addresses?.length > 0) {
            const def = data.user.addresses[0];
            setStreet(def.street || "");
            setCity(def.city || "");
            setState(def.state || "");
            setPostalCode(def.postalCode || "");
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkUser();
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/account");
      return;
    }

    setLoading(true);
    setError("");

    // Prepare order items using cartItems or fallback
    const sampleProduct = fallbackProducts[0];
    const orderItems =
      cartItems.length > 0
        ? cartItems.map((item) => ({
            product: item.product,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            size: item.size || "6",
          }))
        : [
            {
              product: undefined,
              name: sampleProduct.name,
              price: 186000,
              quantity: Math.max(count, 1),
              image: sampleProduct.image,
              size: "6",
            },
          ];

    const payload = {
      items: orderItems,
      shippingAddress: {
        name,
        street,
        city,
        state,
        postalCode,
        country: "India",
        phone,
      },
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to place order");
        setLoading(false);
        return;
      }

      clearCart();
      setSuccessMsg("Order placed successfully! Redirecting to your account order history...");
      setTimeout(() => {
        router.push("/account");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page checkout-page">
      <section className="checkout-head">
        <Logo />
        <p>Aurelia Insured Checkout</p>
      </section>
      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmitOrder}>
          <Title
            eyebrow="Checkout"
            title={
              <>
                Complete your <i>selection.</i>
              </>
            }
          />

          {!user && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-md mb-4">
              <LockKeyhole size={16} />
              <span>
                Please <Link href="/account" className="underline font-semibold">Sign In or Register</Link> to place your order.
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="checkout-items-summary" style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--ink)", marginBottom: "0.85rem" }}>
                Items in your order ({count})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", background: "#faf5ec", padding: "1.25rem", border: "1px solid #e4d9c8", borderRadius: "10px" }}>
                {cartItems.map((item, idx) => (
                  <div key={`${item.product}-${idx}`} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={item.image || "/placeholder.jpg"} alt={item.name} style={{ width: "56px", height: "64px", objectFit: "cover", borderRadius: "6px", border: "1px solid #d4c4a8", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#7a8578", marginTop: "0.15rem" }}>
                        Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3>Recipient & Contact</h3>
          <div className="two">
            <label>
              Full Name *
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Recipient name"
              />
            </label>
            <label>
              Phone *
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
          </div>

          <h3>Delivery Address</h3>
          <label>
            Street Address *
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="House, street, area"
            />
          </label>
          <div className="three">
            <label>
              City *
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>
            <label>
              State *
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </label>
            <label>
              Postal Code *
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </label>
          </div>

          <h3>Payment & Settlement</h3>
          <div className="payment-disabled text-stone-700 bg-amber-50/50 p-4 border border-amber-900/10 rounded-md text-xs">
            Orders created will record in MongoDB Atlas with status <i>Processing</i> and payment status <i>Pending</i>.
          </div>

          <Btn className="gold" type="submit" disabled={loading}>
            {loading ? "Placing order..." : user ? "Place Insured Order" : "Sign In to Place Order"}
          </Btn>
        </form>
        <Summary />
      </section>
    </main>
  );
}
