import { useState } from "react";

import { ActionButton, PanelHeader } from "@/components/ui/primitives";
import { getWorld } from "@/data/worlds";
import { useStudyScape } from "@/state/store";

export function NotesPanel({ onClose }: { onClose?: () => void }) {
  const { notes, addNote, deleteNote } = useStudyScape();
  const [draft, setDraft] = useState("");

  const save = () => {
    const body = draft.trim();
    if (!body) return;
    addNote(body);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Notes" subtitle="Catch a thought without leaving the room" {...(onClose ? { onClose } : {})} />

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="Write something down…"
            aria-label="New note"
            className="w-full resize-none rounded-2xl border border-[var(--hairline)] bg-white/[0.04] px-3.5 py-3 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-white/25 focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <ActionButton onClick={save} disabled={!draft.trim()}>
              Save note
            </ActionButton>
          </div>
        </div>

        <div className="space-y-2">
          {notes.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[var(--hairline)] px-4 py-6 text-center text-[12px] text-muted-foreground">
              Nothing written yet.
            </p>
          )}
          {notes.map((note) => (
            <article
              key={note.id}
              className="group rounded-2xl border border-[var(--hairline)] bg-white/[0.03] px-3.5 py-3 transition hover:bg-white/[0.06]"
            >
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">{note.body}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>
                  {getWorld(note.worldId).name} · {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 transition hover:text-[var(--destructive)] focus-visible:opacity-100 group-hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
