import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}
import { User } from "../lib/models/User";
import { Category } from "../lib/models/Category";
import { Product } from "../lib/models/Product";
import { SiteContent } from "../lib/models/SiteContent";
import { imgs, products as defaultProducts } from "../lib/data";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Behlahjewels:Behlah786@cluster0.blbwshk.mongodb.net/?appName=Cluster0";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "aurelia_jewels";

const ADMIN_NAME = process.env.ADMIN_NAME || "Aurelia Curator";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aureliajewels.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminSecurePassword2026!";

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌ Error: MONGODB_URI environment variable is missing.");
    console.error("Please add MONGODB_URI=your_mongodb_connection_string to your .env file.");
    process.exit(1);
  }

  console.log("⏳ Connecting to MongoDB Atlas...");
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {}
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log("✅ Connected to MongoDB database:", MONGODB_DB_NAME);

  // 1. Seed First Admin Account
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    console.log(`ℹ️ Admin user (${ADMIN_EMAIL}) already exists.`);
  } else {
    console.log(`🔑 Creating initial admin user (${ADMIN_EMAIL})...`);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "admin",
      phone: "+91 98765 00000",
    });
    console.log(`✅ Admin account created successfully! Login email: ${ADMIN_EMAIL}`);
  }

  // 2. Seed Default Categories
  console.log("🏷️ Seeding Categories...");
  const categorySeeds = [
    { name: "Rings", slug: "rings", description: "Solitary emerald cut and diamond bands.", image: imgs.ring },
    { name: "Earrings", slug: "earrings", description: "Vibrant emerald teardrops and diamond drops.", image: imgs.emerald },
    { name: "Bracelets", slug: "bracelets", description: "Tennis bracelets and hand-polished cuffs.", image: imgs.gold },
    { name: "Pendants", slug: "pendants", description: "Statement diamond & gemstone pendants.", image: imgs.pearl },
  ];

  const categoryMap: Record<string, any> = {};
  for (const catSeed of categorySeeds) {
    let cat = await Category.findOne({ slug: catSeed.slug });
    if (!cat) {
      cat = await Category.create(catSeed);
    }
    categoryMap[catSeed.name] = cat._id;
  }
  console.log("✅ Categories seeded!");

  // 3. Seed Default Products
  console.log("💎 Seeding Fine Products...");
  const productSeeds = [
    {
      name: "Solenne Emerald-Cut Ring",
      slug: "solenne",
      description: "A singular emerald-cut silhouette designed for the quiet confidence of a lifelong promise.",
      shortDescription: "A singular emerald-cut silhouette in 18K solid gold.",
      price: 186000,
      compareAtPrice: 195000,
      category: categoryMap["Rings"],
      material: "18K Gold",
      collectionName: "Bridal",
      images: [imgs.ring, imgs.hero, imgs.gold],
      featuredImage: imgs.ring,
      stock: 12,
      SKU: "AJ-R-001",
      tags: ["Ring", "Emerald-cut", "Gold", "Bestseller"],
      featured: true,
      active: true,
      specifications: [
        { key: "Center Stone", value: "2.5ct Emerald-Cut Diamond" },
        { key: "Metal Purity", value: "18K Solid Gold" },
        { key: "Band Width", value: "2.0mm tapered" },
      ],
    },
    {
      name: "Celeste Emerald Drops",
      slug: "celeste",
      description: "Vibrant emerald teardrops suspended in delicate gold settings, capturing natural elegance in every movement.",
      shortDescription: "Vibrant emerald teardrops in gold settings.",
      price: 92000,
      compareAtPrice: 99000,
      category: categoryMap["Earrings"],
      material: "18K Gold & Emerald",
      collectionName: "Nature Edit",
      images: [imgs.emerald, imgs.pearl, imgs.gold],
      featuredImage: imgs.emerald,
      stock: 8,
      SKU: "AJ-E-002",
      tags: ["Earrings", "Emerald", "Teardrop", "Iconic"],
      featured: true,
      active: true,
      specifications: [
        { key: "Gemstone", value: "Natural Zambian Emeralds (1.8ct total)" },
        { key: "Setting", value: "Hand-set 4-prong setting" },
        { key: "Closure", value: "Leverback with safety latch" },
      ],
    },
    {
      name: "Verdant Tennis Bracelet",
      slug: "verdant",
      description: "A seamless line of brilliant-cut gemstones set in hand-polished gold, reflecting light with continuous brilliance.",
      shortDescription: "Seamless line of brilliant-cut gemstones in gold.",
      price: 124000,
      compareAtPrice: 135000,
      category: categoryMap["Bracelets"],
      material: "18K Yellow Gold",
      collectionName: "Signature",
      images: [imgs.gold, imgs.ring, imgs.hero],
      featuredImage: imgs.gold,
      stock: 5,
      SKU: "AJ-B-003",
      tags: ["Bracelet", "Tennis", "Gold", "Limited"],
      featured: true,
      active: true,
      specifications: [
        { key: "Total Carat Weight", value: "3.2ct Brilliant Cut" },
        { key: "Length", value: "7.0 inches" },
        { key: "Clasp", value: "Double-locking box clasp" },
      ],
    },
    {
      name: "Lumina Diamond Pendant",
      slug: "lumina",
      description: "A single, carefully selected diamond suspended from a delicate gold chain, crafted for timeless everyday grace.",
      shortDescription: "Single diamond suspended from 18K gold chain.",
      price: 78000,
      compareAtPrice: 85000,
      category: categoryMap["Pendants"],
      material: "18K Gold & Diamond",
      collectionName: "Everyday Luxury",
      images: [imgs.pearl, imgs.hero, imgs.emerald],
      featuredImage: imgs.pearl,
      stock: 15,
      SKU: "AJ-P-004",
      tags: ["Pendant", "Diamond", "Gift", "New"],
      featured: true,
      active: true,
      specifications: [
        { key: "Diamond Weight", value: "0.75ct Round Brilliant" },
        { key: "Chain Length", value: "Adjustable 16-18 inches" },
        { key: "Clasp", value: "Spring ring" },
      ],
    },
  ];

  for (const pSeed of productSeeds) {
    const existingP = await Product.findOne({ slug: pSeed.slug });
    if (!existingP) {
      await Product.create(pSeed);
    }
  }
  console.log("✅ Products seeded!");

  // 4. Seed Default Site Content
  console.log("🌐 Seeding Store CMS & Site Content...");
  const existingContent = await SiteContent.findOne();
  if (!existingContent) {
    await SiteContent.create({
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
    });
    console.log("✅ Site Content seeded!");
  } else {
    console.log("ℹ️ Site Content already exists.");
  }

  console.log("\n🎉 Database Seed Completed Successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed Error:", err);
  process.exit(1);
});
