import makeServerClient from "~/core/lib/supa-client.server";
import type { Route } from "./+types/tag-edit";
import { updateTagName, deleteTag } from "../db/mutations";

export async function action({ request, params }: Route.ActionArgs) {
    if (request.method !== "PUT" && request.method !== "PATCH" && request.method !== "DELETE") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const tagId = Number(params.id);
    if (isNaN(tagId)) {
        return new Response("Invalid tag id", { status: 400 });
    }

    try {
        if (request.method === "PUT" || request.method === "PATCH") {
            const { name } = await request.json();
            const tag = await updateTagName(client, { userId: user.id, tagId, name });
            return new Response(JSON.stringify({ tag }), {
                headers: { "Content-Type": "application/json" },
            });
        } else if (request.method === "DELETE") {
            const tag = await deleteTag(client, { userId: user.id, tagId });
            return new Response(JSON.stringify({ tag }), {
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
            { status: 400 });
    }
}