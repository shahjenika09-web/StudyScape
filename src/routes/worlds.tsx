import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { WorldCard } from "@/components/worlds/WorldCard";
import { WORLDS } from "@/data/worlds";
import { formatDuration } from "@/lib/format";
import { useStudyScape } from "@/state/store";

export const Route = createFileRoute("/worlds")({
  head: () => ({
    meta: [
      { title: "Choose a World — StudyScape" },
      {
        name: "description",
        content:
          "Eight hand-built study worlds — a Japanese room, a fantasy library, a snow cabin and more. Unlock new places as your focus hours grow.",
      },
      { property: "og:title", content: "Choose a World — StudyScape" },
      { property: "og:description", content: "Pick the room you want to spend your next focus session inside." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorldsPage,
});

function WorldsPage() {
  const navigate = useNavigate();
  const { selectedWorldId, selectWorld, progress } = useStudyScape();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            ← StudyScape
          </Link>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">Worlds</h1>
          <p className="mt-1.5 max-w-md text-[13px] text-muted-foreground">
            Each place has its own light, architecture and view. Pick one and the room becomes your session.
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground">
          Total focus <span className="text-foreground">{formatDuration(progress.totalSeconds)}</span>
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORLDS.map((world) => (
          <WorldCard
            key={world.id}
            world={world}
            active={world.id === selectedWorldId}
            onSelect={(id) => {
              selectWorld(id);
              void navigate({ to: "/focus" });
            }}
          />
        ))}
      </div>
    </main>
  );
}
