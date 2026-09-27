import type { TimeOfDay, WeatherKind } from "@/data/types";

export type AmbienceLayer =
  | "room"
  | "cafe"
  | "fire"
  | "night"
  | "rain"
  | "heavyRain"
  | "breeze"
  | "gusts"
  | "fogWind"
  | "snowWind"
  | "thunder"
  | "birds"
  | "crickets";

type EventKind = "thunder" | "birds" | "crickets";

interface LayerSpec {
  /** continuous filtered-noise bed; omitted for event-only layers */
  bed?: { type: BiquadFilterType; freq: number; q: number; wobble?: number };
  /** slow swell on the bed's loudness, for gusting wind */
  swell?: { rate: number; depth: number };
  /** occasional one-shot sounds, spaced randomly within [min, max] seconds */
  events?: { kind: EventKind; every: [number, number] };
  gain: number;
  label: string;
}

const LAYERS: Record<AmbienceLayer, LayerSpec> = {
  room: { bed: { type: "lowpass", freq: 340, q: 0.4 }, gain: 0.18, label: "Quiet room tone" },
  cafe: { bed: { type: "bandpass", freq: 700, q: 0.4, wobble: 0.12 }, gain: 0.28, label: "Café murmur" },
  fire: { bed: { type: "lowpass", freq: 480, q: 1.1, wobble: 0.6 }, gain: 0.35, label: "Fire crackle" },
  night: { bed: { type: "lowpass", freq: 260, q: 0.5 }, gain: 0.22, label: "Still night air" },
  rain: { bed: { type: "highpass", freq: 900, q: 0.6 }, gain: 0.5, label: "Rain on the glass" },
  heavyRain: {
    bed: { type: "highpass", freq: 620, q: 0.5 },
    swell: { rate: 0.09, depth: 0.18 },
    gain: 0.62,
    label: "Heavy rain",
  },
  breeze: { bed: { type: "bandpass", freq: 520, q: 0.6, wobble: 0.05 }, gain: 0.2, label: "Soft breeze" },
  gusts: {
    bed: { type: "bandpass", freq: 400, q: 0.8, wobble: 0.1 },
    swell: { rate: 0.13, depth: 0.45 },
    gain: 0.46,
    label: "Gusting wind",
  },
  fogWind: { bed: { type: "lowpass", freq: 300, q: 0.7, wobble: 0.04 }, gain: 0.26, label: "Low, muffled wind" },
  snowWind: {
    bed: { type: "bandpass", freq: 760, q: 1.3, wobble: 0.06 },
    swell: { rate: 0.05, depth: 0.3 },
    gain: 0.18,
    label: "Winter wind over snow",
  },
  thunder: { events: { kind: "thunder", every: [16, 38] }, gain: 0.75, label: "Distant thunder" },
  birds: { events: { kind: "birds", every: [5, 14] }, gain: 0.5, label: "Birdsong outside" },
  crickets: { events: { kind: "crickets", every: [2.5, 7] }, gain: 0.4, label: "Crickets" },
};

interface LayerNodes {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
  timer?: number;
}

/**
 * Ambience is synthesised with the Web Audio API (filtered noise beds plus a
 * few generated one-shots), so the app ships real sound without audio assets.
 * One engine owns every layer; a layer key can only exist once, and anything
 * no longer requested is faded out and stopped.
 */
export class AmbienceEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private layers = new Map<AmbienceLayer, LayerNodes>();
  private noiseBuffer: AudioBuffer | null = null;

  get running() {
    return this.ctx !== null && this.ctx.state === "running";
  }

  async ensure() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
      const length = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      this.noiseBuffer = buffer;
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  private retire(key: AmbienceLayer, nodes: LayerNodes) {
    if (!this.ctx) return;
    if (nodes.timer) window.clearTimeout(nodes.timer);
    nodes.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.6);
    window.setTimeout(() => {
      for (const s of nodes.sources) {
        try {
          s.stop();
        } catch {
          /* already stopped */
        }
      }
      nodes.gain.disconnect();
    }, 2200);
    this.layers.delete(key);
  }

  private createLayer(key: AmbienceLayer, spec: LayerSpec, intensity: number): LayerNodes {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master!);
    gain.gain.setTargetAtTime(spec.gain * intensity, ctx.currentTime, 1.2);
    const nodes: LayerNodes = { gain, sources: [] };

    if (spec.bed && this.noiseBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = this.noiseBuffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = spec.bed.type;
      filter.frequency.value = spec.bed.freq;
      filter.Q.value = spec.bed.q;
      const swell = ctx.createGain();
      swell.gain.value = 1;
      source.connect(filter).connect(swell).connect(gain);
      // offset each bed into the shared buffer so layers don't phase together
      source.start(0, Math.random() * 2.5);
      nodes.sources.push(source);

      if (spec.bed.wobble) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = spec.bed.wobble;
        const depth = ctx.createGain();
        depth.gain.value = spec.bed.freq * 0.35;
        lfo.connect(depth).connect(filter.frequency);
        lfo.start();
        nodes.sources.push(lfo);
      }
      if (spec.swell) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = spec.swell.rate;
        const depth = ctx.createGain();
        depth.gain.value = spec.swell.depth;
        lfo.connect(depth).connect(swell.gain);
        lfo.start();
        nodes.sources.push(lfo);
      }
    }

    if (spec.events) {
      const { kind, every } = spec.events;
      const schedule = (first: boolean) => {
        const [min, max] = every;
        const wait = (first ? min * 0.4 : min) + Math.random() * (max - min);
        nodes.timer = window.setTimeout(() => {
          if (this.layers.get(key) !== nodes) return;
          this.playEvent(kind, gain);
          schedule(false);
        }, wait * 1000);
      };
      schedule(true);
    }
    return nodes;
  }

  /** one-shot sounds routed through their layer's gain, so a layer fade silences them too */
  private playEvent(kind: EventKind, out: GainNode) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;
    const t = ctx.currentTime + 0.05;

    if (kind === "thunder" && this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(260, t);
      lp.frequency.exponentialRampToValueAtTime(90, t + 4);
      const env = ctx.createGain();
      const peak = 0.55 + Math.random() * 0.35;
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(peak, t + 0.35 + Math.random() * 0.4);
      env.gain.exponentialRampToValueAtTime(peak * 0.45, t + 1.4);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 5.5);
      src.connect(lp).connect(env).connect(out);
      src.start(t, Math.random() * 2);
      src.stop(t + 5.8);
      return;
    }

    if (kind === "birds") {
      // a short phrase of two to four chirps
      const notes = 2 + Math.floor(Math.random() * 3);
      const base = 2600 + Math.random() * 1200;
      for (let i = 0; i < notes; i++) {
        const start = t + i * (0.13 + Math.random() * 0.08);
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(base, start);
        osc.frequency.exponentialRampToValueAtTime(base * 1.35, start + 0.05);
        osc.frequency.exponentialRampToValueAtTime(base * 0.9, start + 0.1);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, start);
        env.gain.exponentialRampToValueAtTime(0.05, start + 0.015);
        env.gain.exponentialRampToValueAtTime(0.0001, start + 0.11);
        osc.connect(env).connect(out);
        osc.start(start);
        osc.stop(start + 0.13);
      }
      return;
    }

    if (kind === "crickets") {
      const pulses = 3 + Math.floor(Math.random() * 3);
      const pitch = 4200 + Math.random() * 500;
      for (let i = 0; i < pulses; i++) {
        const start = t + i * 0.065;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = pitch;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, start);
        env.gain.exponentialRampToValueAtTime(0.018, start + 0.008);
        env.gain.exponentialRampToValueAtTime(0.0001, start + 0.035);
        osc.connect(env).connect(out);
        osc.start(start);
        osc.stop(start + 0.04);
      }
    }
  }

  setLayers(layers: AmbienceLayer[], intensity: number) {
    if (!this.ctx || !this.master || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const wanted = new Set(layers);

    for (const [key, nodes] of this.layers) {
      if (!wanted.has(key)) this.retire(key, nodes);
    }

    for (const layer of wanted) {
      const spec = LAYERS[layer];
      const existing = this.layers.get(layer);
      if (existing) {
        existing.gain.gain.setTargetAtTime(spec.gain * intensity, ctx.currentTime, 0.8);
        continue;
      }
      this.layers.set(layer, this.createLayer(layer, spec, intensity));
    }
  }

  setMasterVolume(v: number) {
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.35);
  }

  async stop() {
    if (!this.ctx) return;
    this.setLayers([], 0);
    this.setMasterVolume(0);
    await this.ctx.suspend();
  }

  dispose() {
    this.layers.forEach((n) => {
      if (n.timer) window.clearTimeout(n.timer);
      for (const s of n.sources) {
        try {
          s.stop();
        } catch {
          /* noop */
        }
      }
    });
    this.layers.clear();
    void this.ctx?.close();
    this.ctx = null;
  }
}

const NIGHT: TimeOfDay[] = ["night", "midnight"];
const DAYLIGHT: TimeOfDay[] = ["sunrise", "morning", "afternoon", "golden"];

/**
 * Exactly one weather bed set per weather kind, plus the world's own room
 * character and time-of-day details. Switching weather swaps the whole set.
 */
export function layersFor(
  worldId: string,
  weather: WeatherKind,
  time: TimeOfDay,
  fireOn: boolean,
): AmbienceLayer[] {
  const layers: AmbienceLayer[] = ["room"];
  const wintry = worldId === "snow-cabin" || weather === "snow";
  const calm = weather === "clear" || weather === "cloudy";

  if (worldId === "cozy-cafe") layers.push("cafe");
  if (worldId === "observatory") layers.push("night");

  switch (weather) {
    case "clear":
      break;
    case "cloudy":
      layers.push("breeze");
      break;
    case "rain":
      layers.push("rain");
      break;
    case "thunderstorm":
      layers.push("heavyRain", "gusts", "thunder");
      break;
    case "snow":
      layers.push("snowWind");
      break;
    case "fog":
      layers.push("fogWind");
      break;
    case "windy":
      layers.push("gusts");
      break;
  }

  // the world's own outdoors on calm days
  if (calm && worldId === "snow-cabin") layers.push("snowWind");
  if (calm && (worldId === "japanese-room" || worldId === "treehouse")) layers.push("breeze");

  if (NIGHT.includes(time)) {
    layers.push("night");
    if (calm && !wintry) layers.push("crickets");
  } else if (weather === "clear" && DAYLIGHT.includes(time) && !wintry) {
    layers.push("birds");
  }

  if (fireOn) layers.push("fire");
  return Array.from(new Set(layers));
}

export function describeLayers(layers: AmbienceLayer[]): string[] {
  return layers.map((l) => LAYERS[l].label);
}
