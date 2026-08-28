import React from "react";

const panel: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "3.5rem 1.5rem",
  color: "#143025",
  background: "#f5efe3",
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
