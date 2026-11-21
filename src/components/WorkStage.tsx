"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { workItems, workSection } from "@/lib/content";
import ProjectArt from "./ProjectArt";

const pad = (n: number) => String(n).padStart(2, "0");

export default function WorkStage() {
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [steps, setSteps] = useState<number[]>(() => workItems.map(() => 0));

  useEffect(() => {
    const stageEl = stage.current;
    const viewportEl = viewport.current;
    const trackEl = track.current;
    if (!stageEl || !viewportEl || !trackEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1100px)");

    const resetInline = () => {
      trackEl.style.removeProperty("transform");
      trackEl.style.removeProperty("will-change");
      stageEl
        .querySelectorAll<HTMLElement>(".ws__item")
        .forEach((el) => {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
          el.style.removeProperty("visibility");
          el.style.removeProperty("pointer-events");
          el.removeAttribute("inert");
        });
    };

    if (reduced) {
      resetInline();
      return;
    }

    let cleanup = () => {};

    const setup = async () => {
      if (!desktop.matches) {
        resetInline();
        return;
      }
      const [gsapMod, stMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const n = workItems.length;
      const nodes = Array.from(
        stageEl.querySelectorAll<HTMLElement>(".ws__item")
      );
      const bars = Array.from(
        stageEl.querySelectorAll<HTMLElement>(".ws__stages li i")
      );
      const labels = Array.from(
        stageEl.querySelectorAll<HTMLElement>(".ws__stages li")
      );
      const dots = Array.from(stageEl.querySelectorAll<HTMLElement>(".ws__rail i"));

      // one case study per scroll segment, including the gap between panels
      const step = () =>
        Math.max(
          0,
          (trackEl.scrollWidth - viewportEl.clientWidth) / Math.max(1, n - 1)
        );

      const clamp = (v: number) => Math.max(0, Math.min(n - 1, v));

      // Plot / Build / Live bars fill across the case currently on screen
      const setBars = (local: number) => {
        bars.forEach((bar, i) => {
          const v = Math.max(0, Math.min(1, local * 3 - i));
          bar.style.setProperty("--p", v.toFixed(3));
        });
        labels.forEach((label, i) => {
          label.toggleAttribute("data-on", local * 3 > i);
        });
      };

      let current = -1;

      // Vertical scroll picks the case; GSAP slides the track until that panel
      // sits flush in the viewport, so a case is never left half on screen.
      const goTo = (idx: number, instant = false) => {
        const next = clamp(idx);
        if (next !== current || instant) {
          current = next;
          if (count.current) count.current.textContent = pad(next + 1);
          // only the case in the viewport is reachable by keyboard / clicks
          nodes.forEach((el, i) => el.toggleAttribute("inert", i !== next));
          dots.forEach((dot, i) => dot.toggleAttribute("data-on", i <= next));
          gsap.to(trackEl, {
            x: () => -next * step(),
            duration: instant ? 0 : 0.85,
            ease: "power3.inOut",
            overwrite: true,
          });
        }
      };

      goTo(0, true);
      setBars(0);

      const trigger = ScrollTrigger.create({
        trigger: stageEl,
        start: "top 88px",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          goTo(Math.floor(self.progress * n), true);
          setBars(Math.min(1, Math.max(0, self.progress * n - current)));
        },
        onUpdate: (self) => {
          const raw = self.progress * n;
          let idx = Math.floor(raw);
          // deadband: resting on a boundary must not re-fire the slide
          if (idx > current && raw < current + 1.08) idx = current;
          if (idx < current && raw > current - 0.08) idx = current;
          goTo(idx);
          setBars(Math.min(1, Math.max(0, raw - current)));
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);

      cleanup = () => {
        trigger.kill();
        gsap.killTweensOf(trackEl);
        resetInline();
      };
    };

    setup();
    const onChange = () => {
      cleanup();
      cleanup = () => {};
      setup();
    };
    desktop.addEventListener("change", onChange);
    return () => {
      desktop.removeEventListener("change", onChange);
      cleanup();
    };
  }, []);

  return (
    <section className="section wrap" id="work">
      <header className="section-head">
        <span className="note note--ink">{workSection.label}</span>
        <span className="note">{workSection.aside}</span>
      </header>

      <p className="work__intro lead" data-reveal>
        {workSection.intro}
      </p>

      <div
        className="work-stage"
        ref={stage}
        style={{ ["--stage-count" as string]: workItems.length }}
      >
        <div className="work-stage__sticky">
          <div className="ws__count" aria-hidden="true">
            <span className="ws__n" ref={count}>
              01
            </span>
            <span className="ws__of outline-text">/{pad(workItems.length)}</span>
          </div>

          <div className="ws__viewport" ref={viewport}>
            <div className="ws__track" ref={track}>
              {workItems.map((item, i) => (
                <article
                  className="ws__item"
                  key={item.slug}
                  aria-labelledby={`ws-title-${item.slug}`}
                >
                  <div className="ws__text">
                    <div className="ws__meta note">
                      <span>
                        {item.index} / {item.year}
                      </span>
                      <span>{item.stack}</span>
                    </div>
                    <h2 className="h3 ws__title" id={`ws-title-${item.slug}`}>
                      {item.title}
                    </h2>
                    <p className="ws__client note">{item.client}</p>
                    <p className="ws__summary">{item.summary}</p>
                    <div className="ws__actions">
                      {item.action && (
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() =>
                            setSteps((prev) =>
                              prev.map((v, k) => (k === i ? v + 1 : v))
                            )
                          }
                        >
                          {item.action.label} <span className="arrow">↻</span>
                        </button>
                      )}
                      {item.href && (
                        <Link href={item.href} className="btn">
                          Read the case study <span className="arrow">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="ws__art" data-action={item.action ? "true" : undefined}>
                    <ProjectArt kind={item.art} step={steps[i]} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="ws__stages note" aria-hidden="true">
            <ol>
              <li data-on="">
                <span>01</span>
                <i />
                <b>Plot</b>
              </li>
              <li>
                <span>02</span>
                <i />
                <b>Build</b>
              </li>
              <li>
                <span>03</span>
                <i />
                <b>Live</b>
              </li>
            </ol>
            <div className="ws__rail">
              {workItems.map((item, i) => (
                <i key={item.slug} data-on={i === 0 ? "" : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
