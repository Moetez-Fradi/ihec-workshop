import Link from "next/link";
import { PageTitle } from "@/components/ui";
import { missions } from "@/lib/missions";

export default function MissionsPage() {
  return (
    <>
      <PageTitle kicker="Sprint" title="Mission cards">
        Pick one, or bring your own idea. Get the three features working before you try the stretch goal.
      </PageTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {missions.map((m) => (
          <article key={m.id} className="card flex flex-col">
            <p className="text-sm text-amber">{m.field}</p>
            <h2 className="text-xl font-bold">{m.title}</h2>
            <p className="text-sm text-mute">For {m.user}</p>
            <ul className="my-3 list-disc space-y-1 pl-5 text-sm">
              {m.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p className="mb-4 text-sm text-mute"><strong className="text-white">Stretch:</strong> {m.stretch}</p>
            <Link href={`/labs/prompt?mission=${m.id}`} className="btn mt-auto self-start">Start in Prompt Lab</Link>
          </article>
        ))}
      </div>
    </>
  );
}
