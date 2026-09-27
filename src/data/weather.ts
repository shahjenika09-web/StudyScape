import type { WeatherKind } from "./types";

export interface WeatherPreset {
  id: WeatherKind;
  label: string;
  /** particle density multiplier, 0 = none */
  density: number;
  /** base wind push in px/s applied to outdoor particles */
  wind: number;
  /** how much the outdoor sky is dimmed / greyed */
  overcast: number;
  /** fog thickness outside the glass */
  haze: number;
  lightning: boolean;
  /** how much water sits on the glass */
  glassWet: number;
  ambience: string;
}

export const WEATHER_PRESETS: Record<WeatherKind, WeatherPreset> = {
  clear: { id: "clear", label: "Clear", density: 0, wind: 8, overcast: 0, haze: 0.04, lightning: false, glassWet: 0, ambience: "Still air" },
  cloudy: { id: "cloudy", label: "Cloudy", density: 0, wind: 22, overcast: 0.45, haze: 0.14, lightning: false, glassWet: 0, ambience: "Soft overcast" },
  rain: { id: "rain", label: "Rain", density: 1, wind: 46, overcast: 0.6, haze: 0.2, lightning: false, glassWet: 0.75, ambience: "Rainfall" },
  thunderstorm: { id: "thunderstorm", label: "Thunderstorm", density: 1.35, wind: 80, overcast: 0.78, haze: 0.26, lightning: true, glassWet: 0.9, ambience: "Storm" },
  snow: { id: "snow", label: "Snow", density: 0.85, wind: 18, overcast: 0.5, haze: 0.3, lightning: false, glassWet: 0.2, ambience: "Snowfall" },
  fog: { id: "fog", label: "Fog", density: 0.2, wind: 10, overcast: 0.3, haze: 0.82, lightning: false, glassWet: 0.15, ambience: "Fog" },
  windy: { id: "windy", label: "Windy", density: 0.5, wind: 120, overcast: 0.22, haze: 0.1, lightning: false, glassWet: 0, ambience: "Gusts" },
};

export const WEATHER_ORDER: WeatherKind[] = [
  "clear",
  "cloudy",
  "rain",
  "thunderstorm",
  "snow",
  "fog",
  "windy",
];
