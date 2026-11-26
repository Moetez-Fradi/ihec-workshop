/** Server only. Uses Upstash Redis over REST when configured, memory otherwise. */
import type { LiveState } from "./polls";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** True when a shared Redis database is configured. */
export const persistent = Boolean(url && token);

const TTL_SECONDS = 60 * 60 * 24 * 7;
const STATE_KEY = "p2p:state";
const votesKey = (pollId: string) => `p2p:votes:${pollId}`;
const idle: LiveState = { pollId: null, open: false, revealed: false };

async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  const body = (await res.json()) as { result?: unknown; error?: string }[];
  return body.map((item) => {
    if (item.error) throw new Error(item.error);
    return item.result;
  });
}

// Local development fallback. It is not shared between serverless instances.
type Memory = { state: LiveState; votes: Map<string, Map<string, string>> };
const globalStore = globalThis as typeof globalThis & { __p2p?: Memory };
const memory = (globalStore.__p2p ??= { state: idle, votes: new Map() });

export async function getState(): Promise<LiveState> {
  if (!persistent) return memory.state;
  const [raw] = await redis([["GET", STATE_KEY]]);
  return typeof raw === "string" ? (JSON.parse(raw) as LiveState) : idle;
}

export async function setState(state: LiveState) {
  if (!persistent) {
    memory.state = state;
    return;
  }
  await redis([["SET", STATE_KEY, JSON.stringify(state), "EX", TTL_SECONDS]]);
}

export async function getVotes(pollId: string): Promise<Map<string, string>> {
  if (!persistent) return new Map(memory.votes.get(pollId));
  const [flat] = (await redis([["HGETALL", votesKey(pollId)]])) as [string[] | null];
  const votes = new Map<string, string>();
  for (let i = 0; i + 1 < (flat?.length ?? 0); i += 2) votes.set(flat![i], flat![i + 1]);
  return votes;
}

export async function setVote(pollId: string, voter: string, answer: string) {
  if (!persistent) {
    const votes = memory.votes.get(pollId) ?? new Map<string, string>();
    votes.set(voter, answer);
    memory.votes.set(pollId, votes);
    return;
  }
  await redis([
    ["HSET", votesKey(pollId), voter, answer],
    ["EXPIRE", votesKey(pollId), TTL_SECONDS],
  ]);
}

export async function removeVote(pollId: string, voter: string) {
  if (!persistent) {
    memory.votes.get(pollId)?.delete(voter);
    return;
  }
  await redis([["HDEL", votesKey(pollId), voter]]);
}

export async function clearVotes(pollIds: string[]) {
  if (!persistent) {
    for (const id of pollIds) memory.votes.delete(id);
    return;
  }
  await redis([["DEL", ...pollIds.map(votesKey)]]);
}
