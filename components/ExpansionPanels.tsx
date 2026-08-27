"use client";
import { useState } from "react";

const panel: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "3.5rem 1.5rem",
  color: "#143025",
  background: "#f5efe3",
};
const tabStyle: React.CSSProperties = {
  border: "1px solid #b7a68a",
  background: "transparent",
  color: "#1b392d",
  padding: ".55rem .65rem",
  fontSize: 11,
};

export function ProductSpecificationTable({ slug }: { slug?: string }) {
  const specs: Record<string, [string, string][]> = {
    solenne: [
      ["SKU", "AJ-R-001"],
      ["Metal", "18K recycled gold"],
      ["Stone", "Emerald-cut laboratory-grown diamond"],
      ["Setting", "Hand-set bezel and pavé halo"],
      ["Size", "US 5–8 preview selection"],
      ["Origin", "Jaipur atelier"],
      ["Documentation", "Attached to eligible live inventory"],
    ],
    celeste: [
      ["SKU", "AJ-E-002"],
      ["Metal", "18K recycled yellow gold"],
      ["Stone", "Pear-cut natural emerald"],
      ["Setting", "Three-prong claw setting"],
      ["Size", "One size"],
      ["Origin", "Jaipur atelier"],
      ["Documentation", "Attached to eligible live inventory"],
    ],
    verdant: [
      ["SKU", "AJ-B-003"],
      ["Metal", "18K recycled gold"],
      ["Stone", "Round brilliant-cut diamonds and emeralds"],
      ["Setting", "Four-prong basket setting"],
      ["Size", "6.5 – 7.5 inches preview selection"],
      ["Origin", "Jaipur atelier"],
      ["Documentation", "Attached to eligible live inventory"],
    ],
    lumina: [
      ["SKU", "AJ-P-004"],
      ["Metal", "18K recycled gold"],
      ["Stone", "Round brilliant-cut diamond"],
      ["Setting", "Bezel setting on trace chain"],
      ["Size", "16–18 inches adjustable"],
      ["Origin", "Jaipur atelier"],
      ["Documentation", "Attached to eligible live inventory"],
    ],
  };

  const activeSpecs = specs[slug || ""] || specs.solenne;

  return (
    <section style={panel}>
      <p
        style={{
          color: "#8d6a36",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".15em",
          textTransform: "uppercase",
        }}
      >
        Piece details
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2.4rem",
          fontWeight: 500,
        }}
      >
        Specification table
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fffaf0",
        }}
      >
        <tbody>
          {activeSpecs.map(([key, value]) => (
            <tr key={key}>
              <th
                style={{
                  width: "35%",
                  padding: ".75rem",
                  border: "1px solid #c4b391",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                {key}
              </th>
              <td
                style={{
                  padding: ".75rem",
                  border: "1px solid #c4b391",
                  color: "#55675b",
                  fontSize: 13,
                }}
              >
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function DeliveryChoices() {
  const [choice, setChoice] = useState("insured");
  return (
    <section style={panel}>
      <p
        style={{
          color: "#8d6a36",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".15em",
          textTransform: "uppercase",
        }}
      >
        Delivery preview
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2.4rem",
          fontWeight: 500,
        }}
      >
        Choose a delivery method
      </h2>
      <p style={{ color: "#5d6c61", lineHeight: 1.6 }}>
        These options help you review the checkout layout. Shipping charges,
        delivery windows, protection, and fulfillment are not active.
      </p>
      <div style={{ display: "grid", gap: ".65rem", marginTop: "1.2rem" }}>
        {[
          ["insured", "Insured delivery", "2–5 business days · Preview only"],
          [
            "appointment",
            "White-glove appointment delivery",
            "Availability will be set by your fulfilment partner",
          ],
          [
            "collection",
            "Showroom collection",
            "Available only after confirming a showroom location",
          ],
        ].map(([id, title, copy]) => (
          <button
            key={id}
            onClick={() => setChoice(id)}
            style={{
              ...tabStyle,
              textAlign: "left",
              background: choice === id ? "#17392c" : "transparent",
              color: choice === id ? "white" : "#1b392d",
            }}
          >
            <b>{title}</b>
            <span
              style={{
                display: "block",
                marginTop: ".25rem",
                fontWeight: 400,
                opacity: 0.8,
              }}
            >
              {copy}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function AccountPreviewViews() {
  const [active, setActive] = useState("Profile");
  const details: Record<string, string> = {
    Profile:
      "Name, email, password and security controls are ready for your customer identity collection.",
    "Orders & returns":
      "Order history, tracking, invoices and return requests will be supplied after live order data is connected.",
    "Bespoke requests":
      "Commission sketches, reference uploads and appointment notes are intentionally preview-only until Atlas and storage are connected.",
    "Gift cards":
      "Balance, purchase and delivery workflows require a live gift-card provider and have not been activated.",
    Privacy:
      "Data export, deletion and consent workflows should be connected after the final privacy policy is approved.",
  };
  return (
    <section style={panel}>
      <p
        style={{
          color: "#8d6a36",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".15em",
          textTransform: "uppercase",
        }}
      >
        Account workspace
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2.4rem",
          fontWeight: 500,
        }}
      >
        Manage your preview
      </h2>
      <div
        style={{
          display: "flex",
          gap: ".45rem",
          flexWrap: "wrap",
          margin: "1rem 0",
        }}
      >
        {Object.keys(details).map(x => (
          <button
            onClick={() => setActive(x)}
            key={x}
            style={{
              ...tabStyle,
              background: active === x ? "#17392c" : "transparent",
              color: active === x ? "white" : "#1b392d",
            }}
          >
            {x}
          </button>
        ))}
      </div>
      <article
        style={{
          minHeight: 145,
          padding: "1.25rem",
          background: "#e9decd",
          border: "1px solid #b9a789",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.7rem",
          }}
        >
          {active}
        </h3>
        <p style={{ maxWidth: 620, color: "#58685d", lineHeight: 1.6 }}>
          {details[active]}
        </p>
        <button style={tabStyle}>Open {active.toLowerCase()} preview</button>
      </article>
    </section>
  );
}

export function AdminWorkflowViews() {
  const [active, setActive] = useState("Catalogue");
  const details: Record<string, string> = {
    Catalogue:
      "Create pieces, manage variants, attach certification, and schedule collection visibility after your MongoDB Atlas source is connected.",
    Customers:
      "Review customer records, segments, service notes, and privacy requests from a real customer data source.",
    Campaigns:
      "Plan campaign windows, homepage stories, coupons, and gift-card messaging. Coupon creation remains disabled in this preview.",
    Fulfilment:
      "Configure inventory locations, packing workflow, shipping regions, insured delivery, and return handling.",
    SEO: "Edit titles, descriptions, redirects, structured data, and social-preview content per page.",
    Permissions:
      "Assign least-privilege staff roles for content, operations, customer care, and finance.",
    "Audit log":
      "Review content, catalogue, order, and permission-change records after a live audit data source is configured.",
  };
  return (
    <section style={{ ...panel, background: "#0e211b", color: "#f4f0e7" }}>
      <p
        style={{
          color: "#d5ad67",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".15em",
          textTransform: "uppercase",
        }}
      >
        Admin operations
      </p>
      <h2
        style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: "2.4rem",
          fontWeight: 500,
        }}
      >
        Structured preview workflows
      </h2>
      <div
        style={{
          display: "flex",
          gap: ".45rem",
          flexWrap: "wrap",
          margin: "1rem 0",
        }}
      >
        {Object.keys(details).map(x => (
          <button
            onClick={() => setActive(x)}
            key={x}
            style={{
              ...tabStyle,
              borderColor: "#5d7a6b",
              background: active === x ? "#d5ad67" : "transparent",
              color: active === x ? "#10261d" : "#e9ede5",
            }}
          >
            {x}
          </button>
        ))}
      </div>
      <article
        style={{
          minHeight: 150,
          padding: "1.25rem",
          background: "#142e24",
          border: "1px solid #466456",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#d5ad67",
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.7rem",
          }}
        >
          {active}
        </h3>
        <p style={{ maxWidth: 720, color: "#c5d1c5", lineHeight: 1.6 }}>
          {details[active]}
        </p>
        <button
          style={{ ...tabStyle, borderColor: "#d5ad67", color: "#d5ad67" }}
        >
          Open {active.toLowerCase()} workspace
        </button>
      </article>
    </section>
  );
}
