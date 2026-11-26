"use client";
import { useState, useSyncExternalStore } from "react";
import { Results } from "@/components/Results";
import { useLive } from "@/components/useLive";
import { pollById, type LiveView, type Poll } from "@/lib/polls";

let fallbackId: string | null = null;

const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");

/** One anonymous random id per device, so changing your mind replaces your vote. */
function voterId() {
  try {
    let id = localStorage.getItem("p2p:voter");
    if (!id) {
      id = newId();
      localStorage.setItem("p2p:voter", id);
    }
    return id;
  } catch {
    return (fallbackId ??= newId());
  }
}

const never = () => () => {};

export default function VotePage() {
  const voter = useSyncExternalStore(never, voterId, () => null);
  const { view, error, refresh } = useLive({ voter, enabled: voter !== null });
  const poll = view?.state.pollId ? pollById.get(view.state.pollId) : undefined;

  return (
    <div className="mx-auto max-w-xl">
      {error && <p role="alert" className="mb-4 text-amber">{error}</p>}
      {!view && !error && <p className="text-mute">Connecting…</p>}
      {view && !poll && (
        <div className="card py-12 text-center">
          <h1 className="text-2xl font-bold">You&apos;re in</h1>
          <p className="mt-2 text-mute">Keep this page open. The next question appears here by itself.</p>
        </div>
      )}
      {view && poll && voter && <Question key={poll.id} poll={poll} view={view} voter={voter} onSent={refresh} />}
    </div>
  );
}

function Question({ poll, view, voter, onSent }: { poll: Poll; view: LiveView; voter: string; onSent: () => void }) {
  const [draft, setDraft] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const mine = view.mine ?? sent;

  async function send(answer: string) {
    setSending(true);
    setProblem(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter, pollId: poll.id, answer }),
      });
      if (res.ok) {
        setSent(answer);
        onSent();
      } else {
        setProblem((await res.json()).error ?? "Your vote wasn't saved");
      }
    } catch {
      setProblem("Your vote wasn't saved. Check your connection and try again.");
    }
    setSending(false);
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">{poll.group}</p>
      <h1 className="mb-5 mt-1 text-2xl font-bold">{poll.question}</h1>

      {view.state.revealed ? (
        <Results poll={poll} view={view} />
      ) : poll.kind === "choice" ? (
        <div className="space-y-3">
          {poll.options.map((option, i) => (
            <button
              key={option}
              type="button"
              disabled={!view.state.open || sending}
              aria-pressed={mine === String(i)}
              onClick={() => send(String(i))}
              className={`w-full cursor-pointer rounded-xl border px-4 py-4 text-left disabled:cursor-not-allowed disabled:opacity-60 ${mine === String(i) ? "border-mint bg-mint/15" : "border-line bg-panel"}`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="space-y-3"
        >
          <input className="field" maxLength={80} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Your answer (it may be shown on screen)" aria-label="Your answer" disabled={!view.state.open} />
          <button className="btn" disabled={!view.state.open || sending || !draft.trim()}>Send</button>
        </form>
      )}

      {view.answer && <p className="mt-4 card">{view.answer.why}</p>}
      <p className="mt-4 text-sm text-mute" aria-live="polite">
        {problem ?? (view.state.revealed ? "Results are in." : !view.state.open ? "Voting is closed." : mine !== null ? "Saved. You can still change it." : "Voting is open.")}
      </p>
    </div>
  );
}
