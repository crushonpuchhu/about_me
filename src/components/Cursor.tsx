"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !root.current) return;

    const el = root.current;
    const h = el.querySelector<HTMLElement>(".cursor__h");
    const v = el.querySelector<HTMLElement>(".cursor__v");
    const pt = el.querySelector<HTMLElement>(".cursor__pt");
    const label = el.querySelector<HTMLElement>(".cursor__label");
    if (!h || !v || !pt || !label) return;

    document.documentElement.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const render = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      pt.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      h.style.transform = `translate3d(0, ${y}px, 0)`;
      v.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add("is-visible");
      const target = e.target as HTMLElement | null;
      const hit = target?.closest<HTMLElement>("[data-cursor], a, button");
      if (hit) {
        el.classList.add("is-hover");
        label.textContent =
          hit.dataset.cursor ??
          (hit.tagName === "A" && hit.getAttribute("target") === "_blank"
            ? "open ↗"
            : "");
        label.style.display = label.textContent ? "block" : "none";
      } else {
        el.classList.remove("is-hover");
        label.textContent = "";
        label.style.display = "none";
      }
    };

    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");
    const onLeave = () => el.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true" ref={root}>
      <span className="cursor__h" />
      <span className="cursor__v" />
      <span className="cursor__pt">
        <span className="cursor__ring" />
        <span className="cursor__label note" />
      </span>
    </div>
  );
}
