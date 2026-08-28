"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { imgs } from "@/lib/data";
import { Title } from "@/components/ui/Title";
import { Card } from "@/components/ui/Card";
import { Faq } from "@/components/ui/Faq";

export function Shop() {
  const searchParams = useSearchParams();
  const categoryQuery = searchParams ? searchParams.get("category") : null;
  const materialQuery = searchParams ? searchParams.get("material") : null;
  const collectionQuery = searchParams ? searchParams.get("collection") : null;
  const searchQuery = searchParams ? searchParams.get("search") : null;

  const [activeFilter, setActiveFilter] = useState(categoryQuery || "All pieces");
  const [list, setList] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categoryQuery, materialQuery, collectionQuery, searchQuery, activeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "/api/products?";
      const params = new URLSearchParams();

      if (activeFilter && activeFilter !== "All pieces") {
        params.set("category", activeFilter);
      } else if (categoryQuery) {
        params.set("category", categoryQuery);
      }

      if (materialQuery) params.set("material", materialQuery);
      if (collectionQuery) params.set("collection", collectionQuery);
      if (searchQuery) params.set("search", searchQuery);

      const [prodRes, catRes] = await Promise.all([
        fetch(url + params.toString()).then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);

      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (catRes.success && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (err) {
      console.error("Shop fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page cream hero-lead">
      <section className="collection-hero">
        <img src={imgs.gold} alt="Aurelia collection" />
        <div>
          <p>Collection / {activeFilter}</p>
          <h1>
            The modern <i>heirloom.</i>
          </h1>
          <span>
            Designed to hold a place in your life, and then in someone else's.
          </span>
        </div>
      </section>
      <section className="section">
        <div className="bread">Home / Shop / {activeFilter}</div>
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
            {categories.map((cat) => (
              <button
                onClick={() => setActiveFilter(cat.slug || cat.name)}
                className={
                  activeFilter.toLowerCase() === (cat.slug || cat.name).toLowerCase()
                    ? "active"
                    : ""
                }
                key={cat._id || cat.name}
              >
                {cat.name}
              </button>
            ))}
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
          <div className={list ? "product-list" : "product-grid light-grid"}>
            {products.map((p) => (
              <Card key={p._id || p.id} p={p} />
            ))}
          </div>
        )}

        <section className="buying-guide">
          <div>
            <p>Buying guide</p>
            <h2>
              Choose with <i>confidence.</i>
            </h2>
          </div>
          <div>
            <b>Metal and purity</b>
            <span>Learn about hue, durability, and everyday character.</span>
            <Link href="/guide">Explore metals →</Link>
          </div>
          <div>
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
