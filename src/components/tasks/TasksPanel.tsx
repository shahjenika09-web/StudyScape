import { useState } from "react";

import { ActionButton, Meter, PanelHeader, SectionLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { useStudyScape, type Task } from "@/state/store";

const PRIORITIES: Task["priority"][] = ["low", "medium", "high"];

const PRIORITY_STYLE: Record<Task["priority"], string> = {
  low: "border-white/12 text-muted-foreground",
  medium: "border-[color-mix(in_oklab,var(--primary)_45%,transparent)] text-[color-mix(in_oklab,var(--primary)_80%,white)]",
  high: "border-[color-mix(in_oklab,var(--destructive)_45%,transparent)] text-[color-mix(in_oklab,var(--destructive)_80%,white)]",
};

export function TasksPanel({ onClose }: { onClose?: () => void }) {
  const { tasks, addTask, toggleTask, deleteTask } = useStudyScape();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");

  const done = tasks.filter((t) => t.done).length;
  const ratio = tasks.length ? done / tasks.length : 0;

  const submit = () => {
    const value = title.trim();
    if (!value) return;
    addTask(value, priority);
    setTitle("");
  };

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Tasks" subtitle="What this session is for" {...(onClose ? { onClose } : {})} />

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <section>
          <div className="flex gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Add a task…"
              aria-label="Task title"
              className="min-w-0 flex-1 rounded-xl border border-[var(--hairline)] bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-white/25 focus:outline-none"
            />
            <ActionButton onClick={submit} disabled={!title.trim()} className="px-4">
              Add
            </ActionButton>
          </div>
          <div className="mt-2 flex gap-1.5">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                aria-pressed={priority === p}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition",
                  priority === p
                    ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-foreground"
                    : "border-[var(--hairline)] text-muted-foreground hover:text-foreground",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>
            Progress — {done}/{tasks.length || 0} done
          </SectionLabel>
          <Meter value={ratio} />
        </section>

        <section className="space-y-2">
          {tasks.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[var(--hairline)] px-4 py-6 text-center text-[12px] text-muted-foreground">
              No tasks yet. Add one to give this session a shape.
            </p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-start gap-3 rounded-2xl border border-[var(--hairline)] bg-white/[0.03] px-3.5 py-3 transition-all duration-300 hover:bg-white/[0.06]",
                task.done && "opacity-55",
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={task.done}
                aria-label={`Mark ${task.title} as ${task.done ? "not done" : "done"}`}
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
                  task.done
                    ? "border-transparent bg-[image:var(--gradient-ember)]"
                    : "border-white/25 hover:border-white/50",
                )}
              >
                {task.done && (
                  <svg width="11" height="9" viewBox="0 0 11 9" aria-hidden="true">
                    <path d="M1 4.5 L4 7.5 L10 1" stroke="oklch(0.2 0.03 40)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className={cn("text-[13px] leading-snug text-foreground", task.done && "line-through")}>
                  {task.title}
                </p>
                <span
                  className={cn(
                    "mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest",
                    PRIORITY_STYLE[task.priority],
                  )}
                >
                  {task.priority}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
                className="mt-0.5 rounded-full p-1 text-muted-foreground opacity-0 transition hover:text-[var(--destructive)] focus-visible:opacity-100 group-hover:opacity-100"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
