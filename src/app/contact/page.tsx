import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${site.name}. ${site.availability}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="[04] Contact"
        aside="30 minutes, no deck required"
        title={["Tell me what", "you’re building."]}
        lead="A paragraph is enough to start. I will reply with questions, a rough scope and an honest answer about whether I am the right person for it."
      />

      <section className="section wrap">
        <div className="contact-grid">
          <div className="contact-card">
            <p className="note">Direct</p>
            <div>
              <div className="contact-row">
                <span className="note">Email</span>
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>
              <div className="contact-row">
                <span className="note">Phone</span>
                <a className="link" href={`tel:${site.phone.replace(/\s/g, "")}`}>
                  {site.phone}
                </a>
              </div>
              <div className="contact-row">
                <span className="note">GitHub</span>
                <a
                  className="link"
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  crushonpuchhu ↗
                </a>
              </div>
              <div className="contact-row">
                <span className="note">Base</span>
                <span>{site.location}</span>
              </div>
              <div className="contact-row">
                <span className="note">Status</span>
                <span className="dot-line">
                  <span className="dot" aria-hidden="true" />
                  {site.availability}
                </span>
              </div>
            </div>

            <p className="note" style={{ marginTop: "1.5rem" }}>
              Replies usually within a day. For a call, email a time window and
              I will send an invite.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
