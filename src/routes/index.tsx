import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { ButterflyEffect } from "@/components/home/ButterflyEffect";
import { ActionButton, Meter, ToggleRow } from "@/components/ui/primitives";
import { WorldScene } from "@/components/worlds/WorldScene";
import { WORLDS, getWorld } from "@/data/worlds";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDuration, greeting, hoursOf } from "@/lib/format";
import { useStudyScape } from "@/state/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyScape — Focus Inside a World You Love" },
      {
        name: "description",
        content:
          "StudyScape turns a focus session into a place. Enter a cosy room, start the timer, and watch the weather move outside your window.",
      },
      { property: "og:title", content: "StudyScape — Focus Inside a World You Love" },
      {
        property: "og:description",
        content: "An immersive focus timer set inside hand-built study worlds with living weather and light.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const {
    hydrated,
    progress,
    selectedWorldId,
    selectWorld,
    atmosphereFor,
    settings,
    updateSettings,
    isUnlocked,
    unlockProgress,
  } = useStudyScape();

  const reducedMotion = useReducedMotion();
  const world = getWorld(selectedWorldId);
  const atmo = atmosphereFor(world.id);
  const hasHistory = progress.sessions.length > 0;

  const recent = Array.from(new Set(progress.sessions.map((s) => s.worldId)))
    .slice(0, 4)
    .map(getWorld);
  const nextLocked = WORLDS.find((w) => !isUnlocked(w.id));

  const stats = [
    { label: "Total focus", value: formatDuration(progress.totalSeconds) },
    { label: "Today", value: formatDuration(progress.todaySeconds) },
    { label: "Sessions", value: String(progress.sessions.length) },
    { label: "Longest", value: formatDuration(progress.longestSeconds) },
  ];

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Butterflies exist only here — no study world mounts this component. */}
      <ButterflyEffect />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-2xl"
              style={{ background: "var(--gradient-ember)" }}
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="oklch(0.2 0.03 40)" strokeWidth="1.6">
                <path d="M2 4h5a2 2 0 0 1 2 2v7a2 2 0 0 0-2-2H2zM14 4H9a2 2 0 0 0-2 2v7a2 2 0 0 1 2-2h5z" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="font-display text-lg leading-none tracking-tight text-foreground">StudyScape</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Focus, somewhere beautiful</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/worlds"
              className="rounded-full border border-[var(--hairline)] px-4 py-2 text-[12px] text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              All worlds
            </Link>
            <button
              type="button"
              onClick={() => updateSettings({ devMode: !settings.devMode })}
              aria-pressed={settings.devMode}
              title="Developer Mode unlocks every world and weather for testing"
              className={
                settings.devMode
                  ? "rounded-full border border-[oklch(0.8_0.16_75_/_55%)] bg-[oklch(0.3_0.08_60_/_60%)] px-3 py-2 font-mono text-[11px] font-bold text-[oklch(0.92_0.13_85)] transition hover:brightness-110"
                  : "rounded-full border border-[var(--hairline)] px-3 py-2 font-mono text-[11px] text-muted-foreground transition hover:text-foreground"
              }
            >
              {settings.devMode ? "DEV MODE: on" : "dev"}
            </button>
          </div>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* hero: the currently selected world, alive */}
          <div className="glass-panel overflow-hidden rounded-[30px]">
            <div className="relative aspect-[16/10] w-full">
              <WorldScene
                className="absolute inset-0 overflow-hidden"
                world={world}
                time={atmo.time}
                weather={atmo.weather}
                features={atmo.features}
                reducedMotion={reducedMotion}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[oklch(0.12_0.025_312_/_92%)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Current world</p>
                <h1 className="mt-1 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
                  {/* the server's clock can differ from the visitor's, so greet after hydration */}
                  {hydrated ? greeting() : "Welcome back"} — your {world.name.toLowerCase()} is waiting
                </h1>
                <p className="mt-1.5 max-w-lg text-[13px] text-muted-foreground">{world.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ActionButton onClick={() => navigate({ to: "/focus" })}>
                    {hasHistory ? "Continue focus" : "Start focus"}
                  </ActionButton>
                  <ActionButton variant="ghost" onClick={() => navigate({ to: "/worlds" })}>
                    Change world
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

          {/* stats + progression */}
          <div className="space-y-4">
            <div className="glass-panel grid grid-cols-2 gap-px overflow-hidden rounded-[26px]">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/[0.02] px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-2xl text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-[26px] px-5 py-5">
              <h2 className="font-display text-base text-foreground">Next world</h2>
              {nextLocked ? (
                <>
                  <div className="mt-3 flex items-baseline justify-between text-[12px]">
                    <span className="text-foreground">{nextLocked.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {hoursOf(progress.totalSeconds).toFixed(1)} / {nextLocked.unlockHours} h
                    </span>
                  </div>
                  <Meter className="mt-2" value={unlockProgress(nextLocked.id).ratio} />
                  <p className="mt-2 text-[11px] text-muted-foreground">{nextLocked.tagline}</p>
                </>
              ) : (
                <p className="mt-2 text-[12px] text-muted-foreground">Every world is open to you.</p>
              )}
            </div>

            <div className="glass-panel rounded-[26px] px-5 py-5">
              <ToggleRow
                label="Reduced motion"
                description="Calms the camera and environment animation"
                checked={settings.reducedMotion}
                onChange={(v) => updateSettings({ reducedMotion: v })}
              />
            </div>
          </div>
        </section>

        {recent.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Recent worlds</h2>
            <div className="flex flex-wrap gap-2">
              {recent.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => selectWorld(w.id)}
                  className="rounded-full border border-[var(--hairline)] bg-white/[0.03] px-4 py-2 text-[12px] text-muted-foreground transition hover:bg-white/[0.07] hover:text-foreground"
                >
                  {w.name}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Worlds</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORLDS.slice(0, 4).map((w) => {
              const a = atmosphereFor(w.id);
              const unlocked = isUnlocked(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => selectWorld(w.id)}
                  className="group relative overflow-hidden rounded-3xl border border-[var(--hairline)] text-left transition hover:border-white/25 disabled:cursor-not-allowed"
                >
                  <div className="relative aspect-[16/10]">
                    <WorldScene
                      className="absolute inset-0 overflow-hidden"
                      world={w}
                      time={a.time}
                      weather={a.weather}
                      features={a.features}
                      reducedMotion={reducedMotion}
                      paused={!unlocked}
                      lite
                    />
                    {!unlocked && (
                      <div className="absolute inset-0 grid place-items-center bg-[oklch(0.1_0.02_310_/_70%)] text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-[2px]">
                        {w.unlockHours} h to unlock
                      </div>
                    )}
                  </div>
                  <p className="bg-[oklch(0.15_0.028_315_/_85%)] px-3.5 py-2.5 text-[12px] text-foreground backdrop-blur-xl">
                    {w.name}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
