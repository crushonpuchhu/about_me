import { manifesto } from "@/lib/content";

export default function Manifesto() {
  return (
    <section className="section wrap manifesto" aria-labelledby="manifesto-title">
      <header className="section-head">
        <span className="note note--ink">{manifesto.label}</span>
        <span className="note">{manifesto.figure}</span>
      </header>

      <h2 id="manifesto-title" className="sr-only">
        Manifesto
      </h2>

      {manifesto.lines.map((line, i) => (
        <div className="wf-row" key={line}>
          <p className="wf-line h1">
            <span className="outline-text" aria-hidden="true">
              {line}
            </span>
            <span className="wf-solid" data-wf-solid>
              <span className="wf-solid__inner">{line}</span>
            </span>
          </p>
          <span className="wf-dim note" aria-hidden="true">
            {manifesto.annotations[i]}
          </span>
        </div>
      ))}

      <div className="manifesto__body grid-12">
        <p className="lead" data-reveal>
          {manifesto.body}
        </p>
      </div>
    </section>
  );
}
