type Props = {
  label: string;
  aside: string;
  title: string[];
  lead?: string;
};

export default function PageHero({ label, aside, title, lead }: Props) {
  return (
    <section className="page-hero wrap">
      <div className="page-hero__top note">
        <span className="note--ink">{label}</span>
        <span>{aside}</span>
      </div>
      <h1 className="h1">
        {title.map((line) => (
          <span key={line} style={{ display: "block" }}>
            {line}
          </span>
        ))}
      </h1>
      {lead && (
        <div className="page-hero__lead">
          <p className="lead">{lead}</p>
        </div>
      )}
    </section>
  );
}
