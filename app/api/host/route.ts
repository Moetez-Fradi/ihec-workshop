import { isHost } from "@/lib/host";
import { pollById, polls } from "@/lib/polls";
import { clearVotes, getState, removeVote, setState } from "@/lib/store";
import { invalidate } from "@/lib/view";

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  if (!isHost(request.headers.get("x-host-key"))) return fail("Wrong presenter key", 401);
  const body = (await request.json().catch(() => null)) as { action?: string; pollId?: string; voter?: string } | null;
  if (!body?.action) return fail("Bad request");

  try {
    const state = await getState();
    switch (body.action) {
      case "show":
        if (!body.pollId || !pollById.has(body.pollId)) return fail("Unknown question");
        await setState({ pollId: body.pollId, open: true, revealed: false });
        break;
      case "toggle-open":
        await setState({ ...state, open: !state.open });
        break;
      case "toggle-reveal":
        // Revealing closes voting. Hiding again leaves it closed.
        await setState({ ...state, revealed: !state.revealed, open: false });
        break;
      case "idle":
        await setState({ pollId: null, open: false, revealed: false });
        break;
      case "clear":
        if (state.pollId) await clearVotes([state.pollId]);
        break;
      case "clear-all":
        await clearVotes(polls.map((p) => p.id));
        await setState({ pollId: null, open: false, revealed: false });
        break;
      case "remove":
        if (!state.pollId || !body.voter) return fail("Bad request");
        await removeVote(state.pollId, body.voter);
        break;
      default:
        return fail("Unknown action");
    }
    invalidate();
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return fail("Voting is unavailable right now", 503);
  }
}
