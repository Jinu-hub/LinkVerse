import makeServerClient from "~/core/lib/supa-client.server";
import { getTopBookmarks } from "../db/queries";

export const loader = async ({ request }: { request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const topBookmarks = await getTopBookmarks(client, 
    { userId: user.id, limit: 10 });
  return new Response(JSON.stringify({ topBookmarks }), {
    headers: { "Content-Type": "application/json" },
  });
}