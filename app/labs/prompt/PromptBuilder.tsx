"use client";
import { useMemo } from "react";
import { CopyButton, PageTitle } from "@/components/ui";
import { useStored } from "@/components/useStored";
import type { Mission } from "@/lib/missions";

type Draft = {
  role: string;
  context: string;
  task: string;
  features: string;
  reference: string;
  cues: string[];
  constraints: string;
  format: string;
};

const cueGroups: Record<string, string[]> = {
  Layout: ["clean editorial grid", "single centered column", "crisp card grid", "generous whitespace"],
  Typography: ["high-contrast typography", "serif headings with simple body text", "large numbers for key results"],
  Color: ["calm neutral palette with one accent", "dark background with bright accent", "soft light background"],
  Motion: ["subtle hover and press feedback", "smooth progress animation", "no animation"],
};

const formats = [
  "One HTML file with CSS and JavaScript inside, ready to open in a browser. Then list how to test it.",
  "First a short plan and your questions. Wait for my answer before writing code.",
  "Change only what is needed in my project, then explain each change.",
];

const defaultConstraints = "Works on a phone. No sign-up and no external services. Handle empty, zero and negative input with clear messages. Readable contrast and labelled inputs.";

function blank(mission: Mission | null): Draft {
  return {
    role: "You are a front-end developer who cares about clear design.",
    context: mission ? `This is for ${mission.user}.` : "",
    task: mission ? `Build a ${mission.title.toLowerCase()}.` : "",
    features: mission ? mission.features.join("\n") : "",
    reference: "",
    cues: [],
    constraints: defaultConstraints,
    format: formats[0],
  };
}

function toPrompt(d: Draft) {
  const features = d.features.split("\n").map((f) => f.trim()).filter(Boolean);
  const design = [...d.cues];
  const parts = [
    ["Role", d.role.trim()],
    ["Context", d.context.trim()],
    ["Task", [d.task.trim(), features.length ? `Features:\n${features.map((f) => `- ${f}`).join("\n")}` : ""].filter(Boolean).join("\n")],
    ["Design direction", [design.length ? design.map((c) => `- ${c}`).join("\n") : "", d.reference.trim() ? `What I like about my reference: ${d.reference.trim()}\nUse it as inspiration only. Don't copy its content or branding.` : ""].filter(Boolean).join("\n")],
    ["Constraints", d.constraints.trim()],
    ["Output format", d.format],
  ];
  return parts.filter(([, body]) => body).map(([title, body]) => `## ${title}\n${body}`).join("\n\n");
}

export function PromptBuilder({ mission }: { mission: Mission | null }) {
  const initial = useMemo(() => blank(mission), [mission]);
  const [draft, setDraft] = useStored<Draft>(`p2p:prompt:${mission?.id ?? "blank"}`, initial);
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
  const prompt = toPrompt(draft);

  const checks = [
    { label: "Role", ok: draft.role.trim().length > 10 },
    { label: "Context: who is it for?", ok: draft.context.trim().length > 15 },
    { label: "Task", ok: draft.task.trim().length > 10 },
    { label: "At least 3 features", ok: draft.features.split("\n").filter((f) => f.trim()).length >= 3 },
    { label: "At least 3 design cues", ok: draft.cues.length >= 3 },
    { label: "Constraints", ok: draft.constraints.trim().length > 15 },
    { label: "Output format", ok: Boolean(draft.format) },
  ];
  const done = checks.filter((c) => c.ok).length;

  const area = (key: "role" | "context" | "task" | "features" | "constraints" | "reference", label: string, hint: string, rows = 2) => (
    <label className="block">
      <span className="font-semibold">{label}</span>
      <span className="mb-1 block text-sm text-mute">{hint}</span>
      <textarea className="field" rows={rows} value={draft[key]} onChange={(e) => set({ [key]: e.target.value })} />
    </label>
  );

  return (
    <>
      <PageTitle kicker="Lab" title="Prompt Lab">
        Fill in the parts and copy the result into your AI tool. Your draft stays in this browser. {mission && <>Mission: <strong className="text-white">{mission.title}</strong>.</>}
      </PageTitle>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          {area("role", "Role", "Who should the AI act as?")}
          {area("context", "Context", "Who is it for, and what problem do they have?")}
          {area("task", "Task", "What should it build, in one sentence?")}
          {area("features", "Features", "One per line. What can the user do?", 4)}

          <fieldset>
            <legend className="font-semibold">Design cues</legend>
            <p className="mb-2 text-sm text-mute">Pick at least three. Pick ones that don&apos;t contradict each other.</p>
            {Object.entries(cueGroups).map(([group, cues]) => (
              <div key={group} className="mb-3">
                <p className="mb-1 text-sm text-amber">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {cues.map((cue) => {
                    const on = draft.cues.includes(cue);
                    return (
                      <button key={cue} type="button" aria-pressed={on} onClick={() => set({ cues: on ? draft.cues.filter((c) => c !== cue) : [...draft.cues, cue] })} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${on ? "border-mint bg-mint text-ink" : "border-line hover:border-mint"}`}>
                        {cue}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </fieldset>

          {area("reference", "Visual reference (optional)", "From the site you picked on Awwwards, which traits do you like? Describe them: the AI may not be able to open a link.")}
          {area("constraints", "Constraints", "Limits, edge cases and things to avoid.", 4)}

          <label className="block">
            <span className="mb-1 block font-semibold">Output format</span>
            <select className="field" value={draft.format} onChange={(e) => set({ format: e.target.value })}>
              {formats.map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="card">
            <p className="font-semibold">{done} of {checks.length} ready</p>
            <progress className="my-2 h-2 w-full accent-mint" value={done} max={checks.length} />
            <ul className="grid gap-x-3 text-sm sm:grid-cols-2">
              {checks.map((c) => (
                <li key={c.label} className={c.ok ? "text-mint" : "text-mute"}>{c.ok ? "✓" : "○"} {c.label}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-mute">This checks that parts are filled in, not that they are good. Read it yourself.</p>
          </div>
          <div className="card">
            <div className="mb-3 flex flex-wrap gap-3">
              <CopyButton text={prompt} label="Copy prompt" />
              <button type="button" className="btn-ghost" onClick={() => { if (window.confirm("Clear this draft?")) setDraft(initial); }}>Reset</button>
            </div>
            <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-xl bg-ink p-4 font-mono text-sm">{prompt}</pre>
          </div>
        </div>
      </div>
    </>
  );
}
