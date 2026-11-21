"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import CommandPalette from "./CommandPalette";
import Cursor from "./Cursor";
import Preloader from "./Preloader";

export type Theme = "light" | "dark";
export type Accent = "blue" | "orange" | "lime";

type AppState = {
  theme: Theme;
  accent: Accent;
  paletteOpen: boolean;
  gridOn: boolean;
  setPaletteOpen: (open: boolean) => void;
  toggleTheme: () => void;
  cycleAccent: () => void;
  setAccent: (accent: Accent) => void;
  toggleGrid: () => void;
};

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

const ACCENTS: Accent[] = ["blue", "orange", "lime"];

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [accent, setAccentState] = useState<Accent>("blue");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [gridOn, setGridOn] = useState(false);

  // adopt whatever the boot script already decided
  useEffect(() => {
    const root = document.documentElement;
    const t = root.dataset.theme === "dark" ? "dark" : "light";
    const a = root.dataset.accent as Accent | undefined;
    setTheme(t);
    if (a && ACCENTS.includes(a)) setAccentState(a);
  }, []);

  const setAccent = useCallback((next: Accent) => {
    setAccentState(next);
    document.documentElement.dataset.accent = next;
    try {
      localStorage.setItem("mg-accent", next);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("mg-theme", next);
      } catch {}
      return next;
    });
  }, []);

  const cycleAccent = useCallback(() => {
    setAccentState((prev) => {
      const next = ACCENTS[(ACCENTS.indexOf(prev) + 1) % ACCENTS.length];
      document.documentElement.dataset.accent = next;
      try {
        localStorage.setItem("mg-accent", next);
      } catch {}
      return next;
    });
  }, []);

  const toggleGrid = useCallback(() => setGridOn((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
      if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === "g") {
        setGridOn((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      theme,
      accent,
      paletteOpen,
      gridOn,
      setPaletteOpen,
      toggleTheme,
      cycleAccent,
      setAccent,
      toggleGrid,
    }),
    [theme, accent, paletteOpen, gridOn, toggleTheme, cycleAccent, setAccent, toggleGrid]
  );

  return (
    <AppContext.Provider value={value}>
      <Preloader />
      {children}
      <div
        className={`grid-overlay ${gridOn ? "is-on" : ""}`}
        aria-hidden="true"
      >
        <div className="grid-12">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
      <CommandPalette />
      <Cursor />
    </AppContext.Provider>
  );
}
