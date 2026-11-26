import type { LiveView, Poll } from "@/lib/polls";

export function Results({ poll, view, big = false, onRemove }: { poll: Poll; view: LiveView; big?: boolean; onRemove?: (id: string) => void }) {
  if (poll.kind === "text") {
    if (!view.texts?.length) return <p className="text-mute">No answers yet.</p>;
    return (
      <ul className="flex flex-wrap gap-3">
        {view.texts.map((item) => (
          <li key={item.id} className={`flex items-center gap-2 rounded-2xl border border-line bg-panel px-4 py-2 break-words ${big ? "text-2xl" : ""}`}>
            {item.text}
            {onRemove && (
              <button type="button" onClick={() => onRemove(item.id)} className="cursor-pointer text-amber" aria-label={`Remove answer: ${item.text}`}>
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (!view.counts) return null;
  const sum = view.counts.reduce((a, b) => a + b, 0);
  return (
    <ul className="space-y-3">
      {poll.options.map((option, i) => {
        const percent = sum ? Math.round((view.counts![i] / sum) * 100) : 0;
        const correct = view.answer?.index === i;
        return (
          <li key={option} className={`relative overflow-hidden rounded-xl border ${correct ? "border-mint" : "border-line"} ${big ? "text-2xl" : ""}`}>
            <div className={`absolute inset-y-0 left-0 transition-all duration-500 ${correct ? "bg-mint/30" : "bg-white/10"}`} style={{ width: `${percent}%` }} />
            <div className="relative flex justify-between gap-4 px-4 py-3">
              <span>{correct ? "✓ " : ""}{option}</span>
              <span className="shrink-0 font-mono">{view.counts![i]} · {percent}%</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
