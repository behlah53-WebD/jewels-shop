import { imgs } from "@/lib/data";

export const defaultSiteContent = {
  hero: {
    tagline: "Aurelia Jewels · 2026 Collection",
    heading: "The art of becoming.",
    subheading:
      "Contemporary heirlooms in gold, diamond, and vivid colour—made for the moments you keep.",
    ctaPrimaryText: "Explore the collection",
    ctaPrimaryLink: "/shop",
    ctaSecondaryText: "Create a bespoke piece",
    ctaSecondaryLink: "/contact",
    image: imgs.hero,
  },
  trustRow: [
    { title: "Certified jewellery", subtitle: "Authenticity documentation with every piece." },
    { title: "Secure checkout", subtitle: "Encrypted transactions & buyer protection." },
    { title: "Insured delivery", subtitle: "Carefully packaged and insured dispatch." },
    { title: "Easy returns", subtitle: "Complimentary return policy within 30 days." },
  ],
  limitedEdition: {
    eyebrow: "Limited edition",
    title: "The Élan edit.",
    description:
      "A numbered collection inspired by the geometry of light, released in an intimate series.",
    image: imgs.bridal,
    ctaText: "View the exclusive edit",
    ctaLink: "/shop",
  },
  story: {
    eyebrow: "Crafted in chapters",
    title: "From sketch to story.",
    description:
      "Each Aurelia piece starts with a considered line and finishes in the hands of a specialist maker.",
    ctaText: "Meet the atelier",
    ctaLink: "/about",
    steps: [
      { title: "Stone selection", subtitle: "Ethically sourced diamonds & gemstones" },
      { title: "Hand-set precision", subtitle: "Master artisan setting and polishing" },
      { title: "Final illumination", subtitle: "Rigorous quality review & certification" },
    ],
  },
  bridalBanner: {
    eyebrow: "For the promise",
    title: "Bridal, in your way.",
    description:
      "Engagement rings, wedding bands, and meaningful markers created around your story.",
    image: imgs.bridal,
    ctaText: "Discover bridal",
    ctaLink: "/shop?collection=bridal",
  },
  testimonials: [
    {
      name: "Eleanor Vance",
      location: "London",
      quote: "The emerald ring from Aurelia is exquisite. The craftsmanship and brilliance are unparalleled.",
      rating: 5,
    },
    {
      name: "Sophia Martinez",
      location: "New York",
      quote: "Bespoke service at its finest. They brought my vision to life for our 10th anniversary.",
      rating: 5,
    },
  ],
  contact: {
    email: "concierge@aureliajewels.com",
    phone: "+91 98765 43210",
    address: "12 Mayfair Gardens, London & Mumbai",
    hours: "Mon - Sat: 10:00 AM - 7:00 PM IST",
  },
  footer: {
    brandingText:
      "Aurelia Jewels creates contemporary fine jewellery designed with timeless elegance, certified gemstones, and sustainable craft.",
    copyright: "© 2026 Aurelia Jewels. All rights reserved.",
    instagramUrl: "https://instagram.com",
    pinterestUrl: "https://pinterest.com",
    facebookUrl: "https://facebook.com",
  },
  seo: {
    metaTitle: "Aurelia Jewels | High Fine Jewellery & Bespoke Design",
    metaDescription:
      "Explore handcrafted luxury jewellery, diamond rings, emerald drop earrings, and bespoke fine pieces at Aurelia Jewels.",
    keywords: "fine jewellery, diamond rings, gold necklaces, emerald earrings, bespoke luxury",
  },
};
