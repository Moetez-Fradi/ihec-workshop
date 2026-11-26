"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVENT = "p2p-storage";
const memory = new Map<string, string>();

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** State that survives a page reload. Pass a stable `initial` (a constant, not a new object each render). */
export function useStored<T>(key: string, initial: T) {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  const value = useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);

  const set = useCallback(
    (next: T) => {
      const json = JSON.stringify(next);
      memory.set(key, json);
      try {
        localStorage.setItem(key, json);
      } catch {
        // Private mode: the in-memory copy still works.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, set] as const;
}
