"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Monogram from "./Monogram";
import { nav, site } from "@/lib/content";
import { useApp } from "./Providers";

export default function SiteHeader() {
  const pathname = usePathname();
  const { toggleTheme, cycleAccent, setPaletteOpen, theme } = useApp();
  const rule = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (rule.current) {
        rule.current.style.setProperty("--progress", String(p));
      }
      if (tag.current) {
        tag.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="site-header wrap">
      <Link href="/" className="brand" aria-label={`${site.name}, home`}>
        <Monogram className="brand__mark" />
        <span className="brand__name note note--ink">
          {site.name}
          <span className="brand__role"> / {site.roleLine}</span>
        </span>
      </Link>

      <nav className="nav" aria-label="Main">
        <ul>
          {nav.map((item) => {
            const active =
              item.href === "/about"
                ? pathname === "/about"
                : item.href === "/services"
                  ? pathname === "/services"
                  : item.href === "/contact"
                    ? pathname === "/contact"
                    : false;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav__link"
                  aria-current={active ? "page" : undefined}
                >
                  <span className="note" aria-hidden="true">
                    {item.index}
                  </span>
                  <span className="nav__label" data-label={item.label}>
                    <span className="nav__label__inner">{item.label}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="tools">
        <button
          className="tool"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="7.25" />
            <path className="tool__half" d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" />
          </svg>
        </button>
        <button
          className="tool"
          type="button"
          onClick={cycleAccent}
          aria-label="Change accent colour"
        >
          <span className="swatch" aria-hidden="true" />
        </button>
        <button
          className="tool tool--kbd note"
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
        >
          ⌘K
        </button>
        <button
          className="tool tool--menu note"
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
        <Link href="/contact" className="btn header-cta">
          Let&apos;s talk
        </Link>
      </div>

      <div className="hd-rule" aria-hidden="true" ref={rule}>
        <span className="hd-rule__fill" />
        <span className="hd-rule__tag" ref={tag} />
      </div>
    </header>
  );
}
