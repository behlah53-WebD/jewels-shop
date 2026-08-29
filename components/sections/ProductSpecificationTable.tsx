"use client";

import React, { useEffect, useState } from "react";

const panel: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "3.5rem 1.5rem",
  color: "#143025",
  background: "#f5efe3",
};

export function ProductSpecificationTable({
  slug,
  product: initialProduct,
}: {
  slug?: string;
  product?: any;
}) {
  const [product, setProduct] = useState<any>(initialProduct || null);

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      return;
    }
    if (slug) {
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.product) {
            setProduct(data.product);
          }
        })
        .catch(() => {});
    }
  }, [slug, initialProduct]);

  // Determine active specifications
  let activeSpecs: [string, string][] = [];

  if (product?.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
    activeSpecs = product.specifications.map((s: any) => [s.key, s.value]);
  } else if (product) {
    // Dynamic specifications generated from actual product attributes
    const categoryName =
      typeof product.category === "object" && product.category?.name
        ? product.category.name
        : product.category || "Fine Jewellery";

    activeSpecs = [
      ["SKU", product.SKU || `AJ-P-${product._id?.substring(0, 6)?.toUpperCase() || "001"}`],
      ["Metal & Material", product.material || "18K Recycled Gold"],
      ["Category", categoryName],
      ["Collection", product.collectionName || "Aurelia Atelier Collection"],
      ["Price", `₹${product.price?.toLocaleString() || "0"}`],
      ["Availability", product.stock > 0 ? `In Stock (${product.stock} available)` : "Made to Order"],
      ["Origin", "Jaipur Atelier"],
      ["Certification & Hallmarking", "BIS Hallmarked & Certified Authentic"],
    ];
  } else {
    // Fallback static preview specs if loading
    const fallbackSpecs: Record<string, [string, string][]> = {
      solenne: [
        ["SKU", "AJ-R-001"],
        ["Metal", "18K recycled gold"],
        ["Stone", "Emerald-cut laboratory-grown diamond"],
        ["Setting", "Hand-set bezel and pavé halo"],
        ["Size", "US 5–8 preview selection"],
        ["Origin", "Jaipur atelier"],
        ["Documentation", "Attached to eligible live inventory"],
      ],
      celeste: [
        ["SKU", "AJ-E-002"],
        ["Metal", "18K recycled yellow gold"],
        ["Stone", "Pear-cut natural emerald"],
        ["Setting", "Three-prong claw setting"],
        ["Size", "One size"],
        ["Origin", "Jaipur atelier"],
        ["Documentation", "Attached to eligible live inventory"],
      ],
      verdant: [
        ["SKU", "AJ-B-003"],
        ["Metal", "18K recycled gold"],
        ["Stone", "Round brilliant-cut diamonds and emeralds"],
        ["Setting", "Four-prong basket setting"],
        ["Size", "6.5 – 7.5 inches preview selection"],
        ["Origin", "Jaipur atelier"],
        ["Documentation", "Attached to eligible live inventory"],
      ],
      lumina: [
        ["SKU", "AJ-P-004"],
        ["Metal", "18K recycled gold"],
        ["Stone", "Round brilliant-cut diamond"],
        ["Setting", "Bezel setting on trace chain"],
        ["Size", "16–18 inches adjustable"],
        ["Origin", "Jaipur atelier"],
        ["Documentation", "Attached to eligible live inventory"],
      ],
    };
    activeSpecs = fallbackSpecs[slug || ""] || fallbackSpecs.solenne;
  }

  return (
    <section style={panel}>
      <p
        style={{
          color: "#8d6a36",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".15em",
          textTransform: "uppercase",
        }}
      >
        Piece details
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2.4rem",
          fontWeight: 500,
        }}
      >
        Specification table
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fffaf0",
        }}
      >
        <tbody>
          {activeSpecs.map(([key, value], idx) => (
            <tr key={idx}>
              <th
                style={{
                  width: "35%",
                  padding: ".75rem",
                  border: "1px solid #c4b391",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                {key}
              </th>
              <td
                style={{
                  padding: ".75rem",
                  border: "1px solid #c4b391",
                  color: "#55675b",
                  fontSize: 13,
                }}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
