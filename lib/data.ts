export const imgs = {
  hero: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90",
  ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
  emerald:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
  gold: "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&w=1000&q=85",
  bridal:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1100&q=85",
  pearl:
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85",
};

export interface ProductType {
  id: string;
  name: string;
  kind: string;
  price: string;
  image: string;
  badge: string;
  description: string;
}

export const products: ProductType[] = [
  {
    id: "solenne",
    name: "Solenne Emerald-Cut Ring",
    kind: "Rings",
    price: "₹1,86,000",
    image: imgs.ring,
    badge: "New arrival",
    description: "A singular emerald-cut silhouette designed for the quiet confidence of a lifelong promise.",
  },
  {
    id: "celeste",
    name: "Celeste Emerald Drops",
    kind: "Earrings",
    price: "₹92,000",
    image: imgs.emerald,
    badge: "Iconic",
    description: "Vibrant emerald teardrops suspended in delicate gold settings, capturing natural elegance in every movement.",
  },
  {
    id: "verdant",
    name: "Verdant Tennis Bracelet",
    kind: "Bracelets",
    price: "₹1,24,000",
    image: imgs.gold,
    badge: "Limited",
    description: "A seamless line of brilliant-cut gemstones set in hand-polished gold, reflecting light with continuous brilliance.",
  },
  {
    id: "lumina",
    name: "Lumina Diamond Pendant",
    kind: "Pendants",
    price: "₹78,000",
    image: imgs.pearl,
    badge: "Gift edit",
    description: "A single, carefully selected diamond suspended from a delicate gold chain, crafted for timeless everyday grace.",
  },
];
