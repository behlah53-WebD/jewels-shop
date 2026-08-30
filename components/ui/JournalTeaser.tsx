import React, { memo } from "react";
import Link from "next/link";

function JournalTeaserComponent() {
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

export const JournalTeaser = memo(JournalTeaserComponent);

