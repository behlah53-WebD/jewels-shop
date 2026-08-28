"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion() {
  const [o, setO] = useState(0);
  const rows = [
    [
      "Specifications",
      "18K recycled gold · Emerald-cut laboratory-grown diamond · Hand-finished in our Jaipur atelier.",
    ],
    [
      "Materials & certification",
      "Product-level provenance and certification documents are ready to be attached to live catalogue data.",
    ],
    [
      "Shipping, returns & warranty",
      "Set regional policy, insured carrier, and warranty terms before accepting an order.",
    ],
    ["Care", "Store separately and use a soft, lint-free cloth."],
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
