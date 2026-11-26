"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/ui";

const MINUTES = 30;
const FULL = MINUTES * 60_000;

const phases = [
  { until: 8, name: "Choose and write", todo: "Pick a mission and a visual reference. Write your prompt." },
  { until: 14, name: "Round 1: generate", todo: "Run it. Does the main feature work?" },
  { until: 22, name: "Round 2: break and fix", todo: "Try empty, zero and negative input. Fix one thing at a time." },
  { until: 30, name: "Round 3: polish and review", todo: "Improve the design, check it on a narrow screen, go through the checklist." },
];

export default function SprintPage() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [left, setLeft] = useState(FULL);

  useEffect(() => {
    if (endsAt === null) return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, endsAt - Date.now());
      setLeft(remaining);
      if (remaining === 0) setEndsAt(null);
    }, 250);
    return () => clearInterval(timer);
  }, [endsAt]);

  const running = endsAt !== null;
  const seconds = Math.ceil(left / 1000);
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const elapsed = (FULL - left) / 60_000;
  const current = left === 0 ? -1 : phases.findIndex((p) => elapsed < p.until);

  return (
    <>
      <PageTitle kicker="Your turn" title="30-minute sprint">Solo or in pairs.</PageTitle>
      <div className="card text-center">
        <p className="font-mono text-7xl font-bold text-mint sm:text-9xl" role="timer">{clock}</p>
        {left === 0 && <p className="text-2xl text-amber">Time. Hands off the keyboard.</p>}
        <div className="mt-4 flex justify-center gap-3">
          <button type="button" className="btn" disabled={left === 0} onClick={() => setEndsAt(running ? null : Date.now() + left)}>
            {running ? "Pause" : left === FULL ? "Start" : "Resume"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => { setEndsAt(null); setLeft(FULL); }}>Reset</button>
        </div>
      </div>
      <ol className="mt-5 space-y-3">
        {phases.map((p, i) => (
          <li key={p.name} className={`card ${i === current ? "!border-mint" : ""}`}>
            <p className="font-semibold">{p.name} <span className="text-sm font-normal text-mute">until minute {p.until}</span></p>
            <p className="text-mute">{p.todo}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/labs/missions" className="btn-ghost">Mission cards</Link>
        <Link href="/labs/prompt" className="btn-ghost">Prompt Lab</Link>
        <Link href="/review" className="btn-ghost">Review checklist</Link>
      </div>
    </>
  );
}
