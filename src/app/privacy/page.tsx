import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How this site handles data: it mostly does not.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        label="[00] Privacy"
        aside="Short, because there is little to say"
        title={["No cookies.", "No banners.", "No trackers."]}
        lead="This is a static portfolio. There is no analytics script, no advertising pixel and no cookie wall, so there is nothing to consent to."
      />

      <section className="section wrap">
        <div className="prose">
          <h2 className="h3" id="cookies">Cookies and storage</h2>
          <p>
            The site stores two preferences in your browser&apos;s local storage:
            the colour theme and the accent colour. A third value in session
            storage remembers that you have already seen the loading animation.
            None of it leaves your device, and clearing site data removes it.
          </p>

          <h2 className="h3">Hosting</h2>
          <p>
            Like every website, the server that delivers these files receives
            your IP address and user agent in order to send a response. No
            request logs are kept beyond what the host requires to operate.
          </p>

          <h2 className="h3">Contact</h2>
          <p>
            If you email me, I keep the message so I can reply. Ask and I will
            delete it. Write to{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
