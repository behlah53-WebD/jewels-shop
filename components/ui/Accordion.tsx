"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ product }: { product?: any }) {
  const [o, setO] = useState(0);

  const specSummary = product
    ? `${product.material || "18K recycled gold"} · ${
        product.specifications && product.specifications.length > 0
          ? product.specifications.map((s: any) => `${s.key}: ${s.value}`).join(" · ")
          : product.description?.substring(0, 100) || "Hand-finished in our Jaipur atelier."
      }`
    : "18K recycled gold · Emerald-cut laboratory-grown diamond · Hand-finished in our Jaipur atelier.";

  const rows = [
    ["Specifications", specSummary],
    [
      "Materials & certification",
      `Certified ${product?.material || "18K Gold"} piece. BIS Hallmarked and product-level provenance attached.`,
    ],
    [
      "Shipping, returns & warranty",
      "Complimentary insured shipping, 15-day return policy, and lifetime authenticity warranty.",
    ],
    ["Care", "Store separately in provided velvet box and clean with a soft, lint-free cloth."],
  ];

  return (
    <div className="accordion">
      {rows.map(([x, y], i) => (
        <div key={x}>
          <button onClick={() => setO(o === i ? -1 : i)}>
            {x}
            <ChevronDown className={o === i ? "up" : ""} />
          </button>
          {o === i && <p>{y}</p>}
        </div>
      ))}
    </div>
  );
}
