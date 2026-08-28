import React from "react";
import { Faq } from "@/components/ui/Faq";

export function Guide() {
  return (
    <main className="page cream hero-lead">
      <section className="guide-hero">
        <p>Aurelia guides</p>
        <h1>
          Considered answers, <i>always.</i>
        </h1>
        <span>
          Explore care, sizing, materials, shipping, gifting, and the basics of
          choosing a piece that stays with you.
        </span>
      </section>
      <section className="section">
        <div className="guide-grid">
          {[
            "Jewellery care",
            "Size & fit",
            "Metals",
            "Gemstones",
            "Gifting",
            "Shipping & returns",
            "Authenticity",
            "Bespoke commissions",
          ].map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <h2>{x}</h2>
              <p>
                Clear editorial guidance will be maintained in your live content
                system.
              </p>
              <button>Read guide →</button>
            </article>
          ))}
        </div>
        <Faq />
      </section>
    </main>
  );
}
