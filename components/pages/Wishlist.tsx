"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, RefreshCw } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import { Title } from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { products as fallbackProducts } from "@/lib/data";

export function Wishlist() {
  const { save } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products?limit=100");
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Wishlist product fetch error:", err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const savedProducts = products.filter((p) => {
    const pId = p._id?.toString() || p.id?.toString() || p.slug;
    return save.includes(pId);
  });

  return (
    <main className="page cream hero-lead">
      <section className="section" style={{ paddingTop: "6rem" }}>
        <Title
          eyebrow="Your Sanctuary"
          title={
            <>
              Saved <i>wishlist.</i>
            </>
          }
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <RefreshCw className="animate-spin text-amber-900 mx-auto mb-2" size={28} />
            <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Fetching your saved pieces...</p>
          </div>
        ) : savedProducts.length > 0 ? (
          <div className="product-grid">
            {savedProducts.map((p) => (
              <Card key={p._id || p.id || p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty-cart" style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <Heart size={44} style={{ color: "var(--gold)", margin: "0 auto 1rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.5rem" }}>
              Your wishlist is empty
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: "340px", margin: "0 auto 1.75rem", lineHeight: "1.6" }}>
              Explore the collection and tap the heart icon on any piece to save it to your personal wishlist.
            </p>
            <Link href="/shop" className="btn gold" style={{ display: "inline-flex" }}>
              Explore the Collection
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
