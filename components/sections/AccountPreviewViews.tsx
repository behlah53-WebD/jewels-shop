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
              cursor: "pointer",
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
        <button style={{ ...tabStyle, cursor: "pointer" }}>Open {active.toLowerCase()} preview</button>
      </article>
    </section>
  );
}
