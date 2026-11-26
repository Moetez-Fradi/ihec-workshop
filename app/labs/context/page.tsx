"use client";
import { useState } from "react";
import { PageTitle } from "@/components/ui";

const messages = [
  "My budget is 600 a month.",
  "I'm building a savings app.",
  "Use a dark theme.",
  "Add a chart.",
  "Make the buttons bigger.",
  "Fix the date format.",
  "Add a reset button.",
];

export default function ContextPage() {
  const [sent, setSent] = useState(1);
  const [size, setSize] = useState(4);
  const firstVisible = Math.max(0, sent - size);
  const remembers = firstVisible === 0;

  return (
    <>
      <PageTitle kicker="Lab" title="Context window">
        A model only works with what fits in its context. This is a simplified picture: real windows are measured in tokens and are far bigger, and chat tools may summarise or search older messages.
      </PageTitle>

      <label className="mb-5 block">
        <span className="font-semibold">Window size: <span className="font-mono text-mint">{size} messages</span></span>
        <input type="range" min={2} max={7} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full accent-mint" />
      </label>

      <ol className="space-y-2" aria-label="Conversation">
        {messages.slice(0, sent).map((message, i) => {
          const visible = i >= firstVisible;
          return (
            <li key={message} className={`flex justify-between gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${visible ? "border-mint bg-mint/10" : "translate-x-4 border-dashed border-line text-mute opacity-50"}`}>
              <span>{message}</span>
              <span className="shrink-0 text-sm">{visible ? "in view" : "out of view"}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex gap-3">
        <button type="button" className="btn" onClick={() => setSent(sent + 1)} disabled={sent === messages.length}>Send next message</button>
        <button type="button" className="btn-ghost" onClick={() => setSent(1)}>Start again</button>
      </div>

      <div className="card mt-8" aria-live="polite">
        <p className="font-semibold">You ask: &quot;What&apos;s my monthly budget?&quot;</p>
        <p className={`mt-2 ${remembers ? "text-mint" : "text-amber"}`}>
          {remembers
            ? "The model can use the first message: 600 a month."
            : "The first message is out of view. The model can't use it, and it might guess a number."}
        </p>
        <p className="mt-3 text-sm text-mute">What to do: repeat the key facts in your prompt, or start a fresh chat with a short summary.</p>
      </div>
    </>
  );
}
