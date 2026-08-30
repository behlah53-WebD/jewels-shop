"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle, Search, ShoppingBag, Store, BookOpen, UserRound } from "lucide-react";
import { useStore } from "@/components/context/StoreContext";
import { Overlay } from "@/components/ui/Overlay";
import { Btn } from "@/components/ui/Btn";
import { imgs } from "@/lib/data";
import { Header } from "./Header";
import { Footer } from "./Footer";
import dynamic from "next/dynamic";
import { SafeImage } from "@/components/ui/SafeImage";

const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), { ssr: false });
const BagDrawer = dynamic(() => import("./BagDrawer").then((m) => m.BagDrawer), { ssr: false });
const AuthModal = dynamic(() => import("@/components/ui/AuthModal").then((m) => m.AuthModal), { ssr: false });


export function MainLayout({ children }: { children: React.ReactNode }) {
  const { menu, setMenu, search, setSearch, bag, setBag, count } = useStore();
  const [cookie, setCookie] = useState(true);
  const pathname = usePathname();

  // These pages are full-screen standalone — hide the global shell chrome
  const isStandalone = pathname?.startsWith("/account") || pathname?.startsWith("/admin");

  return (
    <>
      {!isStandalone && (
        <div className="announce">
          Complimentary insured delivery on orders over ₹50,000 <span>·</span>{" "}
          Discover the limited Élan collection <ArrowRight size={13} />
        </div>
      )}

      {!isStandalone && <Header />}

      {children}

      {!isStandalone && <Footer />}

      {menu && (
        <Overlay title="Discover the collection" close={() => setMenu(false)}>
          <div className="mega-grid">
            <div>
              <b>Shop by type</b>
              {[
                "Rings",
                "Necklaces",
                "Earrings",
                "Bracelets",
                "Pendants",
                "Bridal",
              ].map((x) => (
                <Link href="/shop" onClick={() => setMenu(false)} key={x}>
                  {x}
                </Link>
              ))}
            </div>
            <div>
              <b>Shop by story</b>
              {[
                "New arrivals",
                "The Élan edit",
                "Gifts under ₹1,00,000",
                "Anniversary",
                "Everyday icons",
              ].map((x) => (
                <Link href="/shop" onClick={() => setMenu(false)} key={x}>
                  {x}
                </Link>
              ))}
            </div>
            <div className="mega-feature" style={{ position: "relative" }}>
              <SafeImage src={imgs.emerald} alt="Emerald jewellery" fill sizes="300px" />
              <span>Featured / The verdant edit</span>
              <Link href="/shop" onClick={() => setMenu(false)}>
                Explore now →
              </Link>
            </div>
          </div>
        </Overlay>
      )}

      {search && <SearchOverlay />}
      {bag && <BagDrawer />}
      <AuthModal />

      {!isStandalone && (
        <a
          className="support"
          href="https://wa.me/?text=Hello%20Aurelia%20Jewels"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} /> Live support
        </a>
      )}

      {!isStandalone && cookie && (
        <div className="cookie">
          <p>
            <b>Your privacy, considered.</b> We use essential cookies to make
            this preview feel considered.
          </p>
          <Btn onClick={() => setCookie(false)}>Accept</Btn>
          <button onClick={() => setCookie(false)} suppressHydrationWarning={true}>Manage</button>
        </div>
      )}

      {!pathname?.startsWith("/admin") && (
        <nav className="mobile-nav">
          <Link href="/shop" prefetch={true} className={pathname === "/shop" ? "active" : ""}>
            <Store />
            Shop
          </Link>
          <Link href="/journal" prefetch={true} className={pathname === "/journal" ? "active" : ""}>
            <BookOpen />
            Journal
          </Link>
          <button onClick={() => setSearch(true)} suppressHydrationWarning={true}>
            <Search />
            Search
          </button>
          <button onClick={() => setBag(true)} suppressHydrationWarning={true}>
            <ShoppingBag />
            Bag {count > 0 ? `(${count})` : ""}
          </button>
          <Link href="/account" prefetch={true} className={pathname?.startsWith("/account") ? "active" : ""}>
            <UserRound />
            Account
          </Link>
        </nav>
      )}
    </>
  );
}
