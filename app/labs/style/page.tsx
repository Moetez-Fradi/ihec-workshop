"use client";
import { useState } from "react";
import { PageTitle } from "@/components/ui";

type Look = "spacious" | "cramped" | "strong" | "faint" | "oneAccent" | "rainbow" | "grid" | "scattered" | "serif" | "plain";

const rounds: { term: string; looks: [Look, Look]; correct: 0 | 1; why: string }[] = [
  { term: "Generous whitespace", looks: ["cramped", "spacious"], correct: 1, why: "Room around each block shows what belongs together." },
  { term: "High-contrast typography", looks: ["strong", "faint"], correct: 0, why: "A big size difference and bright text make the order of reading obvious." },
  { term: "Neutral palette with one accent", looks: ["rainbow", "oneAccent"], correct: 1, why: "One color means one thing to look at." },
  { term: "Crisp card grid", looks: ["grid", "scattered"], correct: 0, why: "Equal sizes, shared edges and even gaps." },
  { term: "Editorial serif pairing", looks: ["plain", "serif"], correct: 1, why: "A serif headline with simple body text feels like a magazine." },
];

function Mock({ look }: { look: Look }) {
  const frame = "h-56 w-full overflow-hidden rounded-xl bg-[#f6f5f1] text-left text-[#171717]";
  const cards = [["Rent", "320"], ["Food", "150"], ["Transport", "40"], ["Fun", "60"]];

  if (look === "grid" || look === "scattered") {
    const messy = ["w-24 ml-0", "w-40 ml-10 -mt-1", "w-20 ml-2 mt-4", "w-32 ml-16"];
    return (
      <div className={`${frame} p-4 ${look === "grid" ? "grid grid-cols-2 gap-3" : ""}`}>
        {cards.map(([name, value], i) => (
          <div key={name} className={`rounded-lg border border-black/10 bg-white p-2 text-xs ${look === "scattered" ? messy[i] : ""}`}>
            {name}<div className="text-lg font-bold">{value}</div>
          </div>
        ))}
      </div>
    );
  }

  if (look === "rainbow" || look === "oneAccent") {
    const loud = look === "rainbow";
    return (
      <div className={`${frame} space-y-2 p-5`}>
        <div className={`text-xl font-bold ${loud ? "text-fuchsia-600" : ""}`}>My savings</div>
        <div className={`rounded p-2 text-sm ${loud ? "bg-yellow-300 text-red-700" : "bg-black/5"}`}>Goal: 900</div>
        <div className={`rounded p-2 text-sm ${loud ? "bg-sky-400 text-white" : "bg-black/5"}`}>Saved: 350</div>
        <div className={`rounded p-2 text-center text-sm font-bold text-white ${loud ? "bg-lime-500" : "bg-emerald-700"}`}>Add money</div>
      </div>
    );
  }

  const style = {
    spacious: { box: "p-8", title: "text-xl font-bold mb-5", text: "text-sm leading-relaxed" },
    cramped: { box: "p-1", title: "text-sm font-bold", text: "text-xs leading-none" },
    strong: { box: "p-5", title: "text-4xl font-black mb-3", text: "text-sm" },
    faint: { box: "p-5", title: "text-base text-neutral-400 mb-3", text: "text-sm text-neutral-400" },
    serif: { box: "p-6", title: "font-serif text-3xl italic mb-3", text: "text-xs leading-relaxed" },
    plain: { box: "p-6", title: "font-mono text-sm mb-3", text: "font-mono text-xs leading-relaxed" },
  }[look];

  return (
    <div className={`${frame} ${style.box}`}>
      <div className={style.title}>Save for a laptop</div>
      <p className={style.text}>Set a goal and a monthly amount. See how many months it takes and what changes if you save a little more.</p>
      <p className={`${style.text} ${look === "cramped" ? "" : "mt-3"}`}>Goal 900. Saved 350. Monthly 110. Months left 5.</p>
      {look === "cramped" && <p className={style.text}>Tips: cook at home, share rides, check subscriptions, plan the week, track small buys, keep receipts, review on Sunday.</p>}
    </div>
  );
}

export default function StylePage() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const round = rounds[step];

  function pick(i: number) {
    if (choice !== null) return;
    setChoice(i);
    if (i === round.correct) setScore(score + 1);
  }

  function go(next: number) {
    setStep(next);
    setChoice(null);
    if (next === 0) setScore(0);
  }

  return (
    <>
      <PageTitle kicker="Lab" title="Name that style">
        &quot;Make it look modern&quot; tells an AI very little. Learn words that say what you mean.
      </PageTitle>

      {!round ? (
        <div className="card py-10 text-center">
          <p className="text-3xl font-bold">{score} / {rounds.length}</p>
          <p className="mt-2 text-mute">Now open awwwards.com, pick one site and name three traits using words like these.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a className="btn" href="https://www.awwwards.com" target="_blank" rel="noreferrer">Open Awwwards</a>
            <button type="button" className="btn-ghost" onClick={() => go(0)}>Play again</button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-4 text-xl">
            Round {step + 1} of {rounds.length}: which one shows <strong className="text-mint">{round.term}</strong>?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {round.looks.map((look, i) => (
              <button
                key={look}
                type="button"
                onClick={() => pick(i)}
                aria-label={`Option ${i === 0 ? "A" : "B"}`}
                className={`cursor-pointer rounded-2xl border-4 p-1 ${choice === null ? "border-line hover:border-white/50" : i === round.correct ? "border-mint" : i === choice ? "border-amber" : "border-line opacity-50"}`}
              >
                <Mock look={look} />
                <span className="block py-2 font-semibold">{i === 0 ? "A" : "B"}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 min-h-24" aria-live="polite">
            {choice !== null && (
              <div className="card flex flex-wrap items-center justify-between gap-3">
                <p><strong>{choice === round.correct ? "Yes. " : "Not that one. "}</strong>{round.why}</p>
                <button type="button" className="btn" onClick={() => go(step + 1)}>{step + 1 === rounds.length ? "See score" : "Next"}</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
