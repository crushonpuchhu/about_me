"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerT = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type LenisT = {
  raf: (time: number) => void;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  destroy: () => void;
  scrollTo: (
    target: Element | number | string,
    options?: { offset?: number; duration?: number }
  ) => void;
};

export default function Motion() {
  const pathname = usePathname();
  const gsap = useRef<Gsap | null>(null);
  const ScrollTrigger = useRef<ScrollTriggerT | null>(null);
  const lenis = useRef<LenisT | null>(null);
  const triggers = useRef<{ kill: () => void }[]>([]);
  const [ready, setReady] = useState(false);

  // ---- boot: libs, smooth scroll, hero ---------------------------------
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      root.dataset.motion = "ready";
      setReady(true);
      return;
    }

    let cancelled = false;
    let started = false;

    const boot = async () => {
      if (started || cancelled) return;
      started = true;

      const [gsapMod, stMod, lenisMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);

      const g = (gsapMod as unknown as { gsap: Gsap }).gsap ?? (gsapMod as unknown as { default: Gsap }).default;
      const ST =
        (stMod as unknown as { ScrollTrigger: ScrollTriggerT }).ScrollTrigger ??
        (stMod as unknown as { default: ScrollTriggerT }).default;
      const Lenis = (
        lenisMod as unknown as { default: new (options?: unknown) => LenisT }
      ).default;

      g.registerPlugin(ST);
      gsap.current = g;
      ScrollTrigger.current = ST;

      const l = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
      });
      lenis.current = l;
      l.on("scroll", ST.update);
      g.ticker.add((time) => l.raf(time * 1000));
      g.ticker.lagSmoothing(0);

      // in-page anchors
      const onAnchor = (e: MouseEvent) => {
        const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
          'a[href*="#"]'
        );
        if (!a) return;
        const url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname) return;
        const id = url.hash.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        l.scrollTo(target, { offset: -80, duration: 1.1 });
        history.replaceState(null, "", url.hash);
      };
      document.addEventListener("click", onAnchor);

      root.dataset.motion = "ready";
      setReady(true);

      return () => {
        document.removeEventListener("click", onAnchor);
        l.destroy();
      };
    };

    let cleanup: (() => void) | undefined;
    const run = async () => {
      cleanup = await boot();
    };

    if (root.dataset.preloaded === "yes") {
      run();
    } else {
      window.addEventListener("mg:ready", run, { once: true });
    }

    // failsafe: never leave the page hidden if the preloader never finishes
    const failsafe = window.setTimeout(() => {
      if (root.dataset.motion !== "ready") run();
    }, 3200);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      window.removeEventListener("mg:ready", run);
      cleanup?.();
    };
  }, []);

  // ---- per page: reveals, manifesto wipe, process line, hero ------------
  useEffect(() => {
    const g = gsap.current;
    const ST = ScrollTrigger.current;
    if (!ready || !g || !ST) return;

    triggers.current.forEach((t) => t.kill());
    triggers.current = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (hero) {
      const human = hero.querySelector("[data-hero-human]");
      const words = hero.querySelectorAll(".gen-word");
      const fades = hero.querySelectorAll("[data-hero-fade]");

      const tl = g.timeline({ defaults: { ease: "expo.out" } });
      if (human) {
        tl.fromTo(
          human,
          { yPercent: 118, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.15 },
          0
        );
      }
      tl.fromTo(
        words,
        { opacity: 0, yPercent: 60 },
        { opacity: 1, yPercent: 0, duration: 0.75, stagger: 0.022 },
        0.18
      );
      tl.fromTo(
        fades,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
        0.5
      );

      triggers.current.push({
        kill: () => tl.kill(),
      });
    }

    // Scroll scatter: as the hero leaves, every glyph detaches from the line,
    // flies outward from the headline's centre and fades. Scrub keeps it tied to
    // the wheel, and because nothing is pinned the page scrolls on normally.
    const title = hero?.querySelector<HTMLElement>("[data-hero-title]");
    const chars = title
      ? Array.from(title.querySelectorAll<HTMLElement>(".scatter__char"))
      : [];
    if (hero && title && chars.length) {
      const box = title.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const reach = Math.max(box.width, 320);

      const scatter = g.timeline({
        defaults: { ease: "power2.in" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom 10%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      scatter.fromTo(
        chars,
        { y: 0, scale: 1 },
        {
          y: -6,
          scale: 1.015,
          duration: 0.16,
          ease: "power2.out",
          stagger: { each: 0.002, from: "center" },
        },
        0
      );

      chars.forEach((char) => {
        const r = char.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        const norm = Math.hypot(dx, dy) || 1;
        const spread = g.utils.random(reach * 0.35, reach * 1.05);
        const delay = g.utils.random(0, 0.3) + (Math.hypot(dx, dy) / reach) * 0.32;

        scatter.fromTo(
          char,
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
          {
            x: (dx / norm) * spread + g.utils.random(-36, 36),
            y: (dy / norm) * spread + g.utils.random(-72, 18),
            rotation: g.utils.random(-150, 150),
            scale: g.utils.random(0.35, 1.3),
            opacity: 0,
            duration: g.utils.random(0.65, 1.05),
          },
          0.18 + delay
        );
      });

      triggers.current.push({
        kill: () => {
          scatter.scrollTrigger?.kill();
          scatter.kill();
          g.set(chars, { clearProps: "transform,opacity" });
        },
      });
    }

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const tween = g.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        }
      );
      triggers.current.push({ kill: () => tween.scrollTrigger?.kill() });
    });

    document.querySelectorAll<HTMLElement>("[data-wf-solid]").forEach((el) => {
      const tween = g.fromTo(
        el,
        { "--p": 0 },
        {
          "--p": 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
      triggers.current.push({ kill: () => tween.scrollTrigger?.kill() });
    });

    const line = document.querySelector<HTMLElement>("[data-process-line]");
    if (line) {
      const tween = g.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
      triggers.current.push({ kill: () => tween.scrollTrigger?.kill() });
    }

    const t = window.setTimeout(() => ST.refresh(), 120);

    return () => {
      window.clearTimeout(t);
      triggers.current.forEach((x) => x.kill());
      triggers.current = [];
    };
  }, [ready, pathname]);

  return null;
}
