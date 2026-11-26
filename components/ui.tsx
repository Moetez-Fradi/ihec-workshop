"use client";
import { useState } from "react";

export function PageTitle({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-mint">{kicker}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {children && <p className="mt-3 max-w-2xl text-mute">{children}</p>}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "done" | "failed">("idle");
  return (
    <button
      type="button"
      className="btn"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus("done");
        } catch {
          setStatus("failed");
        }
        setTimeout(() => setStatus("idle"), 2000);
      }}
    >
      {status === "done" ? "Copied" : status === "failed" ? "Select the text and copy it" : label}
    </button>
  );
}

export function CopyBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="card">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <CopyButton text={text} />
      </div>
      <pre className="whitespace-pre-wrap rounded-xl bg-ink p-4 font-mono text-sm text-mute">{text}</pre>
    </div>
  );
}
