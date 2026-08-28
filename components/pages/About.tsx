import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { imgs } from "@/lib/data";
import { Title } from "@/components/ui/Title";

export function About() {
  return (
    <main className="page cream hero-lead">
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
