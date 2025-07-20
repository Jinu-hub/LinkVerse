import { bookmarkSchema } from "~/features/bookmark/lib/constants";
import type { HomeBookmark } from "./home.types";

export const getTopBookmarks = async () => {
  const response = await fetch("/api/bookmarks/top");
  if (!response.ok) {
    throw new Error("Failed to fetch top bookmarks");
  }
  const { topBookmarks } = await response.json();
  return topBookmarks;
};

export const getRecentBookmarks = async () => {
  const response = await fetch("/api/bookmarks/recent");
  if (!response.ok) {
    throw new Error("Failed to fetch recent bookmarks");
  }
  const { recentBookmarks } = await response.json();
  return recentBookmarks;
};

export const addBookmark = async (
  url: string,
  setRecentBookmarks: React.Dispatch<React.SetStateAction<HomeBookmark[]>>
) => {
  const { data, success, error } = bookmarkSchema.safeParse({ url });
  if (!success) {
    return { ok: false, fieldErrors: error.flatten().fieldErrors };
  }

  try {
    const response = await fetch("/bookmarks/api/bookmark/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to add bookmark");
    }
    const { bookmark } = await response.json();

    const recentBookmark: HomeBookmark = {
      id: bookmark.bookmark_id,
      title: bookmark.title,
      description: bookmark.description,
      url: bookmark.url,
      created_at: bookmark.created_at,
    };

    setRecentBookmarks(prev => [recentBookmark, ...prev.slice(0, prev.length - 1)]);
    return { ok: true, data: bookmark };
  } catch (error) {
    console.error(error);
    return { ok: false, fieldErrors: { form: ["북마크 추가에 실패했습니다."] } };
  }
};