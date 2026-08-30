"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, UserRound, Heart, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/components/context/StoreContext";

export function Header() {
  const { count, save, setMenu, setSearch, setBag } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isNavDark = pathname
    ? ["/product", "/cart", "/checkout", "/account", "/contact", "/guide", "/wishlist"].some((path) =>
        pathname.startsWith(path)
      )
    : false;

  let headerClass = "header";
  if (scrolled) {
    headerClass = "header solid";
  } else if (isNavDark) {
    headerClass = "header nav-dark";
  }

  return (
    <header className={headerClass}>
      <div className="header-inner">
        <button className="icon" onClick={() => setMenu(true)} aria-label="Open navigation menu" suppressHydrationWarning={true}>
          <Menu />
        </button>
        <Logo />
        <nav>
          <Link href="/shop" prefetch={true}>Shop</Link>
          <Link href="/shop?collection=bridal" prefetch={true}>Collections</Link>
          <Link href="/contact" prefetch={true}>Bespoke</Link>
          <Link href="/journal" prefetch={true}>Journal</Link>
          <Link href="/about" prefetch={true}>Our world</Link>
        </nav>
        <div className="header-actions">
          <button className="icon" onClick={() => setSearch(true)} aria-label="Open search box" suppressHydrationWarning={true}>
            <Search />
          </button>
          <Link className="icon" href="/account" prefetch={true} aria-label="Account">
            <UserRound />
          </Link>
          <Link className="icon" href="/wishlist" prefetch={true} aria-label="Wishlist">
            <Heart />
            <small>{save.length}</small>
          </Link>
          <button className="icon" onClick={() => setBag(true)} aria-label="Open shopping bag" suppressHydrationWarning={true}>
            <ShoppingBag />
            <small>{count}</small>
          </button>
        </div>
      </div>
    </header>
  );
}
