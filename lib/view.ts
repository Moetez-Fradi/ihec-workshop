/** Server only. */
import { answers } from "./answers";
import { pollById, type LiveState, type LiveView } from "./polls";
import { getState, getVotes, persistent } from "./store";

type Snapshot = { state: LiveState; votes: Map<string, string> };

// One short-lived snapshot shared by all students on this instance,
// so a full classroom doesn't burn through the database's quota.
let cached: { at: number; data: Promise<Snapshot> } | null = null;

async function load(): Promise<Snapshot> {
  const state = await getState();
  const votes = state.pollId ? await getVotes(state.pollId) : new Map<string, string>();
  return { state, votes };
}

export function invalidate() {
  cached = null;
}

export async function buildView(voter: string | null, host: boolean): Promise<LiveView> {
  let data: Promise<Snapshot>;
  if (!host && cached && Date.now() - cached.at < 1000) {
    data = cached.data;
  } else {
    data = load();
    cached = { at: Date.now(), data };
    data.catch(invalidate);
  }
  const { state, votes } = await data;
  const poll = state.pollId ? pollById.get(state.pollId) : undefined;
  const visible = host || state.revealed;

  let counts: number[] | null = null;
  let texts: LiveView["texts"] = null;
  if (poll && visible) {
    if (poll.kind === "choice") {
      const tally = poll.options.map(() => 0);
      for (const v of votes.values()) {
        const i = Number(v);
        if (i >= 0 && i < tally.length) tally[i] += 1;
      }
      counts = tally;
    } else {
      // Voter ids only go to the presenter, who needs them to remove an answer.
      texts = [...votes].map(([id, text], i) => ({ id: host ? id : String(i), text }));
    }
  }

  return {
    state,
    total: votes.size,
    counts,
    texts,
    answer: poll && state.revealed ? (answers[poll.id] ?? null) : null,
    mine: voter ? (votes.get(voter) ?? null) : null,
    persistent,
  };
}
