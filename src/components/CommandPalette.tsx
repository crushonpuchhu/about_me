"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/lib/content";
import { useApp } from "./Providers";

type Item = {
  id: string;
  label: string;
  hint: string;
  group: string;
  run: () => void;
};

export default function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    toggleTheme,
    theme,
    setAccent,
    accent,
    toggleGrid,
  } = useApp();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const close = () => setPaletteOpen(false);

  const go = (href: string) => {
    close();
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  const items = useMemo<Item[]>(() => {
    const nav: Item[] = [
      { id: "work", label: "Work", hint: "01", group: "Go to", run: () => go("/#work") },
      { id: "services", label: "Services", hint: "02", group: "Go to", run: () => go("/services") },
      { id: "about", label: "About", hint: "03", group: "Go to", run: () => go("/about") },
      { id: "contact", label: "Contact", hint: "04", group: "Go to", run: () => go("/contact") },
    ];
    const actions: Item[] = [
      {
        id: "theme",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        hint: "T",
        group: "Appearance",
        run: () => {
          toggleTheme();
          close();
        },
      },
      ...(["blue", "orange", "lime"] as const).map((a) => ({
        id: `accent-${a}`,
        label: `Accent · ${a}`,
        hint: accent === a ? "●" : "○",
        group: "Appearance",
        run: () => {
          setAccent(a);
          close();
        },
      })),
      {
        id: "grid",
        label: "Toggle 12-column grid",
        hint: "G",
        group: "Appearance",
        run: () => {
          toggleGrid();
          close();
        },
      },
      {
        id: "email",
        label: `Copy email · ${site.email}`,
        hint: "copy",
        group: "Elsewhere",
        run: () => {
          navigator.clipboard?.writeText(site.email);
          close();
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: "↗",
        group: "Elsewhere",
        run: () => go(site.github),
      },
    ];
    return [...nav, ...actions];
  }, [theme, accent, toggleTheme, setAccent, toggleGrid, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q) ||
        i.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setActive(0);
  }, [query, paletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQuery("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
  }, [paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[active]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, filtered, active]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!paletteOpen) return null;

  let lastGroup = "";

  return (
    <div
      className="palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="palette__panel">
        <input
          ref={inputRef}
          className="palette__input"
          placeholder="Search pages, actions, accents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search commands"
        />
        <div className="palette__list" role="listbox" ref={listRef}>
          {filtered.length === 0 && (
            <p className="note" style={{ padding: "1rem" }}>
              Nothing matches “{query}”.
            </p>
          )}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <div key={item.id}>
                {header && <p className="note palette__group">{header}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className="palette__opt"
                  onPointerEnter={() => setActive(i)}
                  onClick={item.run}
                >
                  <span>{item.label}</span>
                  <span className="note">{item.hint}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="palette__foot note">
          <span>↑↓ to move · ↵ to run · esc to close</span>
          <span>⌘K</span>
        </div>
      </div>
    </div>
  );
}
