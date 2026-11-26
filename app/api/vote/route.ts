import { pollById } from "@/lib/polls";
import { getState, getVotes, setVote } from "@/lib/store";
import { invalidate } from "@/lib/view";

const MAX_VOTERS = 500;
const MAX_TEXT = 80;

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { voter?: unknown; pollId?: unknown; answer?: unknown } | null;
  const { voter, pollId, answer } = body ?? {};
  if (typeof voter !== "string" || !/^[\w-]{8,64}$/.test(voter)) return fail("Bad voter id");
  if (typeof pollId !== "string" || typeof answer !== "string") return fail("Bad request");

  const poll = pollById.get(pollId);
  if (!poll) return fail("Unknown question");

  let value = answer;
  if (poll.kind === "choice") {
    if (!/^\d$/.test(value) || Number(value) >= poll.options.length) return fail("Unknown option");
  } else {
    value = value.trim().replace(/\s+/g, " ").slice(0, MAX_TEXT);
    if (!value) return fail("Write something first");
  }

  try {
    const state = await getState();
    if (state.pollId !== pollId || !state.open) return fail("Voting is closed", 409);
    const votes = await getVotes(pollId);
    if (!votes.has(voter) && votes.size >= MAX_VOTERS) return fail("This question is full", 429);
    await setVote(pollId, voter, value);
    invalidate();
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return fail("Voting is unavailable right now", 503);
  }
}
