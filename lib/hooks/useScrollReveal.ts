"use client";
import { useEffect, useRef, useCallback } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, `data-visible="true"` is set on it,
 * allowing pure-CSS animations to trigger via attribute selectors.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.12, rootMargin = "0px 0px -48px 0px", once = true } = options;
  const ref = useRef<HTMLElement | null>(null);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
    },
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion — mark immediately visible, skip observer
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.removeAttribute("data-visible");
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return setRef;
}
