import { useEffect, type ReactNode } from "react";

/** Right-hand cinematic console shared by every session panel. */
export function SidePanel({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <aside
      aria-hidden={!open}
      className="pointer-events-none absolute inset-y-0 right-0 z-30 flex w-full max-w-[380px] p-3 sm:p-5"
    >
      <div
        className="glass-panel pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-[26px] transition-all duration-500"
        style={{
          transform: open ? "translateX(0)" : "translateX(112%)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transitionTimingFunction: "var(--ease-cinema)",
        }}
      >
        {children}
      </div>
    </aside>
  );
}
