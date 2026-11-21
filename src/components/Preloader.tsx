"use client";

import { useEffect, useRef, useState } from "react";
import Monogram from "./Monogram";
import { site } from "@/lib/content";

const DURATION = 900;
const LIFT = 900;

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const frame = useRef<number>(0);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.preloaded === "yes") {
      setVisible(false);
      return;
    }

    setVisible(true);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // ease-out so the last numbers linger like a real counter
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        root.dataset.preloaded = "yes";
        try {
          sessionStorage.setItem("mg-preloaded", "yes");
        } catch {}
        window.setTimeout(() => {
          root.dataset.motion = "ready";
          window.dispatchEvent(new CustomEvent("mg:ready"));
          setVisible(false);
        }, LIFT + 80);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" data-done={done} aria-hidden="true">
      <div className="preloader__meta note">
        <span>Plotting {site.name.toLowerCase().replace(/\s+/g, "")}.com</span>
        <span>{site.revision}</span>
      </div>
      <Monogram className="preloader__mark" plotting />
      <div className="preloader__meta note">
        <span>Human + machine</span>
        <span className="preloader__count">{count}%</span>
      </div>
    </div>
  );
}
