import { useCallback, useEffect, useRef, useState } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "complete";

interface TimerState {
  status: TimerStatus;
  /** wall-clock ms when the current run leg started */
  legStart: number | null;
  /** ms accumulated across finished legs */
  accumulated: number;
  durationMs: number;
}

export interface FocusTimer {
  status: TimerStatus;
  elapsed: number;
  remaining: number;
  duration: number;
  progress: number;
  start: (minutes: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  end: () => number;
  setDuration: (minutes: number) => void;
}

/**
 * Wall-clock based timer: elapsed time is derived from Date.now(), so it stays
 * accurate when the tab is backgrounded and interval callbacks are throttled.
 */
export function useFocusTimer(
  defaultMinutes = 25,
  onComplete?: (seconds: number) => void,
): FocusTimer {
  const [state, setState] = useState<TimerState>({
    status: "idle",
    legStart: null,
    accumulated: 0,
    durationMs: defaultMinutes * 60_000,
  });
  const [, force] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  // latest committed state, so `end` can report elapsed time synchronously
  const stateRef = useRef(state);
  stateRef.current = state;

  const elapsedMs = (s: TimerState) =>
    s.accumulated + (s.status === "running" && s.legStart ? Date.now() - s.legStart : 0);

  useEffect(() => {
    if (state.status !== "running") return;
    const tick = () => {
      force((n) => n + 1);
      if (elapsedMs(state) >= state.durationMs && !completedRef.current) {
        completedRef.current = true;
        const seconds = Math.round(state.durationMs / 1000);
        setState((s) => ({
          ...s,
          status: "complete",
          accumulated: s.durationMs,
          legStart: null,
        }));
        onCompleteRef.current?.(seconds);
      }
    };
    const id = window.setInterval(tick, 250);
    const onVisible = () => tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [state]);

  const elapsed = Math.min(elapsedMs(state), state.durationMs) / 1000;
  const duration = state.durationMs / 1000;

  const start = useCallback((minutes: number) => {
    completedRef.current = false;
    setState({
      status: "running",
      legStart: Date.now(),
      accumulated: 0,
      durationMs: Math.max(1, minutes) * 60_000,
    });
  }, []);

  const pause = useCallback(() => {
    setState((s) =>
      s.status === "running"
        ? {
            ...s,
            status: "paused",
            accumulated: s.accumulated + (s.legStart ? Date.now() - s.legStart : 0),
            legStart: null,
          }
        : s,
    );
  }, []);

  const resume = useCallback(() => {
    setState((s) => (s.status === "paused" ? { ...s, status: "running", legStart: Date.now() } : s));
  }, []);

  const reset = useCallback(() => {
    completedRef.current = false;
    setState((s) => ({ ...s, status: "idle", legStart: null, accumulated: 0 }));
  }, []);

  const end = useCallback(() => {
    // React may run state updaters lazily, so read elapsed time from the ref
    // rather than from inside setState (which could still report 0 here)
    const s = stateRef.current;
    const seconds = Math.round(Math.min(elapsedMs(s), s.durationMs) / 1000);
    setState((prev) => ({ ...prev, status: "idle", legStart: null, accumulated: 0 }));
    completedRef.current = false;
    return seconds;
  }, []);

  const setDuration = useCallback((minutes: number) => {
    setState((s) => ({ ...s, durationMs: Math.max(1, minutes) * 60_000 }));
  }, []);

  return {
    status: state.status,
    elapsed,
    remaining: Math.max(0, duration - elapsed),
    duration,
    progress: duration > 0 ? Math.min(1, elapsed / duration) : 0,
    start,
    pause,
    resume,
    reset,
    end,
    setDuration,
  };
}
