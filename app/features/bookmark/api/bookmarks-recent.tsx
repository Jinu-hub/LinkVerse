import makeServerClient from "~/core/lib/supa-client.server";
import { getRecentBookmarks } from "../db/queries";

export const loader = async ({ request }: { request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const recentBookmarks = await getRecentBookmarks(client, 
    { userId: user.id, limit: 5 });
  return new Response(JSON.stringify({ recentBookmarks }), {
    headers: { "Content-Type": "application/json" },
  });
}