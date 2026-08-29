"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ZoomIn, ShoppingBag, Heart, CircleHelp, Sparkles, RefreshCw, ArrowLeft } from "lucide-react";
import { imgs, products as fallbackProducts } from "@/lib/data";
import { useStore } from "@/components/context/StoreContext";
import { Title } from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { Btn } from "@/components/ui/Btn";
import { Accordion } from "@/components/ui/Accordion";

import { useRouter } from "next/navigation";

import { useGetProductBySlugQuery } from "@/lib/redux/api/apiSlice";

export function Product({ slug }: { slug?: string }) {
  const router = useRouter();
  const { add, save, toggle, buyNow } = useStore();

  const [im, setIm] = useState(0);
  const [size, setSize] = useState("6");
  const [gift, setGift] = useState(false);

  const { data: productData, isLoading: loading } = useGetProductBySlugQuery(slug || "", { skip: !slug });

  const p = productData?.success && productData?.product ? productData.product : fallbackProducts[0];

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const ok = buyNow(p, 1, size);
    if (ok) {
      router.push("/checkout");
    }
  };

  const pCategory = p.category?.name || p.kind || "Jewellery";
  const pName = p.name || "Solenne Emerald-Cut Ring";
  const pPrice = typeof p.price === "number" ? `₹${p.price.toLocaleString()}` : p.price;
  const pImage = p.featuredImage || p.image || imgs.ring;
  const pGallery = p.images && p.images.length > 0 ? p.images : [pImage, imgs.ring, imgs.emerald];
  const pStock = p.stock !== undefined ? p.stock : 10;
  const isSaved = save.includes(p._id || p.id);

  return (
    <main className="page cream">
      <section className="product-detail">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="bread" style={{ margin: 0 }}>
            <Link href="/" className="hover:text-amber-800 transition-colors">Home</Link> / <Link href="/shop" className="hover:text-amber-800 transition-colors">{pCategory}</Link> / <span className="font-medium text-stone-900">{pName}</span>
          </div>
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.45rem 0.95rem",
              borderRadius: "6px",
              background: "#163a2b",
              color: "#f5efe3",
              border: "1px solid #235440",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: ".09em",
              textTransform: "uppercase",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#d5ad67";
              e.currentTarget.style.color = "#0a100d";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#163a2b";
              e.currentTarget.style.color = "#f5efe3";
            }}
          >
            <ArrowLeft size={13} /> Back to Shop
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin text-amber-900 mx-auto mb-2" size={32} />
            <p className="text-xs text-stone-500 font-medium">Loading piece specifications...</p>
          </div>
        ) : (
          <div className="product-layout">
            <div className="gallery">
              <div className="main-image">
                <img src={pGallery[im] || pImage} alt={pName} />
                <span>
                  <ZoomIn size={16} /> Click to zoom
                </span>
              </div>
              <div className="thumbs">
                {pGallery.map((x: string, i: number) => (
                  <button
                    onClick={() => setIm(i)}
                    className={i === im ? "active" : ""}
                    key={i}
                  >
                    <img src={x} alt={`${pName} view ${i + 1}`} />
                  </button>
                ))}
              </div>
              <div className="media-placeholders">
                <button>
                  ▻ Product film <small>Preview film</small>
                </button>
                <button>
                  360° Viewer <small>3D inspection</small>
                </button>
                <button>
                  AR try-on <small>Mobile AR</small>
                </button>
              </div>
            </div>

            <div className="product-copy">
              <p>
                {pCategory} · SKU {p.SKU || "AJ-001"}
              </p>
              <h1>{pName}</h1>
              <span className="review-empty text-amber-900 font-medium text-xs">
                Certified Fine Quality · Authenticity guaranteed
              </span>
              <h2>{pPrice}</h2>
              <p className="installment">
                Includes complimentary insured delivery & custom velvet presentation box.
              </p>
              <p className="stock">
                {pStock > 0 ? (
                  <span className="text-emerald-800">● In stock ({pStock} pieces available)</span>
                ) : (
                  <span className="text-rose-800">● Out of stock</span>
                )}
              </p>
              <p>{p.description}</p>

              <fieldset>
                <legend>Metal & purity</legend>
                {["18K Gold", "White Gold", "Rose Gold"].map((x) => (
                  <button key={x} className={p.material?.includes(x) ? "active" : ""}>
                    {x}
                  </button>
                ))}
              </fieldset>

              <fieldset>
                <legend>Ring / Item Size</legend>
                {["5", "6", "7", "8"].map((x) => (
                  <button
                    className={size === x ? "active" : ""}
                    onClick={() => setSize(x)}
                    key={x}
                  >
                    {x}
                  </button>
                ))}
                <Link href="/guide">Visual size guide →</Link>
              </fieldset>

              <div className="buy-row">
                <Btn className="gold" onClick={() => add(p, 1, size)}>
                  <ShoppingBag size={16} /> Add to bag
                </Btn>
                <button type="button" onClick={handleBuyNow} className="btn outline">
                  Buy now
                </button>
                <button
                  className="save"
                  onClick={() => toggle(p._id || p.id)}
                  aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>

              <label className="gift-line">
                <input
                  type="checkbox"
                  checked={gift}
                  onChange={(e) => setGift(e.target.checked)}
                />
                <Sparkles size={16} /> Add complimentary gift wrapping
              </label>
              {gift && (
                <textarea placeholder="Your personal gift message..." />
              )}

              <Accordion product={p} />
            </div>
          </div>
        )}
      </section>

      {/* Specifications Table */}
      {p.specifications && p.specifications.length > 0 && (
        <section className="section max-w-4xl mx-auto px-4 py-8">
          <Title eyebrow="Craft Details" title="Specifications & Gemstone Data" />
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden text-sm">
            <table className="w-full text-left">
              <tbody className="divide-y divide-stone-100">
                {p.specifications.map((spec: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-3 bg-stone-50 font-serif font-medium text-stone-700 w-1/3">
                      {spec.key}
                    </td>
                    <td className="p-3 text-stone-900">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
