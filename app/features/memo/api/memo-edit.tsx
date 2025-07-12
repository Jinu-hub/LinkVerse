import makeServerClient from "~/core/lib/supa-client.server";
import type { Route } from "./+types/memo-edit";
import { updateMemo } from "../db/mutations";

export async function action({ request, params }: Route.ActionArgs) {
    if (request.method !== "PUT" && request.method !== "PATCH") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });
    
    const memoId = Number(params.id);
    if (isNaN(memoId)) {
        return new Response("Invalid memo id", { status: 400 });
    }

    try {
        const { content } = await request.json();
        const memo = await updateMemo(client, 
            { user_id: user.id, memo_id: memoId, content });
        return new Response(JSON.stringify({ memo }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
            { status: 400 });
    }
}