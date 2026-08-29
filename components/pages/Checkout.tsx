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

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      setTimeout(() => resolve(!!(window as any).Razorpay), 1500);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function Checkout() {
  const router = useRouter();
  const { count, cartItems, clearCart } = useStore();
  const [user, setUser] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
          setEmail(data.user.email || "");
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
    loadRazorpayScript();
  }, []);

  const verifyAndCreateOrder = async (
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
    orderItems: any[],
    address: any
  ) => {
    try {
      const res = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          items: orderItems,
          shippingAddress: address,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Payment verification failed");
        setLoading(false);
        return;
      }

      clearCart();
      setSuccessMsg("Payment verified! Order placed successfully. Redirecting to your account...");
      setTimeout(() => {
        router.push("/account");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to verify payment");
      setLoading(false);
    }
  };

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
            price: typeof item.price === "number" ? item.price : parseFloat(String(item.price || 0)) || 0,
            quantity: typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity || 1), 10) || 1,
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

    const shippingAddress = {
      name,
      email,
      street,
      city,
      state,
      postalCode,
      country: "India",
      phone,
    };

    try {
      // 1. Create Razorpay order on backend
      const createRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        setError(createData.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout popup if real API key configured
      if (!createData.isSimulated && createData.key && !createData.key.includes("YourKeyId")) {
        const isScriptLoaded = await loadRazorpayScript();
        if (isScriptLoaded && typeof window !== "undefined" && (window as any).Razorpay) {
          const options = {
            key: createData.key,
            amount: createData.amount,
            currency: createData.currency || "INR",
            name: "Aurelia Fine Jewellery",
            description: "Fine Jewellery Order Settlement",
            order_id: createData.orderId,
            handler: async function (response: any) {
              await verifyAndCreateOrder(
                response.razorpay_payment_id || `pay_${Date.now()}`,
                response.razorpay_order_id || createData.orderId,
                response.razorpay_signature || "signature_verified",
                orderItems,
                shippingAddress
              );
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              },
            },
            prefill: {
              name,
              contact: phone,
              email: email || user.email,
            },
            theme: {
              color: "#122019",
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (resp: any) {
            setError(resp.error?.description || "Payment failed or cancelled");
            setLoading(false);
          });
          rzp.open();
          return;
        }
      }

      // Fallback simulation if external script loading is blocked or keys omitted
      await verifyAndCreateOrder(
        `pay_test_${Date.now()}`,
        createData.orderId || `order_test_${Date.now()}`,
        "test_signature_verified",
        orderItems,
        shippingAddress
      );
    } catch (err: any) {
      setError(err.message || "Payment initialization failed");
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

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-md mb-4 font-medium">
              <CheckCircle size={16} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="checkout-items-summary">
              <h3>Items in your order ({count})</h3>
              <div className="checkout-items-list">
                {cartItems.map((item, idx) => (
                  <div key={`${item.product}-${idx}`} className="checkout-item-row">
                    <img src={item.image || "/placeholder.jpg"} alt={item.name} />
                    <div className="checkout-item-details">
                      <div className="checkout-item-title">{item.name}</div>
                      <div className="checkout-item-meta">
                        Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}
                      </div>
                    </div>
                    <div className="checkout-item-price">
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
              Email Address for Invoice Delivery *
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label style={{ marginTop: "0.75rem" }}>
            Phone *
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </label>

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
            Razorpay Test Mode Active: Secure signature verification on backend. Verified orders are recorded in MongoDB Atlas with status <i>Paid</i>.
          </div>

          <Btn className="gold" type="submit" disabled={loading}>
            {loading ? "Processing Payment..." : user ? "Pay with Razorpay (Test Mode)" : "Sign In to Pay"}
          </Btn>
        </form>
        <Summary />
      </section>
    </main>
  );
}
