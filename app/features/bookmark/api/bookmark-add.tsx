import makeServerClient from "~/core/lib/supa-client.server";
import { getBookmark, getBookmarks, getMaxCategorySortOrder } from "../db/queries";
import { bookmarkSchema } from "../lib/constants";
import { addBookmark } from "../lib/bmActions";
import { fetchTitleFromUrl } from "../lib/bmUtils";
import { createBookmark } from "../db/mutations";


export const loader = async ({ request }: { request: Request }) => {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { bookmarkId } = await request.json();
  const bookmark = await getBookmark(client, { userId: user.id, bookmarkId: bookmarkId });

  return new Response(JSON.stringify({ bookmark }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function action({ request }: { request: Request }) {
  const [client] = makeServerClient(request);
  const { data: { user } } = await client.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();

  const parsed = bookmarkSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid data", { status: 400 });
  }

  let { title, url, categoryId, parentCategoryId, newCategoryName, newCategoryLevel, tags, memo } = parsed.data;
  
  const metadata = await fetchTitleFromUrl(url);
  const { title: titleFromUrl, image, description } = metadata;

 
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}