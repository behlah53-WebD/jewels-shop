import React from "react";
import { imgs } from "@/lib/data";
import { Newsletter } from "@/components/ui/Newsletter";

export function Journal() {
  const articles = [
    "The quiet geometry of an emerald cut",
    "A guide to wearing gold every day",
    "Five ways to make a gift feel personal",
    "The little rituals of jewellery care",
    "A modern approach to bridal styling",
    "What to know about gemstone colour",
  ];

  return (
    <main className="page cream hero-lead">
      <section className="journal-hero">
        <img src={imgs.emerald} alt="Aurelia journal" />
        <div>
          <p>The Aurelia journal</p>
          <h1 className="text-white">
            Notes for a life <i>well adorned.</i>
          </h1>
          <span className="text-white">
            Stories of craft, material, giving, and the moments that collect
            around a piece.
          </span>
        </div>
      </section>
      <section className="section">
        <div className="journal-tools">
          <input placeholder="Search the journal" />
          <div>
            {[
              "All stories",
              "Care",
              "Styling",
              "Bridal",
              "Gemstones",
              "Craft",
            ].map((x) => (
              <button key={x}>{x}</button>
            ))}
          </div>
        </div>
        <article className="featured-article">
          <img src={imgs.hero} alt="Featured article" />
          <div>
            <p>Featured story · Craft</p>
            <h2>
              What makes a piece feel <i>personal?</i>
            </h2>
            <span>
              A considered look at choices and moments that turn jewellery into
              an heirloom.
            </span>
            <button>Read the preview →</button>
          </div>
        </article>
        <div className="article-grid">
          {articles.map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <p>Editorial</p>
              <h2>{x}</h2>
              <small>
                Article content and author profiles are managed from your live
                CMS.
              </small>
              <button>Open story →</button>
            </article>
          ))}
        </div>
        <Newsletter />
      </section>
    </main>
  );
}
