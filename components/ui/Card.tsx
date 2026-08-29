import React, { memo } from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductType, imgs } from "@/lib/data";
import { useStore } from "@/components/context/StoreContext";

function CardComponent({ p }: { p: ProductType | any }) {
  const { add, save, toggle } = useStore();
  const id = p._id || p.id || p.slug;
  const isSaved = save.includes(id);
  const imgUrl = p.featuredImage || p.image || (p.images && p.images[0]) || imgs.ring;
  const productPrice = typeof p.price === "number" ? `₹${p.price.toLocaleString("en-IN")}` : p.price;
  const productKind = p.kind || (typeof p.category === "object" ? p.category?.name : p.category) || p.material || "Fine Jewellery";
  const productBadge = p.badge || (p.featured ? "Featured" : "");
  const productLink = `/product/${p.slug || id}`;

  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          href={productLink}
          prefetch={true}
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          <img src={imgUrl} alt={p.name} loading="lazy" decoding="async" />
        </Link>
        {productBadge && <em>{productBadge}</em>}
        <button className="save" onClick={() => toggle(id)} aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}>
          <Heart fill={isSaved ? "currentColor" : "none"} />
        </button>
        <button className="quick" onClick={() => add(p)}>
          Quick add <ShoppingBag size={15} />
        </button>
      </div>
      <p>{productKind}</p>
      <Link href={productLink} prefetch={true}>{p.name}</Link>
      <b>{productPrice}</b>
    </article>
  );
}

export const Card = memo(CardComponent);

