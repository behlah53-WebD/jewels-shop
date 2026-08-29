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
  border: "1px solid #c8bc9e",
  background: "transparent",
  color: "#1b392d",
  padding: ".85rem 1rem",
  fontSize: 12,
  borderRadius: "10px",
  transition: "all 0.18s ease",
};

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
              cursor: "pointer",
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
