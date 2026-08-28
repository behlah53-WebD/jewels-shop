"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { products } from "@/lib/data";
import { useStore } from "@/components/context/StoreContext";

export function SearchOverlay() {
  const { setSearch, add } = useStore();
  const [q, setQ] = useState("");

  const handleClose = () => {
    setSearch(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Overlay title="Search the collection" close={handleClose}>
      <div className="search-input">
        <Search />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pieces, stones, stories"
        />
      </div>
      {q ? (
        <div className="search-results">
          {filteredProducts.map((p) => (
            <article key={p.id}>
              <Link
                href={`/product/${p.id}`}
                onClick={handleClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flex: 1,
                  color: "inherit",
                }}
              >
                <img src={p.image} alt={p.name} />
                <span>
                  {p.name}
                  <small>{p.price}</small>
                </span>
              </Link>
              <button onClick={add}>Add</button>
            </article>
          ))}
        </div>
      ) : (
        <div className="search-suggestions">
          Recent: <b>Emerald rings</b> <b>Bridal</b>
          <br />
          Trending: <b>Diamond pendants</b> <b>Gift guide</b>
        </div>
      )}
    </Overlay>
  );
}
