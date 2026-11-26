"use client";
import { useState } from "react";
import { PageTitle } from "@/components/ui";

const START = "I track my monthly";

/** Hand-written scores for teaching. A real model scores many thousands of tokens. */
const table: Record<string, [string, number][]> = {
  monthly: [["budget", 0.46], ["expenses", 0.34], ["spending", 0.17], ["dragon", 0.03]],
  budget: [["in", 0.5], ["with", 0.3], ["so", 0.15], ["underwater", 0.05]],
  expenses: [["in", 0.45], ["with", 0.35], ["so", 0.17], ["loudly", 0.03]],
  spending: [["in", 0.4], ["with", 0.35], ["so", 0.22], ["sideways", 0.03]],
  dragon: [["in", 0.4], ["with", 0.4], ["so", 0.2]],
  in: [["a spreadsheet", 0.62], ["a notebook", 0.3], ["a volcano", 0.08]],
  with: [["a simple app", 0.65], ["pen and paper", 0.29], ["a crystal ball", 0.06]],
  so: [["I can save more", 0.7], ["rent is covered", 0.26], ["my cat approves", 0.04]],
  underwater: [["every Friday", 0.6], ["for fun", 0.4]],
  loudly: [["every Friday", 0.6], ["for fun", 0.4]],
  sideways: [["every Friday", 0.6], ["for fun", 0.4]],
};

/** Temperature below 1 sharpens the odds. Above 1 flattens them. */
function adjust(options: [string, number][], temperature: number) {
  const weights = options.map(([, p]) => p ** (1 / temperature));
  const sum = weights.reduce((a, b) => a + b, 0);
  return options.map(([word], i) => ({ word, p: weights[i] / sum }));
}

/** Picks a word with a chance equal to its probability. */
function pickByChance(options: { word: string; p: number }[]) {
  let r = Math.random();
  return options.find((o) => (r -= o.p) <= 0) ?? options[options.length - 1];
}

export default function TokensPage() {
  const [words, setWords] = useState<string[]>([]);
  const [temperature, setTemperature] = useState(1);
  const last = words.at(-1) ?? "monthly";
  const options = table[last] ? adjust(table[last], temperature) : [];

  function sample() {
    setWords([...words, pickByChance(options).word]);
  }

  return (
    <>
      <PageTitle kicker="Lab" title="Next-word machine">
        A language model writes by scoring what could come next, picking one, and repeating. These scores are made up to show the idea, and whole words stand in for tokens.
      </PageTitle>

      <p className="card mb-4 text-2xl" aria-live="polite">
        {START} <span className="text-mint">{words.join(" ")}</span>
        {options.length > 0 && <span className="animate-pulse"> ▍</span>}
      </p>

      <ul className="mb-5 space-y-2">
        {options.map((o) => (
          <li key={o.word}>
            <button type="button" onClick={() => setWords([...words, o.word])} className="relative block w-full cursor-pointer overflow-hidden rounded-xl border border-line text-left hover:border-mint">
              <span className="absolute inset-y-0 left-0 bg-mint/25 transition-all duration-500" style={{ width: `${o.p * 100}%` }} />
              <span className="relative flex justify-between px-4 py-3">
                <span>{o.word}</span>
                <span className="font-mono">{(o.p * 100).toFixed(1)}%</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <label className="mb-5 block">
        <span className="font-semibold">Temperature: <span className="font-mono text-mint">{temperature.toFixed(1)}</span></span>
        <input type="range" min={0.2} max={3} step={0.1} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="mt-2 w-full accent-mint" />
        <span className="flex justify-between text-sm text-mute"><span>More predictable</span><span>More surprising</span></span>
      </label>

      <div className="flex gap-3">
        <button type="button" className="btn" onClick={sample} disabled={!options.length}>Pick a word by chance</button>
        <button type="button" className="btn-ghost" onClick={() => setWords([])}>Start again</button>
      </div>

      <p className="mt-8 card text-mute">
        <strong className="text-white">Try this:</strong> set the temperature to 0.2 and build five sentences. Then set it to 3 and build five more. When would you want each?
      </p>
    </>
  );
}
