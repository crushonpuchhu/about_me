"use client";

import { useEffect, useRef } from "react";

/**
 * Contour terrain.
 * A cheap height field (a handful of sine waves plus two gaussian peaks) sampled
 * on a small grid and drawn with marching squares. The pointer raises a peak —
 * "point anywhere to raise the hard part".
 */

const COLS = 92;
const ROWS = 58;
const LEVELS = 16;
const MAX_DPR = 2;

type Peak = { x: number; y: number; amp: number; sigma: number };

function heightAt(u: number, v: number, t: number, peaks: Peak[]) {
  let h =
    Math.sin(u * 7.4 + t * 0.35) * 0.3 +
    Math.cos(v * 6.1 - t * 0.28) * 0.26 +
    Math.sin((u + v) * 4.6 + t * 0.18) * 0.2 +
    Math.cos(u * 13.2 - v * 9.7 + t * 0.12) * 0.12 +
    Math.sin(u * 21.5 + v * 17.4 - t * 0.09) * 0.06;

  for (const p of peaks) {
    const dx = u - p.x;
    const dy = (v - p.y) * 1.6;
    h += p.amp * Math.exp(-(dx * dx + dy * dy) / (2 * p.sigma * p.sigma));
  }
  return h;
}

export default function TerrainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let running = true;

    const pointer = { x: 0.72, y: 0.32, tx: 0.72, ty: 0.32 };
    const peaks: Peak[] = [
      { x: 0.78, y: 0.22, amp: 0.75, sigma: 0.17 },
      { x: 0.18, y: 0.72, amp: 0.42, sigma: 0.22 },
      { x: pointer.x, y: pointer.y, amp: 0, sigma: 0.13 },
    ];
    const userPeak = peaks[2];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const colors = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      return {
        line: dark ? "rgba(237,237,231,0.15)" : "rgba(14,14,13,0.145)",
        ridge: dark ? "rgba(237,237,231,0.36)" : "rgba(14,14,13,0.36)",
        accent: dark ? "rgba(91,124,255,0.6)" : "rgba(47,91,255,0.55)",
      };
    };

    const draw = (now: number) => {
      if (width < 2 || height < 2) return;
      const t = reduced ? 0 : now / 1000;
      ctx.clearRect(0, 0, width, height);

      const c = colors();
      const stepX = 1 / (COLS - 1);
      const stepY = 1 / (ROWS - 1);

      // sample the field once per frame
      const field = new Float32Array(COLS * ROWS);
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          field[j * COLS + i] = heightAt(i * stepX, j * stepY, t, peaks);
        }
      }

      let min = Infinity;
      let max = -Infinity;
      for (let k = 0; k < field.length; k++) {
        if (field[k] < min) min = field[k];
        if (field[k] > max) max = field[k];
      }

      ctx.lineWidth = 1;
      const ridge = Math.round(LEVELS * 0.62);

      for (let l = 0; l < LEVELS; l++) {
        const level = min + ((l + 0.5) / LEVELS) * (max - min);
        // one bold ridge, the two highest rings pick up the accent
        const isAccent = l >= LEVELS - 2;
        const isRidge = l === ridge;
        ctx.lineWidth = isRidge ? 1.5 : 1;
        ctx.strokeStyle = isAccent ? c.accent : isRidge ? c.ridge : c.line;
        ctx.globalAlpha = isAccent ? 0.9 : 1;
        ctx.beginPath();

        for (let j = 0; j < ROWS - 1; j++) {
          for (let i = 0; i < COLS - 1; i++) {
            const a = field[j * COLS + i];
            const b = field[j * COLS + i + 1];
            const c2 = field[(j + 1) * COLS + i + 1];
            const d = field[(j + 1) * COLS + i];

            let idx = 0;
            if (a > level) idx |= 1;
            if (b > level) idx |= 2;
            if (c2 > level) idx |= 4;
            if (d > level) idx |= 8;
            if (idx === 0 || idx === 15) continue;

            const x0 = i * stepX * width;
            const x1 = (i + 1) * stepX * width;
            const y0 = j * stepY * height;
            const y1 = (j + 1) * stepY * height;

            const top = x0 + ((level - a) / (b - a || 1e-6)) * (x1 - x0);
            const bottom = x0 + ((level - d) / (c2 - d || 1e-6)) * (x1 - x0);
            const left = y0 + ((level - a) / (d - a || 1e-6)) * (y1 - y0);
            const right = y0 + ((level - b) / (c2 - b || 1e-6)) * (y1 - y0);

            const seg = (xa: number, ya: number, xb: number, yb: number) => {
              ctx.moveTo(xa, ya);
              ctx.lineTo(xb, yb);
            };

            switch (idx) {
              case 1:
              case 14:
                seg(x0, left, top, y0);
                break;
              case 2:
              case 13:
                seg(top, y0, x1, right);
                break;
              case 3:
              case 12:
                seg(x0, left, x1, right);
                break;
              case 4:
              case 11:
                seg(x1, right, bottom, y1);
                break;
              case 6:
              case 9:
                seg(top, y0, bottom, y1);
                break;
              case 7:
              case 8:
                seg(x0, left, bottom, y1);
                break;
              case 5:
                seg(x0, left, top, y0);
                seg(x1, right, bottom, y1);
                break;
              case 10:
                seg(top, y0, x1, right);
                seg(x0, left, bottom, y1);
                break;
            }
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // crosshair at the peak — the "you are here" mark
      const px = pointer.x * width;
      const py = pointer.y * height;
      ctx.strokeStyle = c.accent;
      ctx.beginPath();
      ctx.moveTo(px - 6, py);
      ctx.lineTo(px + 6, py);
      ctx.moveTo(px, py - 6);
      ctx.lineTo(px, py + 6);
      ctx.stroke();
    };

    const loop = (now: number) => {
      if (!running) return;
      // ~30fps is plenty for contour lines
      if (now - last > 33) {
        last = now;
        pointer.x += (pointer.tx - pointer.x) * 0.08;
        pointer.y += (pointer.ty - pointer.y) * 0.08;
        userPeak.x = pointer.x;
        userPeak.y = pointer.y;
        userPeak.amp += (0.95 - userPeak.amp) * 0.08;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = (e.clientY - rect.top) / rect.height;
    };

    const onLeave = () => {
      pointer.tx = 0.72;
      pointer.ty = 0.32;
      userPeak.amp = 0;
    };

    const onTheme = () => draw(performance.now());

    resize();
    canvas.classList.add("is-on");

    if (!reduced) {
      raf = requestAnimationFrame(loop);
      if (fine) {
        window.addEventListener("pointermove", onPointer, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-accent"],
    });

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running && !reduced) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="hero-gl" aria-hidden="true" />;
}
