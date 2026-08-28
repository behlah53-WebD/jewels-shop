import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteContent extends Document {
  hero: {
    tagline: string;
    heading: string;
    subheading: string;
    ctaPrimaryText: string;
    ctaPrimaryLink: string;
    ctaSecondaryText: string;
    ctaSecondaryLink: string;
    image: string;
  };
  trustRow: Array<{
    title: string;
    subtitle: string;
  }>;
  limitedEdition: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  story: {
    eyebrow: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    steps: Array<{ title: string; subtitle: string }>;
  };
  bridalBanner: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  testimonials: Array<{
    name: string;
    location: string;
    quote: string;
    rating: number;
  }>;
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  footer: {
    brandingText: string;
    copyright: string;
    instagramUrl: string;
    pinterestUrl: string;
    facebookUrl: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    hero: {
      tagline: { type: String, default: "Aurelia Jewels · 2026 Collection" },
      heading: { type: String, default: "The art of becoming." },
      subheading: {
        type: String,
        default:
          "Contemporary heirlooms in gold, diamond, and vivid colour—made for the moments you keep.",
      },
      ctaPrimaryText: { type: String, default: "Explore the collection" },
      ctaPrimaryLink: { type: String, default: "/shop" },
      ctaSecondaryText: { type: String, default: "Create a bespoke piece" },
      ctaSecondaryLink: { type: String, default: "/contact" },
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90",
      },
    },
    trustRow: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
      },
    ],
    limitedEdition: {
      eyebrow: { type: String, default: "Limited edition" },
      title: { type: String, default: "The Élan edit." },
      description: {
        type: String,
        default:
          "A numbered collection inspired by the geometry of light, released in an intimate series.",
      },
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=85",
      },
      ctaText: { type: String, default: "View the exclusive edit" },
      ctaLink: { type: String, default: "/shop" },
    },
    story: {
      eyebrow: { type: String, default: "Crafted in chapters" },
      title: { type: String, default: "From sketch to story." },
      description: {
        type: String,
        default:
          "Each Aurelia piece starts with a considered line and finishes in the hands of a specialist maker.",
      },
      ctaText: { type: String, default: "Meet the atelier" },
      ctaLink: { type: String, default: "/about" },
      steps: [
        {
          title: { type: String, required: true },
          subtitle: { type: String, default: "" },
        },
      ],
    },
    bridalBanner: {
      eyebrow: { type: String, default: "For the promise" },
      title: { type: String, default: "Bridal, in your way." },
      description: {
        type: String,
        default:
          "Engagement rings, wedding bands, and meaningful markers created around your story.",
      },
      image: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=85",
      },
      ctaText: { type: String, default: "Discover bridal" },
      ctaLink: { type: String, default: "/shop?collection=bridal" },
    },
    testimonials: [
      {
        name: { type: String, required: true },
        location: { type: String, default: "" },
        quote: { type: String, required: true },
        rating: { type: Number, default: 5 },
      },
    ],
    contact: {
      email: { type: String, default: "concierge@aureliajewels.com" },
      phone: { type: String, default: "+91 98765 43210" },
      address: { type: String, default: "12 Mayfair Gardens, London & Mumbai" },
      hours: { type: String, default: "Mon - Sat: 10:00 AM - 7:00 PM IST" },
    },
    footer: {
      brandingText: {
        type: String,
        default:
          "Aurelia Jewels creates contemporary fine jewellery designed with timeless elegance, certified gemstones, and sustainable craft.",
      },
      copyright: { type: String, default: "© 2026 Aurelia Jewels. All rights reserved." },
      instagramUrl: { type: String, default: "https://instagram.com" },
      pinterestUrl: { type: String, default: "https://pinterest.com" },
      facebookUrl: { type: String, default: "https://facebook.com" },
    },
    seo: {
      metaTitle: {
        type: String,
        default: "Aurelia Jewels | High Fine Jewellery & Bespoke Design",
      },
      metaDescription: {
        type: String,
        default:
          "Explore handcrafted luxury jewellery, diamond rings, emerald drop earrings, and bespoke fine pieces at Aurelia Jewels.",
      },
      keywords: {
        type: String,
        default: "fine jewellery, diamond rings, gold necklaces, emerald earrings, bespoke luxury",
      },
    },
  },
  { timestamps: true }
);

export const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
