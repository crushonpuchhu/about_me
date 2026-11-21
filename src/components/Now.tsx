import Link from "next/link";
import { nowSection } from "@/lib/content";

export default function Now() {
  return (
    <section className="section wrap" id="now">
      <header className="section-head">
        <span className="note note--ink">{nowSection.label}</span>
        <Link href={nowSection.allHref} className="note link">
          {nowSection.allLabel}
        </Link>
      </header>

      <ul className="posts">
        {nowSection.items.map((item) => (
          <li key={item.title}>
            <Link href={nowSection.allHref} className="post">
              <span className="post__date note">{item.date}</span>
              <span className="post__title h3">{item.title}</span>
              <span className="post__pillar note">{item.pillar}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
