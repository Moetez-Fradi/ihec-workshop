import { isHost } from "@/lib/host";
import { buildView } from "@/lib/view";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const voter = new URL(request.url).searchParams.get("voter");
  const key = request.headers.get("x-host-key");
  if (key !== null && !isHost(key)) return Response.json({ error: "Wrong presenter key" }, { status: 401 });
  try {
    return Response.json(await buildView(voter, key !== null), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Voting is unavailable right now" }, { status: 503 });
  }
}
