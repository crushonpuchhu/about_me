"use client";

import { useEffect, useRef } from "react";

/**
 * Blueprint annotation layer over the hero: dashed measurement boxes around the
 * type, two column guides, and labels that read like a spec sheet.
 */
export default function Blueprint() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.parentElement;
    if (!root || !hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let done = false;

    const build = () => {
      raf = 0;
      if (done) return;
      root.innerHTML = "";
      const heroRect = hero.getBoundingClientRect();
      const gutter = parseFloat(getComputedStyle(hero).paddingLeft) || 0;

      // column guides at 5/12 and 9/12
      [5, 9].forEach((col) => {
        const x = gutter + ((heroRect.width - gutter * 2) * col) / 12;
        const v = document.createElement("span");
        v.className = "bp__guide bp__guide--v";
        v.style.left = `${x}px`;
        v.style.transform = "scaleY(0)";
        v.style.transition = "transform 1.1s cubic-bezier(.76,0,.24,1)";
        root.appendChild(v);
        requestAnimationFrame(() => {
          v.style.transform = "scaleY(1)";
        });
      });

      const targets = hero.querySelectorAll<HTMLElement>("[data-bp]");
      targets.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const box = document.createElement("div");
        box.className = "bp__box";
        box.style.left = `${r.left - heroRect.left}px`;
        box.style.top = `${r.top - heroRect.top}px`;
        box.style.width = `${r.width}px`;
        box.style.height = `${r.height}px`;
        box.style.opacity = "0";
        box.style.transition = `opacity .5s cubic-bezier(.25,1,.5,1) ${0.25 + i * 0.12}s`;

        const label = document.createElement("span");
        label.className = "bp__label";
        label.textContent = `${el.dataset.bp} · ${Math.round(r.width)}×${Math.round(r.height)}`;
        box.appendChild(label);

        root.appendChild(box);
        requestAnimationFrame(() => {
          box.style.opacity = "1";
        });
      });

      // a crosshair where the first guide meets the title baseline
      const cross = document.createElement("span");
      cross.className = "bp__cross";
      cross.style.left = `${gutter + ((heroRect.width - gutter * 2) * 5) / 12}px`;
      cross.style.top = `${heroRect.height * 0.52}px`;
      root.appendChild(cross);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(build);
    };

    const timer = window.setTimeout(schedule, 220);

    // Like the reference: the spec layer is an entrance device, not permanent.
    // It fades out once the hero intro has settled, then the DOM is cleared.
    const exit = window.setTimeout(() => {
      done = true;
      root.style.transition = "opacity 0.9s cubic-bezier(0.25, 1, 0.5, 1)";
      root.style.opacity = "0";
      window.setTimeout(() => {
        root.innerHTML = "";
      }, 1000);
    }, 2400);

    const ro = new ResizeObserver(schedule);
    ro.observe(hero);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(exit);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <div className="bp" aria-hidden="true" ref={ref} />;
}
