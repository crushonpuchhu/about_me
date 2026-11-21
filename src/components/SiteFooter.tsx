import Link from "next/link";
import { footer, site } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="site-footer wrap">
      <div className="footer-top">
        <p className="footer-claim h3">
          {footer.claim[0]} <span>{footer.claim[1]}</span>{" "}
          <Link href="/contact" className="accent link">
            {footer.claimLink}
          </Link>
        </p>

        {footer.columns.map((col) => (
          <div className="footer-col" key={col.title}>
            <span className="note">{col.title}</span>
            <ul>
              {col.links.map((link) =>
                "external" in link && link.external ? (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-sign">
        <p className="footer-mark" aria-hidden="true">
          {footer.signature}
        </p>

        <div className="footer-spec" aria-label="No tracking on this site">
          <div className="footer-stats">
            {footer.stats.map((stat) => (
              <div key={stat.label}>
                <span>{stat.label}</span>
                <b>{stat.value}</b>
              </div>
            ))}
          </div>
          <Link href="/privacy" className="footer-spec__note note">
            <span>Privacy spec · {site.revision}</span>
            <span>Read →</span>
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="note">{footer.bottom}</span>
        <span className="note">{footer.hints}</span>
        <nav className="note" aria-label="Legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/privacy#cookies">Cookies</Link>
          <Link href="/about#accessibility">Accessibility</Link>
        </nav>
      </div>
    </footer>
  );
}
