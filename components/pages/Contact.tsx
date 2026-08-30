"use client";
import React, { useState } from "react";
import { Clock3, MessageCircle, MapPin } from "lucide-react";
import { Btn } from "@/components/ui/Btn";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main className="page cream hero-lead">
      <section className="contact-hero">
        <p>Contact the atelier</p>
        <h1>
          Let's begin a <i>conversation.</i>
        </h1>
        <span>
          For a thoughtful gift, bespoke commission, care question, or
          appointment request.
        </span>
      </section>
      <section className="section contact-layout">
        <form
          className="contact-form"
          onSubmit={(e) => {
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
                <option>Care &amp; repair</option>
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
