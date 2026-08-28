"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Title } from "./Title";

export function Faq() {
  const [o, setO] = useState(0);
  const a = [
    [
      "How do I find my ring size?",
      "Use the visual size guide as a starting point, then consult your specialist for a final fit before live purchase.",
    ],
    [
      "Will every item include certification?",
      "Attach documentation per eligible product when you connect your verified inventory.",
    ],
    [
      "Can I commission something bespoke?",
      "Yes. Use the contact route to begin a preview enquiry, then connect your real support workflow.",
    ],
    [
      "Where do you deliver?",
      "Delivery regions, rates, and insurance coverage should be configured with your live fulfillment provider.",
    ],
  ];

  return (
    <section className="faq">
      <Title
        eyebrow="Helpful details"
        title={
          <>
            Questions, <i>considered.</i>
          </>
        }
      />
      <div>
        {a.map(([x, y], i) => (
          <article key={x}>
            <button onClick={() => setO(o === i ? -1 : i)}>
              {x}
              <ChevronDown className={o === i ? "up" : ""} />
            </button>
            {o === i && <p>{y}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
