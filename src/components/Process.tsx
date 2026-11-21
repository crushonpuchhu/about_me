import { processSection } from "@/lib/content";

export default function Process() {
  return (
    <section className="section wrap" id="process">
      <header className="section-head">
        <span className="note note--ink">{processSection.label}</span>
        <span className="note">{processSection.aside}</span>
      </header>

      <h2 className="process__claim h2" data-reveal>
        {processSection.claim[0]}
        <br />
        {processSection.claim[1]}
      </h2>

      <div className="process__line" data-process-line aria-hidden="true" />

      <ol className="process grid-12">
        {processSection.steps.map((step) => (
          <li className="step" key={step.index}>
            <span className="step__dot" aria-hidden="true" />
            <span className="note">{step.index}</span>
            <h3 className="step__title">{step.title}</h3>
            <p className="step__body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
