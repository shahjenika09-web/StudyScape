export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h === 0 && m === 0) return `${s}s`;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export const MAX_SESSION_HOURS = 12;

/**
 * Validates the free-form hours/minutes session input. Empty fields count as
 * zero; anything that isn't a whole number is rejected rather than coerced.
 */
export function parseSessionLength(
  hours: string,
  minutes: string,
): { ok: true; minutes: number } | { ok: false; error: string } {
  const h = hours.trim();
  const m = minutes.trim();
  if (h === "" && m === "") return { ok: false, error: "Enter how long you want to focus." };
  if (!/^\d*$/.test(h) || !/^\d*$/.test(m)) return { ok: false, error: "Use whole numbers only." };
  const hh = h === "" ? 0 : Number(h);
  const mm = m === "" ? 0 : Number(m);
  if (mm > 59) return { ok: false, error: "Minutes must be between 0 and 59." };
  const total = hh * 60 + mm;
  if (total <= 0) return { ok: false, error: "Duration must be longer than zero." };
  if (total > MAX_SESSION_HOURS * 60) {
    return { ok: false, error: `Sessions can be at most ${MAX_SESSION_HOURS} hours.` };
  }
  return { ok: true, minutes: total };
}

export function hoursOf(seconds: number): number {
  return seconds / 3600;
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}
