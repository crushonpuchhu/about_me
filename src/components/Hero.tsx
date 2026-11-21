import Link from "next/link";
import { hero } from "@/lib/content";
import TerrainCanvas from "./TerrainCanvas";
import Blueprint from "./Blueprint";
import ScatterText from "./ScatterText";

const words = hero.machine.split(" ");

export default function Hero() {
  return (
    <section className="hero wrap has-terrain" data-hero>
      <div className="hero__top note">
        {hero.meta.map((item, i) => (
          <span key={item} className={i === 1 ? "hide-sm" : undefined}>
            {item}
          </span>
        ))}
      </div>

      <h1
        className="hero__title"
        data-hero-title
        aria-label={`${hero.human} ${hero.machine}`}
      >
        <span
          className="hero__human display"
          data-hero-human
          data-bp="h1.human"
          aria-hidden="true"
        >
          <ScatterText text={hero.human} />
        </span>
        <span
          className="hero__machine h2"
          data-hero-generate
          data-bp="h1.machine"
          aria-hidden="true"
        >
          <ScatterText text={hero.machine} wordClassName="gen-word" />
        </span>
      </h1>

      <div className="hero__notes">
        <p className="note" data-hero-fade>
          <span className="note--accent">●</span> {hero.notes.human}
        </p>
        <p className="note" data-hero-fade>
          <span className="note--accent">◆</span> {hero.notes.machine} ·{" "}
          <span data-gen-tokens>{words.length}</span> tokens ·{" "}
          <span data-gen-ms>1266</span> ms
        </p>
        <p className="note hero__terrain" aria-hidden="true">
          <span className="note--accent">▲</span> {hero.notes.terrain}
        </p>
      </div>

      <div className="hero__foot">
        <p className="hero__intro lead" data-hero-fade data-bp="p.lead">
          {hero.intro}
        </p>
        <div className="hero__ctas" data-hero-fade data-bp="nav.cta">
          <Link href={hero.primaryCta.href} className="btn">
            {hero.primaryCta.label} <span className="arrow">→</span>
          </Link>
          <Link href={hero.secondaryCta.href} className="btn btn--ghost">
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>

      <TerrainCanvas />
      <Blueprint />
    </section>
  );
}
