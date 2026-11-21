import Link from "next/link";
import { services, servicesSection } from "@/lib/content";

export default function Services() {
  return (
    <section className="section wrap" id="services">
      <header className="section-head">
        <span className="note note--ink">{servicesSection.label}</span>
        <Link href={servicesSection.allHref} className="note link">
          {servicesSection.allLabel}
        </Link>
      </header>

      <div className="services">
        {services.map((service) => (
          <div className="service" key={service.index}>
            <Link
              href={service.href}
              className="service__link"
              data-cursor="read →"
            >
              <span className="service__n note">{service.index}</span>
              <h2 className="service__title h2">{service.title}</h2>
              <p className="service__body">{service.body}</p>
              <ul className="service__tags note">
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <span className="service__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
