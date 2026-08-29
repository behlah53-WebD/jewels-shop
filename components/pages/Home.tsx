"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  LockKeyhole,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  Diamond,
  Star,
  Instagram,
} from "lucide-react";
import { imgs } from "@/lib/data";
import { defaultSiteContent } from "@/lib/defaults";
import { Title } from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { JournalTeaser } from "@/components/ui/JournalTeaser";
import { Faq } from "@/components/ui/Faq";
import { Newsletter } from "@/components/ui/Newsletter";

import {
  useGetSiteContentQuery,
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "@/lib/redux/api/apiSlice";

export function Home() {
  const [quiz, setQuiz] = useState(0);

  const { data: contentData } = useGetSiteContentQuery();
  const { data: prodData } = useGetProductsQuery("featured=true&limit=8");
  const { data: catData } = useGetCategoriesQuery();

  const siteContent = contentData?.success && contentData?.content ? contentData.content : defaultSiteContent;
  const products = prodData?.success && Array.isArray(prodData.products) ? prodData.products : [];
  const categories = catData?.success && Array.isArray(catData.categories) ? catData.categories : [];

  const hero = siteContent.hero || defaultSiteContent.hero;
  const trustRow = siteContent.trustRow || defaultSiteContent.trustRow;
  const limited = siteContent.limitedEdition || defaultSiteContent.limitedEdition;
  const story = siteContent.story || defaultSiteContent.story;
  const bridal = siteContent.bridalBanner || defaultSiteContent.bridalBanner;
  const testimonials = siteContent.testimonials || defaultSiteContent.testimonials;

  return (
    <main>
      {/* Dynamic Hero Section */}
      <section className="hero">
        <img src={hero.image || imgs.hero} alt="Gold and gemstone jewellery" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p>{hero.tagline}</p>
          <h1>{hero.heading}</h1>
          <span>{hero.subheading}</span>
          <div>
            <Link href={hero.ctaPrimaryLink || "/shop"} className="btn gold">
              {hero.ctaPrimaryText || "Explore the collection"} <ArrowRight size={16} />
            </Link>
            <Link href={hero.ctaSecondaryLink || "/contact"} className="btn ghost">
              {hero.ctaSecondaryText || "Create a bespoke piece"}
            </Link>
          </div>
          <small>↓ Discover the edit</small>
        </div>
      </section>

      {/* Trust Row Section */}
      <section className="trust-row">
        {[
          [BadgeCheck, trustRow[0]?.title || "Certified jewellery", trustRow[0]?.subtitle || "Authenticity documentation."],
          [LockKeyhole, trustRow[1]?.title || "Secure checkout", trustRow[1]?.subtitle || "Encrypted transactions."],
          [ShieldCheck, trustRow[2]?.title || "Insured delivery", trustRow[2]?.subtitle || "Carefully packaged dispatch."],
          [PackageCheck, trustRow[3]?.title || "Easy returns", trustRow[3]?.subtitle || "30-day return policy."],
        ].map(([Icon, title, subtitle]: any) => (
          <div key={title}>
            <Icon />
            <p>
              <b>{title}</b>
              {subtitle}
            </p>
          </div>
        ))}
      </section>

      {/* Dynamic Collection & Category Grid */}
      <section className="section cream">
        <Title
          eyebrow="The collection"
          title={
            <>
              Sculpted for a <i>life well lived.</i>
            </>
          }
        />
        <div className="category-grid">
          {(() => {
            const list = categories.length > 0 ? categories : [
              { name: "Rings", slug: "rings", image: imgs.ring },
              { name: "Earrings", slug: "earrings", image: imgs.emerald },
              { name: "Bracelets", slug: "bracelets", image: imgs.gold },
              { name: "Pendants", slug: "pendants", image: imgs.pearl },
            ];
            return list.map((c: any, i: number) => {
              const isTall = i === 0 && list.length > 2;
              const isWide = (list.length % 2 !== 0 && i === list.length - 1 && i !== 0);
              return (
                <Link
                  href={`/shop?category=${encodeURIComponent(c.slug || c.name)}`}
                  className={`category ${isTall ? "tall" : isWide ? "wide" : ""}`}
                  key={c._id || c.name}
                >
                  <img src={c.image || imgs.ring} alt={`${c.name} collection`} />
                  <b>{c.name}</b>
                  <span>Explore →</span>
                </Link>
              );
            });
          })()}
        </div>
      </section>

      {/* Dynamic Products Grid (New Arrivals / Featured) */}
      <section className="section deep">
        <Title
          eyebrow="New arrivals"
          title={
            <>
              The new <i>classics.</i>
            </>
          }
        />
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((p: any) => <Card key={p._id || p.id} p={p} />)
          ) : (
            <p className="text-stone-400 text-center py-8">Loading collection pieces...</p>
          )}
        </div>
      </section>

      {/* Discovery Section */}
      <section className="discovery">
        <div>
          <p>Discover by material</p>
          <h2>
            Every detail,
            <br />
            <i>considered.</i>
          </h2>
          <span>
            From responsibly chosen materials to the hand-polish, our pieces
            balance natural integrity with a distinctly modern point of view.
          </span>
        </div>
        <div className="discovery-cards">
          {[
            "Gold",
            "Rose gold",
            "White gold",
            "Platinum",
            "Silver",
            "Diamond",
            "Emerald",
            "Sapphire",
            "Pearl",
          ].map((x, i) => (
            <Link href={`/shop?material=${encodeURIComponent(x)}`} key={x}>
              <span>0{i + 1}</span>
              {x}
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      </section>

      {/* Limited Edition Banner */}
      <section className="limited">
        <img src={limited.image || imgs.bridal} alt="Limited collection" />
        <div>
          <p>{limited.eyebrow}</p>
          <h2>{limited.title}</h2>
          <span>{limited.description}</span>
          <Link href={limited.ctaLink || "/shop"} className="btn gold">
            {limited.ctaText}
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="section cream story">
        <div>
          <p>{story.eyebrow}</p>
          <h2>{story.title}</h2>
          <span>{story.description}</span>
          <Link href={story.ctaLink || "/about"}>{story.ctaText} →</Link>
        </div>
        <ol>
          {(story.steps || [
            { title: "Stone selection" },
            { title: "Hand-set precision" },
            { title: "Final illumination" },
          ]).map((step: any, i: number) => (
            <li key={step.title}>
              <span>0{i + 1}</span>
              {step.title}
            </li>
          ))}
        </ol>
      </section>

      {/* Interactive Style Quiz */}
      <section className="quiz">
        <div>
          <p>Style discovery</p>
          <h2>
            Find your signature <i>piece.</i>
          </h2>
          <span>Answer a few considered questions for a starting point.</span>
        </div>
        <div className="quiz-box">
          <b>What does luxury mean to you?</b>
          {["Quiet brilliance", "A bold signature", "Heirloom romance"].map((x, i) => (
            <button
              onClick={() => setQuiz(i)}
              className={quiz === i ? "selected" : ""}
              key={x}
            >
              {x}
              <ArrowRight size={16} />
            </button>
          ))}
          <small>
            Your edit:{" "}
            <strong>
              {
                ["Celeste Emerald Drops", "Verdant Tennis Bracelet", "Solenne Emerald-Cut Ring"][quiz]
              }
            </strong>
          </small>
        </div>
      </section>

      {/* Bridal Banner */}
      <section className="bridal">
        <img src={bridal.image || imgs.bridal} alt="Bridal jewellery" />
        <div>
          <p>{bridal.eyebrow}</p>
          <h2>{bridal.title}</h2>
          <span>{bridal.description}</span>
          <Link href={bridal.ctaLink || "/shop?collection=bridal"} className="btn ghost">
            {bridal.ctaText}
          </Link>
        </div>
      </section>

      {/* Craft Promise */}
      <section className="craft">
        <div>
          <Sparkles />
          <p>The Aurelia promise</p>
          <h2>
            Made for the <i>only once.</i>
          </h2>
          <span>
            Bring a memory, a stone, or simply an idea. We will turn it into something that belongs to you.
          </span>
          <Link href="/contact" className="btn gold">
            Begin your commission
          </Link>
        </div>
        <img src={imgs.hero} alt="Aurelia craftsmanship" />
      </section>

      {/* Authenticity Section */}
      <section className="section deep">
        <Title
          eyebrow="Authenticity, always"
          title={
            <>
              Proof of a more <i>precious</i> standard.
            </>
          }
        />
        <div className="cert-grid">
          {[
            "Responsible material pathways",
            "Diamond and gemstone disclosure",
            "Craft and quality inspection",
            "Lifetime care conversation",
          ].map((x, i) => (
            <div key={x}>
              <Diamond />
              <span>0{i + 1}</span>
              <b>{x}</b>
              <p>Documentation and guidance attached to eligible live products.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section cream">
        <Title
          eyebrow="The Aurelia community"
          title={
            <>
              Stories from our <i>patrons.</i>
            </>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          {testimonials.map((t: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-amber-900/10 shadow-sm">
              <div className="flex text-amber-500 mb-2">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-stone-800 text-sm mb-4">"{t.quote}"</p>
              <div className="text-xs text-stone-500 font-medium">
                <span className="text-amber-950 font-semibold">{t.name}</span> · {t.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      <JournalTeaser />
      <Faq />
      <Newsletter />
    </main>
  );
}
