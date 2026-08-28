"use client";
import React, { useState } from "react";

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
              cursor: "pointer",
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
          style={{ ...tabStyle, borderColor: "#d5ad67", color: "#d5ad67", cursor: "pointer" }}
        >
          Open {active.toLowerCase()} workspace
        </button>
      </article>
    </section>
  );
}
