import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Process from "@/components/Process";
import { services, servicesSection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI engineering, full-stack development and product UI — scoped, built and handed over.",
  alternates: { canonical: "/services" },
};

const detail: Record<string, string[]> = {
  ai: [
    "A working prototype of the one workflow worth automating",
    "Retrieval, evaluation and guardrails you can inspect",
    "An honest list of what should stay manual",
  ],
  fullstack: [
    "A typed Next.js front end and a documented API",
    "Auth, data model, migrations and seeds",
    "Staging from day one, production when you say go",
  ],
  design: [
    "A small token layer: colour, type, spacing, motion",
    "Components with the states nobody draws",
    "Responsive layouts checked at 390, 768 and 1440",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label={servicesSection.label}
        aside="Three ways in"
        title={["Models, products,", "and the interface", "between them."]}
        lead="Most projects need two of the three. I scope around the workflow that has to work, build it, and leave the codebase in a state your team can pick up."
      />

      {services.map((service, i) => {
        const key = service.href.split("#")[1] ?? "";
        return (
          <section className="section wrap" id={key} key={service.index}>
            <header className="section-head">
              <span className="note note--ink">
                [{String(i + 1).padStart(2, "0")}] {service.title}
              </span>
              <span className="note">{service.tags.join(" · ")}</span>
            </header>

            <div className="service-detail">
              <h2 className="h2 service-detail__title">{service.title}</h2>
              <div className="service-detail__body">
                <p className="lead">{service.body}</p>
                <ul className="bullet-list">
                  {(detail[key] ?? []).map((line) => (
                    <li key={line}>
                      <span aria-hidden="true">—</span> {line}
                    </li>
                  ))}
                </ul>
                <div className="cta__actions">
                  <Link href="/contact" className="btn">
                    Start with this <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Process />
    </>
  );
}
