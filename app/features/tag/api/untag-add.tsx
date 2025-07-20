import makeServerClient from "~/core/lib/supa-client.server";
import type { Route } from "./+types/tag-edit";
import { handleContentTags } from "~/features/bookmark/lib/common";

export async function action({ request, params }: Route.ActionArgs) {
    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const [client] = makeServerClient(request);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const targetId = Number(params.id);
    if (isNaN(targetId)) {
        return new Response("Invalid target id", { status: 400 });
    }

    try {
        const { contentTypeId, tags } = await request.json();
        const tagsData = await handleContentTags(client, {
            userId: user.id,
            content_type_id: contentTypeId,
            target_id: targetId,
            tags: tags,
            mode: "add",
          });
       
        return new Response(JSON.stringify({ tags: tagsData }), {
            headers: { "Content-Type": "application/json" },
        });
        
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: { message: error instanceof Error ? error.message : String(error) } }),
            { status: 400 });
    }
}