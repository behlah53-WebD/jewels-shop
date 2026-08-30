"use client";
import React, { useState, memo } from "react";
import { ArrowRight } from "lucide-react";

function NewsletterComponent() {
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
          onSubmit={(e) => {
            e.preventDefault();
            setJoin(true);
          }}
        >
          <input type="email" placeholder="Your email address" required suppressHydrationWarning={true} />
          <button type="submit" aria-label="Subscribe" suppressHydrationWarning={true}>
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

export const Newsletter = memo(NewsletterComponent);

