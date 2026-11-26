"use client";
import { useState } from "react";
import { Results } from "@/components/Results";
import { useLive } from "@/components/useLive";
import { pollById, polls } from "@/lib/polls";

const groups = [...new Set(polls.map((p) => p.group))];

export default function HostPage() {
  const [draft, setDraft] = useState("");
  const [key, setKey] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const { view, error, refresh } = useLive({ hostKey: key, interval: 2000, enabled: key !== "" });
  const poll = view?.state.pollId ? pollById.get(view.state.pollId) : undefined;

  async function act(action: string, extra: Record<string, string> = {}) {
    setProblem(null);
    try {
      const res = await fetch("/api/host", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-host-key": key },
        body: JSON.stringify({ action, ...extra }),
      });
      if (!res.ok) setProblem((await res.json()).error ?? "That didn't work");
    } catch {
      setProblem("Can't reach the server");
    }
    refresh();
  }

  if (!view) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setKey(draft);
        }}
        className="card mx-auto max-w-sm space-y-3"
      >
        <h1 className="text-xl font-bold">Presenter</h1>
        <input type="password" className="field" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Presenter key" aria-label="Presenter key" />
        <button className="btn" disabled={!draft}>Open controls</button>
        {key && error && <p role="alert" className="text-amber">{error}</p>}
      </form>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <nav aria-label="Questions" className="space-y-4">
        {groups.map((group) => (
          <div key={group}>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-mute">{group}</h2>
            {polls.filter((p) => p.group === group).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => act("show", { pollId: p.id })}
                className={`mb-1 block w-full cursor-pointer rounded-lg border px-3 py-2 text-left text-sm ${poll?.id === p.id ? "border-mint bg-mint/15" : "border-line hover:border-mint"}`}
              >
                {p.question}
              </button>
            ))}
          </div>
        ))}
        <button
          type="button"
          className="btn-ghost w-full text-sm !text-amber"
          onClick={() => {
            if (window.confirm("Delete every vote for every question?")) act("clear-all");
          }}
        >
          Reset all votes
        </button>
      </nav>

      <section>
        {!view.persistent && (
          <p className="mb-4 rounded-xl border border-amber p-3 text-amber">
            No shared database is connected. Votes are kept in memory: fine on your computer, unreliable on Vercel.
          </p>
        )}
        {(problem ?? error) && <p role="alert" className="mb-3 text-amber">{problem ?? error}</p>}
        <div className="mb-5 flex flex-wrap gap-2">
          <a href="/screen" target="_blank" className="btn-ghost">Open projector screen</a>
          {poll && (
            <>
              <button type="button" className="btn" onClick={() => act("toggle-reveal")}>{view.state.revealed ? "Hide results" : "Reveal results"}</button>
              <button type="button" className="btn-ghost" onClick={() => act("toggle-open")} disabled={view.state.revealed}>{view.state.open ? "Close voting" : "Reopen voting"}</button>
              <button type="button" className="btn-ghost" onClick={() => act("clear")}>Clear this question</button>
              <button type="button" className="btn-ghost" onClick={() => act("idle")}>Back to waiting</button>
            </>
          )}
        </div>
        {poll ? (
          <>
            <h1 className="text-2xl font-bold">{poll.question}</h1>
            <p className="mb-4 mt-1 text-mute">
              {view.total} answered · {view.state.open ? "voting open" : "voting closed"} · {view.state.revealed ? "results visible to everyone" : "only you see results"}
            </p>
            <Results poll={poll} view={view} onRemove={(voter) => act("remove", { voter })} />
          </>
        ) : (
          <p className="text-mute">Pick a question to send it to everyone&apos;s phone.</p>
        )}
      </section>
    </div>
  );
}
