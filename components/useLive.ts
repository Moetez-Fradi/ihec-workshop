"use client";
import { useCallback, useEffect, useState } from "react";
import type { LiveView } from "@/lib/polls";

/** Polls the live voting state. Pauses while the tab is hidden. */
export function useLive({ voter, hostKey, interval = 3000, enabled = true }: { voter?: string | null; hostKey?: string; interval?: number; enabled?: boolean }) {
  const [view, setView] = useState<LiveView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    async function run() {
      if (!document.hidden) {
        try {
          const res = await fetch(`/api/live${voter ? `?voter=${voter}` : ""}`, {
            headers: hostKey ? { "x-host-key": hostKey } : undefined,
            cache: "no-store",
          });
          const body = await res.json();
          if (stopped) return;
          if (res.ok) {
            setView(body as LiveView);
            setError(null);
          } else {
            setError(body.error ?? "Something went wrong");
          }
        } catch {
          if (!stopped) setError("Can't reach the server. Retrying.");
        }
      }
      if (!stopped) timer = setTimeout(run, interval);
    }

    run();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [voter, hostKey, interval, enabled, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { view, error, refresh };
}
