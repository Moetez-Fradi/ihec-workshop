"use client";
import { QrCode } from "@/components/QrCode";
import { Results } from "@/components/Results";
import { useLive } from "@/components/useLive";
import { pollById } from "@/lib/polls";

export default function ScreenPage() {
  const { view, error } = useLive({ interval: 2000 });
  const poll = view?.state.pollId ? pollById.get(view.state.pollId) : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
      <div>
        {error && <p role="alert" className="text-amber">{error}</p>}
        {!poll ? (
          <div className="py-10">
            <h1 className="text-5xl font-bold">Scan to join</h1>
            <p className="mt-3 text-xl text-mute">The next question will show up here.</p>
          </div>
        ) : (
          <>
            <p className="font-semibold uppercase tracking-widest text-mint">{poll.group}</p>
            <h1 className="mb-6 mt-2 text-4xl font-bold">{poll.question}</h1>
            {view!.state.revealed ? (
              <Results poll={poll} view={view!} big />
            ) : (
              poll.kind === "choice" && (
                <ul className="space-y-3 text-2xl">
                  {poll.options.map((option, i) => (
                    <li key={option} className="rounded-xl border border-line bg-panel px-4 py-3">
                      <span className="mr-3 font-mono text-mint">{String.fromCharCode(65 + i)}</span>
                      {option}
                    </li>
                  ))}
                </ul>
              )
            )}
            {view!.answer && <p className="mt-5 text-xl text-mint">{view!.answer.why}</p>}
            <p className="mt-5 text-xl text-mute">{view!.total} {view!.total === 1 ? "answer" : "answers"}</p>
          </>
        )}
      </div>
      <QrCode path="/vote" label="Vote here" />
    </div>
  );
}
