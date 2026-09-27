import { memo, useEffect, useRef } from "react";

import { WEATHER_PRESETS } from "@/data/weather";
import type { WeatherKind } from "@/data/types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  size: number;
  phase: number;
  alpha: number;
}

interface Props {
  weather: WeatherKind;
  /** extra wind multiplier from the world / windy preset */
  windScale?: number;
  /** 0..1 — dims particles for far windows */
  depth?: number;
  reducedMotion: boolean;
  paused: boolean;
}

const MAX_PARTICLES = 260;

/**
 * Particle weather rendered on a single canvas that is sized to — and clipped
 * by — its window container. Nothing here can ever paint over the room.
 */
function WeatherCanvasImpl({ weather, windScale = 1, depth = 1, reducedMotion, paused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const weatherRef = useRef<WeatherKind>(weather);
  const targetRef = useRef<WeatherKind>(weather);
  const intensityRef = useRef(0);

  useEffect(() => {
    targetRef.current = weather;
  }, [weather]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = (kind: WeatherKind) => {
      const preset = WEATHER_PRESETS[kind];
      const area = width * height;
      const base = Math.round((area / 4200) * preset.density);
      const count = Math.min(MAX_PARTICLES, Math.max(0, base));
      particles = Array.from({ length: count }, () => spawn(kind, true));
    };

    const spawn = (kind: WeatherKind, anywhere: boolean): Particle => {
      const preset = WEATHER_PRESETS[kind];
      const wind = (preset.wind * windScale) / 60;
      if (kind === "snow") {
        return {
          x: Math.random() * width,
          y: anywhere ? Math.random() * height : -8,
          vx: wind * (0.4 + Math.random() * 0.6),
          vy: 14 + Math.random() * 22,
          len: 0,
          size: 1 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.45 + Math.random() * 0.5,
        };
      }
      if (kind === "windy" || kind === "fog") {
        return {
          x: anywhere ? Math.random() * width : -10,
          y: Math.random() * height,
          vx: 60 + Math.random() * 120,
          vy: -6 + Math.random() * 12,
          len: 4 + Math.random() * 10,
          size: 0.8 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.2 + Math.random() * 0.35,
        };
      }
      // rain / thunderstorm
      const speed = 320 + Math.random() * 280;
      return {
        x: Math.random() * (width + 120) - 60,
        y: anywhere ? Math.random() * height : -20,
        vx: wind * 6,
        vy: speed,
        len: 8 + Math.random() * 16,
        size: 0.7 + Math.random() * 0.8,
        phase: 0,
        alpha: 0.25 + Math.random() * 0.4,
      };
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(weatherRef.current);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);

      const kind = weatherRef.current;
      const preset = WEATHER_PRESETS[kind];
      const wantsSwap = targetRef.current !== kind;

      // smooth crossfade: fade the current system out, then swap and fade in
      intensityRef.current += (wantsSwap ? -dt * 0.9 : dt * 0.5) * 1;
      intensityRef.current = Math.max(0, Math.min(1, intensityRef.current));
      if (wantsSwap && intensityRef.current <= 0.001) {
        weatherRef.current = targetRef.current;
        seed(weatherRef.current);
        return;
      }
      if (preset.density <= 0 || intensityRef.current <= 0.001) return;

      const intensity = intensityRef.current * depth;
      ctx.lineCap = "round";

      for (const p of particles) {
        if (kind === "snow") {
          p.phase += dt * 1.6;
          p.x += (p.vx + Math.sin(p.phase) * 10) * dt;
          p.y += p.vy * dt;
          ctx.globalAlpha = p.alpha * intensity;
          ctx.fillStyle = "#f4f7ff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (kind === "windy" || kind === "fog") {
          p.x += p.vx * dt * windScale;
          p.y += (p.vy + Math.sin(p.phase + now / 900) * 8) * dt;
          ctx.globalAlpha = p.alpha * intensity * (kind === "fog" ? 0.5 : 1);
          ctx.strokeStyle = kind === "fog" ? "#dfe6f2" : "#cbd9c6";
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len, p.y + 1.5);
          ctx.stroke();
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          ctx.globalAlpha = p.alpha * intensity;
          ctx.strokeStyle = kind === "thunderstorm" ? "#cfe0ff" : "#c9d8f2";
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 0.03, p.y - p.len);
          ctx.stroke();
        }

        if (p.y > height + 24 || p.x > width + 40 || p.x < -80) {
          Object.assign(p, spawn(kind, false));
        }
      }
      ctx.globalAlpha = 1;
    };

    if (!paused) {
      if (reducedMotion) {
        // draw one static frame so weather is still legible
        intensityRef.current = 1;
        draw(performance.now());
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(draw);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [windScale, depth, reducedMotion, paused]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export const WeatherCanvas = memo(WeatherCanvasImpl);
