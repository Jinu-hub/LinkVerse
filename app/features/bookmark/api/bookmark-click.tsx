import makeServerClient from "~/core/lib/supa-client.server";
import type { Route } from "./+types/bookmark-click";
import { updateBookmarkClickCount } from "../db/mutations";

export async function action({ request, params }: Route.ActionArgs) {
    if (request.method !== "PUT") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const bookmarkId = Number(params.id);
    if (isNaN(bookmarkId)) {
        return new Response("Invalid bookmark id", { status: 400 });
    }

    const updatedActivity = await updateBookmarkClickCount(client, {
        user_id: user.id,
        bookmark_id: bookmarkId,
    });
    return new Response(JSON.stringify({ updatedActivity }), {
        headers: { "Content-Type": "application/json" },
    });
}