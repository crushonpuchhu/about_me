import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Monogram from "@/components/Monogram";
import { aboutPage, data, site, skillsGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: aboutPage.lead,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { about, education, experience, availability } = data;

  return (
    <>
      <PageHero
        label={aboutPage.label}
        aside={aboutPage.aside}
        title={aboutPage.title}
        lead={aboutPage.lead}
      />

      <section className="section wrap" aria-labelledby="profile-title">
        <header className="section-head">
          <span className="note note--ink" id="profile-title">
            [02] Profile
          </span>
          <span className="note">Plot, not pitch</span>
        </header>

        <div className="about-split">
          <div className="about-copy">
            <p className="lead" data-reveal>
              {about.shortDescription}
            </p>
            <p data-reveal>
              I work at the seam between models and interfaces: the place where
              a promising notebook has to become something a person can open,
              trust and use on a phone with one bar of signal. Most of my work
              is Python on one side, TypeScript on the other, and a lot of
              attention to the states in between.
            </p>
            <p data-reveal>
              I am currently open to {availability.interestedRoles.join(", ")}{" "}
              roles in {availability.preferredLocations.join(" / ")}. I care
              about teams that ship, write things down, and treat design as
              part of the engineering problem rather than decoration.
            </p>
          </div>

          <aside className="fact-card" aria-label="Quick facts">
            <div className="fact-card__head">
              <Monogram />
              <span className="note">{site.revision}</span>
            </div>
            <dl>
              <div className="fact-row">
                <dt className="note">Base</dt>
                <dd>{site.location}</dd>
              </div>
              <div className="fact-row">
                <dt className="note">Hometown</dt>
                <dd>{site.hometown}</dd>
              </div>
              <div className="fact-row">
                <dt className="note">Email</dt>
                <dd>
                  <a className="link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="fact-row">
                <dt className="note">Phone</dt>
                <dd>{site.phone}</dd>
              </div>
              <div className="fact-row">
                <dt className="note">Status</dt>
                <dd>
                  <span className="dot" aria-hidden="true" />
                  {site.availability}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="skills-title">
        <header className="section-head">
          <span className="note note--ink" id="skills-title">
            [03] Toolkit
          </span>
          <span className="note">What I reach for</span>
        </header>

        <div className="skill-table">
          {skillsGroups
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <div key={group.key}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="experience-title">
        <header className="section-head">
          <span className="note note--ink" id="experience-title">
            [04] Experience
          </span>
          <span className="note">Where I have worked</span>
        </header>

        <div className="about-block">
          <span className="about-block__label note">Work</span>
          <div className="about-block__body">
            <div className="timeline">
              {experience.map((job) => (
                <div className="timeline__row" key={`${job.company}-${job.position}`}>
                  <span className="note">
                    {job.startDate} — {job.endDate ?? "now"}
                  </span>
                  <div>
                    <h3 className="h3">
                      {job.position}, {job.company}
                    </h3>
                    <p className="note" style={{ marginTop: ".35rem" }}>
                      {job.location}
                    </p>
                    <p style={{ marginTop: ".75rem", color: "var(--muted)" }}>
                      {job.description}
                    </p>
                    <ul className="chip-row">
                      {job.technologies.map((tech) => (
                        <li key={tech} className="chip">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="about-block">
          <span className="about-block__label note">Education</span>
          <div className="about-block__body">
            <div className="timeline">
              {education
                .slice()
                .reverse()
                .map((entry) => (
                  <div className="timeline__row" key={`${entry.degree}-${entry.year}`}>
                    <span className="note">{entry.year}</span>
                    <div>
                      <h3 className="h3">{entry.degree}</h3>
                      <p style={{ marginTop: ".5rem", color: "var(--muted)" }}>
                        {[entry.college, entry.university, entry.board]
                          .filter(Boolean)
                          .join(" · ")}
                        {entry.stream ? ` · ${entry.stream}` : ""}
                      </p>
                      <p className="note" style={{ marginTop: ".35rem" }}>
                        {entry.location}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="interests-title">
        <header className="section-head">
          <span className="note note--ink" id="interests-title">
            [05] Interests
          </span>
          <span className="note">Things I read about at night</span>
        </header>

        <ul className="chip-row" data-reveal>
          {about.interests.map((interest) => (
            <li key={interest} className="chip">
              {interest}
            </li>
          ))}
        </ul>

        <div className="cta__actions">
          <Link href="/contact" className="btn">
            Send me the hard part <span className="arrow">→</span>
          </Link>
          <Link href="/#work" className="btn btn--ghost">
            See the work
          </Link>
        </div>
      </section>

      <section className="section wrap" id="accessibility">
        <header className="section-head">
          <span className="note note--ink">[06] Accessibility</span>
          <span className="note">Built to be read</span>
        </header>
        <p className="about-note">
          This site is built with semantic HTML, keyboard-reachable controls and
          a visible focus ring. Motion respects{" "}
          <code>prefers-reduced-motion</code>, the palette holds AA contrast for
          body text, and every page works without JavaScript. If something is
          hard to use, email me and I will fix it.
        </p>
      </section>
    </>
  );
}
