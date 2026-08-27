"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Diamond,
  Heart,
  Instagram,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  UserRound,
  X,
  ZoomIn,
  CircleHelp,
  Clock3,
} from "lucide-react";
type Page =
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "account"
  | "about"
  | "contact"
  | "journal"
  | "admin"
  | "guide";
const imgs = {
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
const products = [
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
function Logo() {
  return (
    <Link href="/" className="logo">
      <span>A</span>
      <b>
        Aurelia <i>Jewels</i>
      </b>
    </Link>
  );
}
function Btn({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (
    typeof children === "string" &&
    children.includes("Preview order confirmation")
  )
    return (
      <Link href="/order-confirmation" className={`btn ${className}`}>
        {children}
      </Link>
    );
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
function Title({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
}) {
  return (
    <div className="section-title">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <span>{copy}</span>}
    </div>
  );
}
export function AureliaExperience({ page, slug }: { page: Page; slug?: string }) {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [bag, setBag] = useState(false),
    [count, setCount] = useState(0),
    [save, setSave] = useState<string[]>([]),
    [cookie, setCookie] = useState(true),
    [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(scrollY > 20);
    f();
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);
  const add = () => {
      setCount(x => x + 1);
      setBag(true);
    },
    toggle = (id: string) =>
      setSave(x => (x.includes(id) ? x.filter(y => y !== id) : [...x, id]));
  return (
    <>
      <div className="announce">
        Complimentary insured delivery on orders over ₹50,000 <span>·</span>{" "}
        Discover the limited Élan collection <ArrowRight size={13} />
      </div>
      <header className={scrolled ? "header solid" : ["product","cart","checkout","account","contact"].includes(page) ? "header nav-dark" : "header"}>
        <div className="header-inner">
          <button className="icon" onClick={() => setMenu(true)}>
            <Menu />
          </button>
          <Logo />
          <nav>
            <Link href="/shop">Shop</Link>
            <Link href="/shop?collection=bridal">Collections</Link>
            <Link href="/contact">Bespoke</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/about">Our world</Link>
          </nav>
          <div className="header-actions">
            <button className="icon" onClick={() => setSearch(true)}>
              <Search />
            </button>
            <Link className="icon" href="/account">
              <UserRound />
            </Link>
            <Link className="icon" href="/account">
              <Heart />
              <small>{save.length}</small>
            </Link>
            <button className="icon" onClick={() => setBag(true)}>
              <ShoppingBag />
              <small>{count}</small>
            </button>
          </div>
        </div>
      </header>
      {page === "home" ? (
        <Home add={add} saved={save} toggle={toggle} />
      ) : page === "shop" ? (
        <Shop add={add} saved={save} toggle={toggle} />
      ) : page === "product" ? (
        <Product add={add} saved={save} toggle={toggle} slug={slug} />
      ) : page === "cart" ? (
        <Cart count={count} add={add} />
      ) : page === "checkout" ? (
        <Checkout count={count} />
      ) : page === "account" ? (
        <Account saved={save.length} count={count} />
      ) : page === "about" ? (
        <About />
      ) : page === "contact" ? (
        <Contact />
      ) : page === "journal" ? (
        <Journal />
      ) : page === "admin" ? (
        <Admin />
      ) : (
        <Guide />
      )}
      <Footer />
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
              ].map(x => (
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
              ].map(x => (
                <Link href="/shop" onClick={() => setMenu(false)} key={x}>
                  {x}
                </Link>
              ))}
            </div>
            <div className="mega-feature">
              <img src={imgs.emerald} alt="Emerald jewellery" />
              <span>Featured / The verdant edit</span>
              <Link href="/shop" onClick={() => setMenu(false)}>
                Explore now →
              </Link>
            </div>
          </div>
        </Overlay>
      )}
      {search && <SearchBox close={() => setSearch(false)} add={add} />}{" "}
      {bag && <Bag close={() => setBag(false)} count={count} />}
      <a
        className="support"
        href="https://wa.me/?text=Hello%20Aurelia%20Jewels"
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={18} /> Live support
      </a>
      {cookie && (
        <div className="cookie">
          <p>
            <b>Your privacy, considered.</b> We use essential cookies to make
            this preview feel considered.
          </p>
          <Btn onClick={() => setCookie(false)}>Accept</Btn>
          <button onClick={() => setCookie(false)}>Manage</button>
        </div>
      )}
      <nav className="mobile-nav">
        <Link href="/shop">Shop</Link>
        <Link href="/journal">Journal</Link>
        <button onClick={() => setSearch(true)}>
          <Search />
          Search
        </button>
        <button onClick={() => setBag(true)}>
          <ShoppingBag />
          Bag {count}
        </button>
      </nav>
    </>
  );
}
function Card({
  p,
  add,
  saved,
  toggle,
}: {
  p: (typeof products)[number];
  add: () => void;
  saved: string[];
  toggle: (s: string) => void;
}) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/product/${p.id}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <img src={p.image} alt={p.name} />
        </Link>
        <em>{p.badge}</em>
        <button className="save" onClick={() => toggle(p.id)}>
          <Heart fill={saved.includes(p.id) ? "currentColor" : "none"} />
        </button>
        <button className="quick" onClick={add}>
          Quick add <ShoppingBag size={15} />
        </button>
      </div>
      <p>{p.kind}</p>
      <Link href={`/product/${p.id}`}>{p.name}</Link>
      <b>{p.price}</b>
    </article>
  );
}
function Home({
  add,
  saved,
  toggle,
}: {
  add: () => void;
  saved: string[];
  toggle: (s: string) => void;
}) {
  const [quiz, setQuiz] = useState(0);
  return (
    <main>
      <section className="hero">
        <img src={imgs.hero} alt="Gold and gemstone jewellery" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p>Aurelia Jewels · 2026 Collection</p>
          <h1>
            The art of
            <br />
            <i>becoming.</i>
          </h1>
          <span>
            Contemporary heirlooms in gold, diamond, and vivid colour—made for
            the moments you keep.
          </span>
          <div>
            <Link href="/shop" className="btn gold">
              Explore the collection <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn ghost">
              Create a bespoke piece
            </Link>
          </div>
          <small>↓ Discover the edit</small>
        </div>
      </section>
      <section className="trust-row">
        {[
          [
            BadgeCheck,
            "Certified jewellery",
            "Authenticity documentation with every eligible piece.",
          ],
          [
            LockKeyhole,
            "Secure checkout",
            "Payment processing remains disabled in this preview.",
          ],
          [
            ShieldCheck,
            "Insured delivery",
            "Careful dispatch settings ready for your courier partner.",
          ],
          [
            PackageCheck,
            "Easy returns",
            "Policy terms are ready for final review.",
          ],
        ].map(([I, t, c]: any) => (
          <div key={t}>
            <I />
            <p>
              <b>{t}</b>
              {c}
            </p>
          </div>
        ))}
      </section>
      <section className="section cream">
        <Title
          eyebrow="The collection"
          title={
            <>
              Sculpted for a <i>life well lived.</i>
            </>
          }
        />
        <div className="category-grid">
          {[
            ["Rings", imgs.ring, "tall"],
            ["Necklaces", imgs.hero, ""],
            ["Earrings", imgs.emerald, ""],
            ["Bracelets", imgs.gold, "wide"],
          ].map(([x, im, c]) => (
            <Link href="/shop" className={`category ${c}`} key={x}>
              <img src={im} alt={`${x} collection`} />
              <b>{x}</b>
              <span>Explore →</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section deep">
        <Title
          eyebrow="New arrivals"
          title={
            <>
              The new <i>classics.</i>
            </>
          }
        />
        <div className="product-grid">
          {products.map(p => (
            <Card key={p.id} p={p} add={add} saved={saved} toggle={toggle} />
          ))}
        </div>
      </section>
      <section className="discovery">
        <div>
          <p>Discover by material</p>
          <h2>
            Every detail,
            <br />
            <i>considered.</i>
          </h2>
          <span>
            From responsibly chosen materials to the hand-polish, our pieces
            balance natural integrity with a distinctly modern point of view.
          </span>
        </div>
        <div className="discovery-cards">
          {[
            "Gold",
            "Rose gold",
            "White gold",
            "Platinum",
            "Silver",
            "Diamond",
            "Emerald",
            "Sapphire",
            "Pearl",
          ].map((x, i) => (
            <Link href="/shop" key={x}>
              <span>0{i + 1}</span>
              {x}
              <ArrowRight size={15} />
            </Link>
          ))}
        </div>
      </section>
      <section className="limited">
        <img src={imgs.bridal} alt="Limited collection" />
        <div>
          <p>Limited edition</p>
          <h2>
            The Élan <i>edit.</i>
          </h2>
          <span>
            A numbered collection inspired by the geometry of light, released in
            an intimate series.
          </span>
          <Link href="/shop" className="btn gold">
            View the exclusive edit
          </Link>
        </div>
      </section>
      <section className="section cream story">
        <div>
          <p>Crafted in chapters</p>
          <h2>
            From sketch to <i>story.</i>
          </h2>
          <span>
            Each Aurelia piece starts with a considered line and finishes in the
            hands of a specialist maker.
          </span>
          <Link href="/about">Meet the atelier →</Link>
        </div>
        <ol>
          {["Stone selection", "Hand-set precision", "Final illumination"].map(
            (x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
              </li>
            )
          )}
        </ol>
      </section>
      <section className="quiz">
        <div>
          <p>Style discovery</p>
          <h2>
            Find your signature <i>piece.</i>
          </h2>
          <span>
            Answer a few considered questions for a starting point—not a
            prescription.
          </span>
        </div>
        <div className="quiz-box">
          <b>What does luxury mean to you?</b>
          {["Quiet brilliance", "A bold signature", "Heirloom romance"].map(
            (x, i) => (
              <button
                onClick={() => setQuiz(i)}
                className={quiz === i ? "selected" : ""}
                key={x}
              >
                {x}
                <ArrowRight size={16} />
              </button>
            )
          )}
          <small>
            Your edit:{" "}
            <strong>
              {
                [
                  "Celeste Emerald Drops",
                  "Verdant Tennis Bracelet",
                  "Solenne Emerald-Cut Ring",
                ][quiz]
              }
            </strong>
          </small>
        </div>
      </section>
      <section className="bridal">
        <img src={imgs.bridal} alt="Bridal jewellery" />
        <div>
          <p>For the promise</p>
          <h2>
            Bridal, <i>in your way.</i>
          </h2>
          <span>
            Engagement rings, wedding bands, and meaningful markers created
            around your story.
          </span>
          <Link href="/shop" className="btn ghost">
            Discover bridal
          </Link>
        </div>
      </section>
      <section className="section cream">
        <Title
          eyebrow="For every moment"
          title={
            <>
              The occasion <i>edit.</i>
            </>
          }
        />
        <div className="occasion-grid">
          {[
            "Engagement",
            "Wedding",
            "Anniversary",
            "Celebration",
            "Everyday",
            "Gifting",
          ].map(x => (
            <Link href="/shop" key={x}>
              {x}
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="craft">
        <div>
          <Sparkles />
          <p>The Aurelia promise</p>
          <h2>
            Made for the <i>only once.</i>
          </h2>
          <span>
            Bring a memory, a stone, or simply an idea. We will turn it into
            something that belongs to you.
          </span>
          <Link href="/contact" className="btn gold">
            Begin your commission
          </Link>
        </div>
        <img src={imgs.hero} alt="Aurelia craftsmanship" />
      </section>
      <section className="section deep">
        <Title
          eyebrow="Authenticity, always"
          title={
            <>
              Proof of a more <i>precious</i> standard.
            </>
          }
        />
        <div className="cert-grid">
          {[
            "Responsible material pathways",
            "Diamond and gemstone disclosure",
            "Craft and quality inspection",
            "Lifetime care conversation",
          ].map((x, i) => (
            <div key={x}>
              <Diamond />
              <span>0{i + 1}</span>
              <b>{x}</b>
              <p>
                Documentation and guidance will be connected to eligible live
                products.
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="section cream">
        <Title
          eyebrow="The Aurelia community"
          title={
            <>
              Stories will arrive <i>here.</i>
            </>
          }
          copy="Verified customer reviews will be displayed only after real customer data is connected."
        />
        <div className="honest-empty">
          <Star />
          <h3>No customer stories published yet.</h3>
          <p>
            We do not invent ratings, reviews, testimonials, or photo
            submissions.
          </p>
        </div>
      </section>
      <section className="gift">
        <img src={imgs.pearl} alt="Jewellery gift" />
        <div>
          <p>Gifting, refined</p>
          <h2>
            A little help finding <i>the one.</i>
          </h2>
          <span>
            Explore gifts by sentiment, occasion, stone, and signature style.
          </span>
          <Link href="/shop" className="btn gold">
            Use the gift finder
          </Link>
        </div>
      </section>
      <section className="section cream social">
        <Title
          eyebrow="Follow the making"
          title={
            <>
              A closer look at <i>Aurelia.</i>
            </>
          }
        />
        <div>
          {[imgs.ring, imgs.emerald, imgs.gold, imgs.hero, imgs.bridal].map(
            (im, i) => (
              <a href="#social" key={im}>
                <img src={im} alt={`Aurelia editorial ${i + 1}`} />
                <Instagram />
              </a>
            )
          )}
        </div>
      </section>
      <JournalTeaser />
      <Faq />
      <Newsletter />
      <section className="final-cta">
        <img src={imgs.hero} alt="Explore the collection" />
        <div>
          <p>Make a moment last</p>
          <h2>
            Find a piece that <i>feels like you.</i>
          </h2>
          <Link href="/shop" className="btn gold">
            Shop all jewellery <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
function Shop({
  add,
  saved,
  toggle,
}: {
  add: () => void;
  saved: string[];
  toggle: (s: string) => void;
}) {
  const [filter, setFilter] = useState("All pieces"),
    [list, setList] = useState(false);
  const shown = products.filter(
    x => filter === "All pieces" || x.kind === filter
  );
  return (
    <main className="page cream">
      <section className="collection-hero">
        <img src={imgs.gold} alt="Aurelia collection" />
        <div>
          <p>Collection / All pieces</p>
          <h1>
            The modern <i>heirloom.</i>
          </h1>
          <span>
            Designed to hold a place in your life, and then in someone
            else&apos;s.
          </span>
        </div>
      </section>
      <section className="section">
        <div className="bread">Home / Shop / All jewellery</div>
        <div className="shop-head">
          <Title
            eyebrow="The full collection"
            title="Discover your next piece."
          />
          <p>
            Each preview product becomes live only after catalogue data is
            connected.
          </p>
        </div>
        <div className="toolbar">
          <button>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="chips">
            {["All pieces", "Rings", "Earrings", "Bracelets", "Pendants"].map(
              x => (
                <button
                  onClick={() => setFilter(x)}
                  className={filter === x ? "active" : ""}
                  key={x}
                >
                  {x}
                </button>
              )
            )}
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
          {shown.length} of {products.length} preview pieces · Curated edit
        </p>
        <div className={list ? "product-list" : "product-grid light-grid"}>
          {shown.map(p => (
            <Card key={p.id} p={p} add={add} saved={saved} toggle={toggle} />
          ))}
        </div>
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
        <section className="related">
          <Title
            eyebrow="Keep discovering"
            title={
              <>
                You may also <i>like.</i>
              </>
            }
          />
          <div className="product-grid">
            {products.slice(1).map(p => (
              <Card key={p.id} p={p} add={add} saved={saved} toggle={toggle} />
            ))}
          </div>
        </section>
        <Faq />
      </section>
    </main>
  );
}
function Product({
  add,
  saved,
  toggle,
  slug,
}: {
  add: () => void;
  saved: string[];
  toggle: (s: string) => void;
  slug?: string;
}) {
  const p = products.find(x => x.id === slug) || products[0];
  const [im, setIm] = useState(0),
    [size, setSize] = useState(p.kind === "Rings" ? "6" : p.kind === "Bracelets" ? "7\"" : "One size"),
    [gift, setGift] = useState(false);
  const gallery = [p.image, imgs.ring, imgs.emerald, imgs.gold, imgs.hero].filter(
    (x, i, self) => self.indexOf(x) === i
  ).slice(0, 4);
  const sku = p.id === "celeste" ? "AJ-E-002" : p.id === "verdant" ? "AJ-B-003" : p.id === "lumina" ? "AJ-P-004" : "AJ-R-001";

  // Reset image index when product changes
  useEffect(() => {
    setIm(0);
    setSize(p.kind === "Rings" ? "6" : p.kind === "Bracelets" ? "7\"" : "One size");
  }, [p]);

  return (
    <main className="page cream">
      <section className="product-detail">
        <div className="bread">Home / {p.kind} / {p.name}</div>
        <div className="product-layout">
          <div className="gallery">
            <div className="main-image">
              <img src={gallery[im]} alt={p.name} />
              <span>
                <ZoomIn size={16} /> Click to zoom
              </span>
            </div>
            <div className="thumbs">
              {gallery.map((x, i) => (
                <button
                  onClick={() => setIm(i)}
                  className={i === im ? "active" : ""}
                  key={x}
                >
                  <img src={x} alt={`${p.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="media-placeholders">
              <button>
                ▻ Product film <small>Preview placeholder</small>
              </button>
              <button>
                360° Viewer <small>Preview placeholder</small>
              </button>
              <button>
                AR try-on <small>Integration placeholder</small>
              </button>
            </div>
          </div>
          <div className="product-copy">
            <p>{p.kind} · SKU {sku}</p>
            <h1>{p.name}</h1>
            <span className="review-empty">
              No verified reviews yet · Customer ratings appear after real data
              is connected.
            </span>
            <h2>{p.price}</h2>
            <p className="installment">
              Preview price · Instalment and final tax calculations are
              unavailable until your payment provider is connected.
            </p>
            <p className="stock">● In stock · dispatch configuration pending</p>
            <p>
              {p.description}
            </p>
            <fieldset>
              <legend>Metal & purity</legend>
              {["18K Gold", "White Gold", "Rose Gold"].map(x => (
                <button key={x}>{x}</button>
              ))}
            </fieldset>
            {p.kind === "Rings" && (
              <fieldset>
                <legend>Ring size</legend>
                {["5", "6", "7", "8"].map(x => (
                  <button
                    className={size === x ? "active" : ""}
                    onClick={() => setSize(x)}
                    key={x}
                  >
                    {x}
                  </button>
                ))}
                <Link href="/guide">Visual size guide →</Link>
              </fieldset>
            )}
            {p.kind === "Bracelets" && (
              <fieldset>
                <legend>Bracelet size</legend>
                {["6.5\"", "7\"", "7.5\""].map(x => (
                  <button
                    className={size === x ? "active" : ""}
                    onClick={() => setSize(x)}
                    key={x}
                  >
                    {x}
                  </button>
                ))}
                <Link href="/guide">Visual size guide →</Link>
              </fieldset>
            )}
            {(p.kind === "Earrings" || p.kind === "Pendants") && (
              <fieldset>
                <legend>Size</legend>
                {p.kind === "Earrings" ? (
                  <button className="active">One size</button>
                ) : (
                  <button className="active">Adjustable (16–18")</button>
                )}
              </fieldset>
            )}
            <label className="postal">
              Delivery estimate <input placeholder="Enter postal code" />
              <button>Check delivery</button>
            </label>
            <div className="buy-row">
              <Btn className="gold" onClick={add}>
                <ShoppingBag size={16} /> Add to bag
              </Btn>
              <Btn className="outline" onClick={add}>
                Buy now (preview)
              </Btn>
              <button className="save" onClick={() => toggle(p.id)}>
                <Heart fill={saved.includes(p.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <label className="gift-line">
              <input
                type="checkbox"
                checked={gift}
                onChange={e => setGift(e.target.checked)}
              />
              <Sparkles size={16} /> Add complimentary gift wrapping
            </label>
            {gift && (
              <textarea placeholder="Your personal message (saved in preview only)" />
            )}
            <Accordion />
            <div className="share">
              Share this piece <button>Copy link</button>
              <button>Email</button>
            </div>
          </div>
        </div>
      </section>
      <section className="wearing">
        <div>
          <p>In real light</p>
          <h2>
            How it moves <i>with you.</i>
          </h2>
          <span>
            Lifestyle and try-on images will be added to your real product media
            library.
          </span>
        </div>
        <img src={imgs.bridal} alt="Jewellery styling" />
        <img src={imgs.pearl} alt="Jewellery lifestyle" />
      </section>
      <section className="section">
        <Title
          eyebrow="Complete the story"
          title={
            <>
              Frequently bought <i>together.</i>
            </>
          }
        />
        <div className="product-grid light-grid">
          {products.slice(1).map(x => (
            <Card key={x.id} p={x} add={add} saved={saved} toggle={toggle} />
          ))}
        </div>
        <div className="honest-empty">
          <CircleHelp />
          <h3>Questions and answers will appear here.</h3>
          <p>
            Submit and publish real questions only when your support workflow is
            connected.
          </p>
        </div>
      </section>
    </main>
  );
}
function Accordion() {
  const [o, setO] = useState(0),
    rows = [
      [
        "Specifications",
        "18K recycled gold · Emerald-cut laboratory-grown diamond · Hand-finished in our Jaipur atelier.",
      ],
      [
        "Materials & certification",
        "Product-level provenance and certification documents are ready to be attached to live catalogue data.",
      ],
      [
        "Shipping, returns & warranty",
        "Set regional policy, insured carrier, and warranty terms before accepting an order.",
      ],
      ["Care", "Store separately and use a soft, lint-free cloth."],
    ];
  return (
    <div className="accordion">
      {rows.map(([x, y], i) => (
        <div key={x}>
          <button onClick={() => setO(o === i ? -1 : i)}>
            {x}
            <ChevronDown className={o === i ? "up" : ""} />
          </button>
          {o === i && <p>{y}</p>}
        </div>
      ))}
    </div>
  );
}
function Cart({ count, add }: { count: number; add: () => void }) {
  return (
    <main className="page cream">
      <section className="section cart-page">
        <Title
          eyebrow="Your selection"
          title={
            <>
              A considered <i>choice.</i>
            </>
          }
        />
        {!count ? (
          <div className="empty-cart">
            <ShoppingBag />
            <h2>Your bag is ready when you are.</h2>
            <p>
              Explore the collection and add a piece to begin this preview
              checkout.
            </p>
            <Link href="/shop" className="btn gold">
              Shop the collection
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              <article className="cart-product">
                <Link href="/product/solenne" style={{ display: "block", flex: "none" }}>
                  <img src={imgs.ring} alt="Solenne Ring" />
                </Link>
                <div>
                  <p>Rings · 18K Gold · Size 6</p>
                  <Link href="/product/solenne" style={{ color: "inherit" }}>
                    <h3>Solenne Emerald-Cut Ring</h3>
                  </Link>
                  <b>₹1,86,000</b>
                  <div>
                    <button>−</button> 1 <button onClick={add}>+</button>
                  </div>
                </div>
                <button>Remove</button>
              </article>
              <div className="saved-later">
                <Heart />
                <div>
                  <b>Save this for later</b>
                  <span>
                    Saved pieces sync when MongoDB Atlas is connected.
                  </span>
                </div>
              </div>
            </div>
            <Summary />
          </div>
        )}
      </section>
    </main>
  );
}
function Summary() {
  return (
    <aside className="summary">
      <p>Order summary</p>
      <div className="progress">
        <span />
        ₹18,000 until complimentary insured delivery
      </div>
      <label>
        Coupon code
        <input placeholder="Preview only" />
        <button>Apply</button>
      </label>
      <label>
        Gift card
        <input placeholder="Preview only" />
        <button>Apply</button>
      </label>
      <label className="gift-line">
        <input type="checkbox" /> Add gift wrapping
      </label>
      <label className="gift-line">
        <input type="checkbox" /> Add jewellery protection{" "}
        <small>Preview only</small>
      </label>
      <dl>
        <dt>Subtotal</dt>
        <dd>₹1,86,000</dd>
        <dt>Taxes and shipping</dt>
        <dd>Calculated after provider setup</dd>
      </dl>
      <Link href="/checkout" className="btn gold">
        Proceed to preview checkout
      </Link>
      <div className="secure">
        <LockKeyhole /> Secure processing is not active in this preview.
      </div>
    </aside>
  );
}
function Checkout({ count }: { count: number }) {
  return (
    <main className="page checkout-page">
      <section className="checkout-head">
        <Logo />
        <p>Secure checkout preview</p>
      </section>
      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={e => e.preventDefault()}>
          <Title
            eyebrow="Checkout"
            title={
              <>
                Complete your <i>selection.</i>
              </>
            }
          />
          <div className="checkout-note">
            <LockKeyhole /> Payment is not enabled. Form fields are for layout
            and flow preview only.
          </div>
          <h3>Contact</h3>
          <div className="two">
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Phone
              <input placeholder="+91" />
            </label>
          </div>
          <h3>Delivery</h3>
          <div className="two">
            <label>
              First name
              <input />
            </label>
            <label>
              Last name
              <input />
            </label>
          </div>
          <label>
            Address
            <input />
          </label>
          <div className="three">
            <label>
              City
              <input />
            </label>
            <label>
              State
              <input />
            </label>
            <label>
              Postal code
              <input />
            </label>
          </div>
          <h3>Payment</h3>
          <div className="payment-disabled">
            Payment method selection, payment processing, and cash-on-delivery
            rules will appear only after you connect them.
          </div>
          <label className="terms">
            <input type="checkbox" /> I understand this checkout cannot place an
            order or process payment.
          </label>
          <Btn className="gold">
            {count ? "Preview order confirmation" : "Your bag is empty"}
          </Btn>
        </form>
        <Summary />
      </section>
    </main>
  );
}
function Account({ saved, count }: { saved: number; count: number }) {
  return (
    <main className="page cream">
      <section className="account-hero">
        <p>Your Aurelia</p>
        <h1>
          A private <i>place.</i>
        </h1>
        <span>
          All account data remains in preview until your MongoDB Atlas URI is
          added.
        </span>
        <div>
          <b>{count}</b> items in bag <b>{saved}</b> saved pieces
        </div>
      </section>
      <section className="section">
        <div className="account-grid">
          {[
            [
              "Profile & security",
              "Personal details, security controls, and account deletion settings.",
            ],
            [
              "Orders & returns",
              "Order history, tracking, invoices, and return requests.",
            ],
            [
              "Addresses & payment",
              "Saved addresses and payment methods after secure connection.",
            ],
            [
              "Wishlist & gifting",
              `${saved} saved pieces, gift cards, and custom jewellery requests.`,
            ],
            ["Preferences", "Newsletter choices and appointment requests."],
            ["Support centre", "Care, sizing, and a service conversation."],
          ].map(([x, y], i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <h2>{x}</h2>
              <p>{y}</p>
              <button>
                Open preview <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
        <section className="account-delete">
          <ShieldCheck />
          <div>
            <h2>Privacy & data controls</h2>
            <p>
              Live deletion, export, and consent controls should be enabled only
              after your policy and customer database are in place.
            </p>
          </div>
          <button>View privacy controls</button>
        </section>
      </section>
    </main>
  );
}
function About() {
  return (
    <main className="page cream">
      <section className="about-hero">
        <img src={imgs.hero} alt="Aurelia founder story" />
        <div>
          <p>Our world</p>
          <h1>
            Made with <i>intention.</i>
          </h1>
          <span>
            Aurelia exists for the feeling a well-chosen piece carries long
            after the room has changed.
          </span>
        </div>
      </section>
      <section className="section narrative">
        <Title
          eyebrow="A beginning"
          title={
            <>
              For what you choose <i>to keep.</i>
            </>
          }
          copy="The Aurelia story begins with reverence for material and a belief that jewellery should sit naturally within a life."
        />
        <div className="story-panels">
          {["Founder’s note", "Atelier practice", "Future-minded making"].map(
            (x, i) => (
              <article key={x}>
                <span>0{i + 1}</span>
                <h3>{x}</h3>
                <p>
                  Our point of view on colour, proportion, personal ritual, and
                  transparent craft.
                </p>
              </article>
            )
          )}
        </div>
        <div className="timeline">
          {[
            "The first sketch",
            "A language of colour",
            "The modern heirloom",
            "The next chapter",
          ].map((x, i) => (
            <div key={x}>
              <span>202{i + 2}</span>
              <h3>{x}</h3>
              <p>
                Brand milestones and press references will be maintained from
                your live CMS.
              </p>
            </div>
          ))}
        </div>
        <section className="showroom">
          <MapPin />
          <div>
            <p>Visit the world of Aurelia</p>
            <h2>
              Showroom appointments <i>by request.</i>
            </h2>
            <span>
              Your showroom address and appointment availability can be
              introduced when confirmed.
            </span>
            <Link href="/contact" className="btn gold">
              Request an appointment
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main className="page cream">
      <section className="contact-hero">
        <p>Contact the atelier</p>
        <h1>
          Let&apos;s begin a <i>conversation.</i>
        </h1>
        <span>
          For a thoughtful gift, bespoke commission, care question, or
          appointment request.
        </span>
      </section>
      <section className="section contact-layout">
        <form
          className="contact-form"
          onSubmit={e => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <h2>Tell us what is on your mind.</h2>
          <div className="two">
            <label>
              First name
              <input required />
            </label>
            <label>
              Last name
              <input required />
            </label>
          </div>
          <div className="two">
            <label>
              Email
              <input type="email" required />
            </label>
            <label>
              Department
              <select>
                <option>Bespoke jewellery</option>
                <option>Order support</option>
                <option>Care & repair</option>
              </select>
            </label>
          </div>
          <label>
            Your message
            <textarea
              required
              placeholder="Share a little about what you are looking for."
            />
          </label>
          <label>
            Reference image
            <input type="file" accept="image/*" />
            <small>
              Files are not stored until MongoDB Atlas and object storage are
              connected.
            </small>
          </label>
          <label className="gift-line">
            <input type="checkbox" /> Request an appointment
          </label>
          <Btn className="gold">
            {sent ? "Request saved in this browser" : "Send enquiry"}
          </Btn>
          {sent && (
            <p className="form-status">
              Thank you. This preview validates your form but does not send
              email yet.
            </p>
          )}
        </form>
        <aside className="contact-info">
          <div>
            <Clock3 />
            <b>Response time</b>
            <p>
              We aim to respond within two business days after your support
              inbox is connected.
            </p>
          </div>
          <div>
            <MessageCircle />
            <b>WhatsApp</b>
            <p>Start a conversation with the live support shortcut.</p>
          </div>
          <div>
            <MapPin />
            <b>Visit</b>
            <p>
              Showroom details and interactive map are pending your confirmed
              location.
            </p>
          </div>
          <div className="map-placeholder">Map integration placeholder</div>
        </aside>
      </section>
    </main>
  );
}
function Journal() {
  const articles = [
    "The quiet geometry of an emerald cut",
    "A guide to wearing gold every day",
    "Five ways to make a gift feel personal",
    "The little rituals of jewellery care",
    "A modern approach to bridal styling",
    "What to know about gemstone colour",
  ];
  return (
    <main className="page cream">
      <section className="journal-hero">
        <img src={imgs.emerald} alt="Aurelia journal" />
        <div>
          <p>The Aurelia journal</p>
          <h1>
            Notes for a life <i>well adorned.</i>
          </h1>
          <span>
            Stories of craft, material, giving, and the moments that collect
            around a piece.
          </span>
        </div>
      </section>
      <section className="section">
        <div className="journal-tools">
          <input placeholder="Search the journal" />
          <div>
            {[
              "All stories",
              "Care",
              "Styling",
              "Bridal",
              "Gemstones",
              "Craft",
            ].map(x => (
              <button key={x}>{x}</button>
            ))}
          </div>
        </div>
        <article className="featured-article">
          <img src={imgs.hero} alt="Featured article" />
          <div>
            <p>Featured story · Craft</p>
            <h2>
              What makes a piece feel <i>personal?</i>
            </h2>
            <span>
              A considered look at choices and moments that turn jewellery into
              an heirloom.
            </span>
            <button>Read the preview →</button>
          </div>
        </article>
        <div className="article-grid">
          {articles.map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <p>Editorial</p>
              <h2>{x}</h2>
              <small>
                Article content and author profiles are managed from your live
                CMS.
              </small>
              <button>Open story →</button>
            </article>
          ))}
        </div>
        <Newsletter />
      </section>
    </main>
  );
}
function Admin() {
  const links = [
    "Overview",
    "Catalogue",
    "Collections",
    "Homepage",
    "Campaigns",
    "Media",
    "Orders & returns",
    "Customers",
    "Reviews",
    "Gift cards",
    "Journal CMS",
    "Enquiries",
    "Appointments",
    "Shipping & tax",
    "Payment settings",
    "SEO",
    "Navigation",
    "Admin users",
    "Audit logs",
    "Import & backup",
  ];
  return (
    <main className="admin-page">
      <aside>
        <Logo />
        <p>Commerce control</p>
        {links.map((x, i) => (
          <button className={i === 0 ? "active" : ""} key={x}>
            {x}
          </button>
        ))}
        <div>
          <ShieldCheck /> MongoDB and external commerce sources are
          intentionally disconnected.
        </div>
      </aside>
      <section>
        <header>
          <div>
            <p>Aurelia / operations</p>
            <h1>Good morning, curator.</h1>
          </div>
          <Link href="/">View storefront ↗</Link>
        </header>
        <div className="admin-warning">
          <CircleHelp />
          <span>
            <b>Data source is not connected.</b> This admin environment uses
            truthful zero-data states until you add MongoDB Atlas and a commerce
            system.
          </span>
        </div>
        <div className="admin-stats">
          {[
            ["Revenue", "₹0", "Awaiting store data"],
            ["Orders", "0", "Awaiting connection"],
            ["Customers", "0", "Awaiting connection"],
            ["Abandoned carts", "0", "Preview analytics only"],
          ].map(([x, y, z]) => (
            <article key={x}>
              <span>{x}</span>
              <b>{y}</b>
              <small>{z}</small>
            </article>
          ))}
        </div>
        <div className="admin-grid">
          {[
            [
              "Sales overview",
              "Revenue trend",
              "Connect live data to view day, week, month, and year performance.",
            ],
            ["Inventory", "Stock signals", "No inventory feed configured."],
            [
              "Recent activity",
              "Operations feed",
              "Real activities will appear after workflows are connected.",
            ],
            [
              "Content manager",
              "Homepage sections",
              "Hero · New arrivals · Craft · Bridal · Journal · FAQ",
            ],
          ].map(([x, y, z]) => (
            <article className="chart" key={x}>
              <p>{x}</p>
              <h2>{y}</h2>
              <div className="empty-admin">{z}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
function Guide() {
  return (
    <main className="page cream">
      <section className="guide-hero">
        <p>Aurelia guides</p>
        <h1>
          Considered answers, <i>always.</i>
        </h1>
        <span>
          Explore care, sizing, materials, shipping, gifting, and the basics of
          choosing a piece that stays with you.
        </span>
      </section>
      <section className="section">
        <div className="guide-grid">
          {[
            "Jewellery care",
            "Size & fit",
            "Metals",
            "Gemstones",
            "Gifting",
            "Shipping & returns",
            "Authenticity",
            "Bespoke commissions",
          ].map((x, i) => (
            <article key={x}>
              <span>0{i + 1}</span>
              <h2>{x}</h2>
              <p>
                Clear editorial guidance will be maintained in your live content
                system.
              </p>
              <button>Read guide →</button>
            </article>
          ))}
        </div>
        <Faq />
      </section>
    </main>
  );
}
function JournalTeaser() {
  return (
    <section className="section cream journal-teaser">
      <div>
        <p>From the journal</p>
        <h2>
          Notes for a life <i>well adorned.</i>
        </h2>
        <Link href="/journal">Read the latest →</Link>
      </div>
      {[
        "The little rituals of jewellery care",
        "Quiet confidence, in colour",
      ].map((x, i) => (
        <article key={x}>
          <span>0{i + 1}</span>
          <p>Editorial</p>
          <h3>{x}</h3>
        </article>
      ))}
    </section>
  );
}
function Faq() {
  const [o, setO] = useState(0),
    a = [
      [
        "How do I find my ring size?",
        "Use the visual size guide as a starting point, then consult your specialist for a final fit before live purchase.",
      ],
      [
        "Will every item include certification?",
        "Attach documentation per eligible product when you connect your verified inventory.",
      ],
      [
        "Can I commission something bespoke?",
        "Yes. Use the contact route to begin a preview enquiry, then connect your real support workflow.",
      ],
      [
        "Where do you deliver?",
        "Delivery regions, rates, and insurance coverage should be configured with your live fulfillment provider.",
      ],
    ];
  return (
    <section className="faq">
      <Title
        eyebrow="Helpful details"
        title={
          <>
            Questions, <i>considered.</i>
          </>
        }
      />
      <div>
        {a.map(([x, y], i) => (
          <article key={x}>
            <button onClick={() => setO(o === i ? -1 : i)}>
              {x}
              <ChevronDown className={o === i ? "up" : ""} />
            </button>
            {o === i && <p>{y}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
function Newsletter() {
  const [join, setJoin] = useState(false);
  return (
    <section className="newsletter">
      <div>
        <p>Private previews</p>
        <h2>
          Keep close to <i>what moves you.</i>
        </h2>
      </div>
      <div>
        <span>
          Receive collection notes, atelier stories, and invitations to see
          more.
        </span>
        <form
          onSubmit={e => {
            e.preventDefault();
            setJoin(true);
          }}
        >
          <input type="email" placeholder="Your email address" required />
          <button>
            <ArrowRight />
          </button>
        </form>
        {join && (
          <small>
            Thank you—this preview does not submit email addresses yet.
          </small>
        )}
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Logo />
          <p>Contemporary heirlooms, designed to become part of your story.</p>
        </div>
        <div>
          <b>Discover</b>
          <Link href="/shop">Shop all pieces</Link>
          <Link href="/shop">Bridal collection</Link>
          <Link href="/contact">Bespoke jewellery</Link>
          <Link href="/journal">Journal</Link>
        </div>
        <div>
          <b>Service</b>
          <Link href="/guide">Jewellery care</Link>
          <Link href="/guide">Size guide</Link>
          <Link href="/guide">Shipping & returns</Link>
          <Link href="/contact">Contact the atelier</Link>
        </div>
        <div>
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
          <Link href="/admin">Admin preview</Link>
        </span>
      </div>
    </footer>
  );
}
function Overlay({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overlay">
      <div className="modal">
        <button className="icon close" onClick={close}>
          <X />
        </button>
        <p>{title}</p>
        {children}
      </div>
    </div>
  );
}
function SearchBox({ close, add }: { close: () => void; add: () => void }) {
  const [q, setQ] = useState("");
  return (
    <Overlay title="Search the collection" close={close}>
      <div className="search-input">
        <Search />
        <input
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search pieces, stones, stories"
        />
      </div>
      {q ? (
        <div className="search-results">
          {products
            .filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
            .map(p => (
              <article key={p.id}>
                <Link
                  href={`/product/${p.id}`}
                  onClick={close}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, color: "inherit" }}
                >
                  <img src={p.image} alt="" />
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
function Bag({ close, count }: { close: () => void; count: number }) {
  return (
    <div className="overlay cart-overlay">
      <div className="cart-drawer">
        <button className="icon close" onClick={close}>
          <X />
        </button>
        <p>Your bag</p>
        {count ? (
          <>
            <Link
              href="/product/solenne"
              onClick={close}
              className="drawer-item"
              style={{ display: "flex", gap: "1rem", color: "inherit" }}
            >
              <img src={imgs.ring} alt="Solenne ring" />
              <span>
                Solenne Emerald-Cut Ring<small>18K Gold · Size 6</small>
                <b>₹1,86,000</b>
              </span>
            </Link>
            <Link href="/checkout" className="btn gold" onClick={close}>
              Continue to preview checkout
            </Link>
          </>
        ) : (
          <div className="drawer-empty">
            <ShoppingBag />
            <b>Your selection is waiting.</b>
            <span>Pieces you add appear during this browser session.</span>
            <Link href="/shop" className="btn gold" onClick={close}>
              Explore jewellery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
