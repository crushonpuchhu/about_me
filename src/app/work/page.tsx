import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProjectArt from "@/components/ProjectArt";
import { workItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work: AI agents, automation pipelines and full-stack web applications.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        label="[01] Work"
        aside="Case studies and field reports"
        title={["Four builds,", "one through-line:", "make it usable."]}
        lead="Some of these have names. The client work stays anonymous, so what follows is how the thing was made rather than whose it is."
      />

      <section className="section wrap">
        <div className="work-index">
          {workItems.map((item) => (
            <article className="work-entry" key={item.slug}>
              <div className="work-entry__head">
                <span className="note">{item.index}</span>
                <h2 className="h2">{item.title}</h2>
                <span className="note">{item.year}</span>
              </div>

              <div className="work-entry__body">
                <div className="work-entry__text">
                  <p className="note">{item.client}</p>
                  <p className="lead" style={{ marginTop: "1rem" }}>
                    {item.summary}
                  </p>
                  <ul className="chip-row">
                    {item.stack.split(" · ").map((tech) => (
                      <li className="chip" key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {item.href ? (
                    <div className="cta__actions">
                      <Link href={item.href} className="btn btn--ghost">
                        Read the case study <span className="arrow">→</span>
                      </Link>
                    </div>
                  ) : null}
                </div>

                <div className="work-entry__art">
                  <ProjectArt kind={item.art} step={0} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="cta__actions">
          <Link href="/contact" className="btn">
            Send me the hard part <span className="arrow">→</span>
          </Link>
          <Link href="/services" className="btn btn--ghost">
            What I do
          </Link>
        </div>
      </section>
    </>
  );
}
