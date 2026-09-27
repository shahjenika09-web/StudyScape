import { useEffect, useState } from "react";

import { useStudyScape } from "@/state/store";

/** true when the OS asks for reduced motion or the user enabled it in settings */
export function useReducedMotion(): boolean {
  const { settings } = useStudyScape();
  const [system, setSystem] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystem(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return system || settings.reducedMotion;
}

/** true once the component has mounted on the client */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** true while the tab is visible — animations pause otherwise */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}
