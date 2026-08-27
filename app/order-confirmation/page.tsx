import Link from "next/link";
import { CheckCircle2, LockKeyhole, ShoppingBag } from "lucide-react";

export default function OrderConfirmationPreview() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "8rem 1.5rem", background: "radial-gradient(circle at 50% 20%, #d5ad6730, transparent 25%), #0b1712", color: "#f6f1e7", textAlign: "center" }}>
      <section style={{ maxWidth: 680, border: "1px solid #d5ad6770", padding: "clamp(2rem, 6vw, 5rem)", background: "#10271e" }}>
        <CheckCircle2 size={38} color="#d5ad67" strokeWidth={1.3} />
        <p style={{ margin: "1.5rem 0 .8rem", color: "#d5ad67", fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>Order confirmation preview</p>
        <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 5.4rem)", fontWeight: 500, lineHeight: .88, letterSpacing: "-.07em" }}>Your piece is <i style={{ color: "#d5ad67" }}>waiting.</i></h1>
        <p style={{ maxWidth: 510, margin: "1.5rem auto", color: "#c8d0c5", lineHeight: 1.7 }}>This is a visual confirmation only. No order has been placed, no jewellery protection has been activated, and no payment has been processed.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: ".6rem", flexWrap: "wrap", margin: "2rem 0" }}>
          <span style={{ border: "1px solid #688373", padding: ".55rem .7rem", fontSize: 11 }}><ShoppingBag size={14} style={{ verticalAlign: "middle", marginRight: ".35rem" }} />1 preview item</span>
          <span style={{ border: "1px solid #688373", padding: ".55rem .7rem", fontSize: 11 }}><LockKeyhole size={14} style={{ verticalAlign: "middle", marginRight: ".35rem" }} />Processing disabled</span>
        </div>
        <Link href="/shop" className="btn gold">Return to the collection</Link>
      </section>
    </main>
  );
}
