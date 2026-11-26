"use client";
import { useState } from "react";
import { CopyBlock, PageTitle } from "@/components/ui";

const bugs = [
  { name: "The impossible group", hint: "What if nobody came?", answer: "With 0 people it shows Infinity. Negative or fractional numbers of people are accepted too. Require a whole number of at least 1." },
  { name: "Money from nowhere", hint: "Can a bill be less than nothing?", answer: "A negative or empty total is accepted. Require an amount above 0 and explain what is wrong." },
  { name: "The missing cent", hint: "Split 100 between 3 and add it up.", answer: "Each person pays 33.33, so only 99.99 is collected. Work in cents and give the leftover cents to some people." },
  { name: "The sneaky name", hint: "Type <b>hello</b> or <u>hi</u> as the event name.", answer: "The name is inserted as HTML. In a shared app, someone could inject harmful content. Insert user text with textContent." },
];

const followUp = `Here is my app's code.

What I did: [the exact input you typed]
What happened: [what you saw]
What I expected: [what should happen]

Fix only this problem. Don't change the design. Explain the cause, then tell me how to test the fix.

[paste the code here]`;

export default function BreakItPage() {
  const [hints, setHints] = useState<number[]>([]);
  const [found, setFound] = useState<number[]>([]);

  return (
    <>
      <PageTitle kicker="Lab · 7 minutes" title="Break my app">
        This bill splitter looks fine. It has four bugs. Find them, then write a follow-up prompt that fixes one.
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <iframe src="/break-my-app.html" title="SplitIt, the app to break" className="h-[520px] w-full rounded-2xl border border-line bg-white" />
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="/break-my-app.html" target="_blank" className="btn-ghost">Open full screen</a>
            <a href="/break-my-app.html" download className="btn-ghost">Download the code</a>
          </div>
        </div>
        <div className="space-y-3">
          <p className="font-semibold" aria-live="polite">Found {found.length} of {bugs.length}</p>
          {bugs.map((bug, i) => (
            <div key={bug.name} className={`card ${found.includes(i) ? "!border-mint" : ""}`}>
              <h2 className="font-semibold">Bug {i + 1}: {found.includes(i) ? bug.name : "???"}</h2>
              {hints.includes(i) && <p className="mt-1 text-sm text-amber">{bug.hint}</p>}
              {found.includes(i) ? (
                <p className="mt-1 text-sm text-mute">{bug.answer}</p>
              ) : (
                <div className="mt-2 flex gap-3 text-sm">
                  {!hints.includes(i) && <button type="button" className="cursor-pointer text-mint underline" onClick={() => setHints([...hints, i])}>Hint</button>}
                  <button type="button" className="cursor-pointer text-mute underline" onClick={() => setFound([...found, i])}>I found it, show me</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <CopyBlock title="Follow-up prompt template" text={followUp} />
        <p className="mt-3 text-sm text-mute">After the fix, test the same input again, then check that nothing else broke.</p>
      </div>
    </>
  );
}
