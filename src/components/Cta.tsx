import Link from "next/link";
import { ctaSection } from "@/lib/content";

export default function Cta() {
  return (
    <section className="section wrap cta" id="contact">
      <header className="section-head">
        <span className="note note--ink">{ctaSection.label}</span>
        <span className="note">{ctaSection.aside}</span>
      </header>

      <h2 className="cta__title display" data-reveal>
        {ctaSection.title[0]}
        <br />
        {ctaSection.title[1]}
      </h2>

      <div className="cta__actions">
        <a href={ctaSection.primary.href} className="btn">
          {ctaSection.primary.label} <span className="arrow">↗</span>
        </a>
        <Link href={ctaSection.secondary.href} className="btn btn--ghost">
          {ctaSection.secondary.label}
        </Link>
      </div>
    </section>
  );
}
