"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { imgs } from "@/lib/data";
import { Title } from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { Faq } from "@/components/ui/Faq";
import { SafeImage } from "@/components/ui/SafeImage";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useMemo } from "react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/redux/api/apiSlice";

export function Shop() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams ? searchParams.get("category") : null;
  const materialQuery = searchParams ? searchParams.get("material") : null;
  const collectionQuery = searchParams ? searchParams.get("collection") : null;
  const searchQuery = searchParams ? searchParams.get("search") : null;

  const [activeFilter, setActiveFilter] = useState(categoryQuery || "All pieces");
  const [list, setList] = useState(false);

  useEffect(() => {
    if (categoryQuery) {
      setActiveFilter(categoryQuery);
    }
  }, [categoryQuery]);

  // Construct query string memoized
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (activeFilter && activeFilter !== "All pieces") {
      params.set("category", activeFilter);
    }
    if (materialQuery) params.set("material", materialQuery);
    if (collectionQuery) params.set("collection", collectionQuery);
    if (searchQuery) params.set("search", searchQuery);
    return params.toString();
  }, [activeFilter, materialQuery, collectionQuery, searchQuery]);

  const { data: prodData, isLoading: prodLoading } = useGetProductsQuery(queryString);
  const { data: catData } = useGetCategoriesQuery();

  const products = prodData?.success && Array.isArray(prodData.products) ? prodData.products : [];
  const categories = catData?.success && Array.isArray(catData.categories) ? catData.categories : [];
  const loading = prodLoading;

  const selectedCatObj = useMemo(
    () =>
      categories.find(
        (c: any) =>
          (c.slug && c.slug.toLowerCase() === activeFilter.toLowerCase()) ||
          (c.name && c.name.toLowerCase() === activeFilter.toLowerCase())
      ),
    [categories, activeFilter]
  );

  const activeFilterDisplay = selectedCatObj ? selectedCatObj.name : activeFilter;

  // Scroll-reveal refs
  const refGrid    = useScrollReveal();
  const refGuide   = useScrollReveal();

  return (
    <main className="page cream hero-lead">
      <section className="collection-hero" style={{ position: "relative" }}>
        <SafeImage src={imgs.gold} alt="Aurelia collection" fill priority sizes="100vw" />
        <div>
          <p>Collection / {activeFilterDisplay}</p>
          
          <h1 className="text-white">
            The modern <i>heirloom.</i>
          </h1>
          <span className="text-white">
            Designed to hold a place in your life, and then in someone else's.
          </span>
        </div>
      </section>
      <section className="section">
        <div className="bread">Home / Shop / {activeFilterDisplay}</div>
        <div className="shop-head">
          <Title
            eyebrow="The fine collection"
            title="Discover your next piece."
          />
          <p>
            Explore handcrafted fine jewellery certified with ethical gemstones and 18K solid gold.
          </p>
        </div>
        <div className="toolbar">
          <button>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="chips">
            <button
              onClick={() => setActiveFilter("All pieces")}
              className={activeFilter === "All pieces" ? "active" : ""}
            >
              All pieces
            </button>
            {categories.map((cat: any) => {
              const catVal = cat.slug || cat.name;
              const isSelected =
                activeFilter.toLowerCase() === catVal.toLowerCase() ||
                (cat.name && activeFilter.toLowerCase() === cat.name.toLowerCase());
              return (
                <button
                  onClick={() => setActiveFilter(catVal)}
                  className={isSelected ? "active" : ""}
                  key={cat._id || cat.name}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
          <div>
            <button
              onClick={() => setList(false)}
              className={!list ? "active" : ""}
            >
              Grid
            </button>
            <button
              onClick={() => setList(true)}
              className={list ? "active" : ""}
            >
              List
            </button>
          </div>
        </div>
        <p className="count">
          {products.length} fine pieces available in edit
        </p>

        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="animate-spin text-amber-900 mx-auto mb-2" size={28} />
            <p className="text-xs text-stone-500 font-medium">Fetching fine jewellery collection...</p>
          </div>
        ) : (
          <div
            className={`${list ? "product-list" : "product-grid light-grid"} sr-stagger`}
            ref={refGrid as React.RefCallback<HTMLDivElement>}
            data-visible
          >
            {products.map((p: any) => (
              <div key={p._id || p.id} className="sr-scale-up">
                <Card p={p} />
              </div>
            ))}
          </div>
        )}

        <section
          className="buying-guide"
          ref={refGuide as React.RefCallback<HTMLElement>}
        >
          <div className="sr-fade-right">
            <p>Buying guide</p>
            <h2>
              Choose with <i>confidence.</i>
            </h2>
          </div>
          <div className="sr-fade-up">
            <b>Metal and purity</b>
            <span>Learn about hue, durability, and everyday character.</span>
            <Link href="/guide">Explore metals →</Link>
          </div>
          <div className="sr-fade-up">
            <b>Size and fit</b>
            <span>
              Use our visual guide to find the proportions that feel natural.
            </span>
            <Link href="/guide">Find your fit →</Link>
          </div>
        </section>

        <Faq />
      </section>
    </main>
  );
}
