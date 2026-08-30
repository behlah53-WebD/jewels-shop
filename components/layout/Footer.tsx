"use client";
import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

export function Footer() {
  const refFooter = useScrollReveal({ threshold: 0.05 });

  return (
    <footer>
      <div
        className="footer-grid sr-stagger-slow"
        ref={refFooter as React.RefCallback<HTMLDivElement>}
      >
        <div className="sr-fade-up">
          <Logo />
          <p>Contemporary heirlooms, designed to become part of your story.</p>
        </div>
        <div className="sr-fade-up">
          <b>Discover</b>
          <Link href="/shop">Shop all pieces</Link>
          <Link href="/shop">Bridal collection</Link>
          <Link href="/contact">Bespoke jewellery</Link>
          <Link href="/journal">Journal</Link>
        </div>
        <div className="sr-fade-up">
          <b>Service</b>
          <Link href="/guide">Jewellery care</Link>
          <Link href="/guide">Size guide</Link>
          <Link href="/guide">Shipping &amp; returns</Link>
          <Link href="/contact">Contact the atelier</Link>
        </div>
        <div className="sr-fade-up">
          <b>Stay in the know</b>
          <p>Private previews, atelier notes, and new releases.</p>
          <div className="footer-social">
            <Instagram /> Instagram
          </div>
          <div className="payments">
            Payment methods appear only after your provider is connected.
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Aurelia Jewels. Preview catalogue.
        <span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/admin/login">Admin</Link>
        </span>
      </div>
    </footer>
  );
}
