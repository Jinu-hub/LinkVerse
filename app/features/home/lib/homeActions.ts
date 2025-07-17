


export const getTopBookmarks = async () => {
  const response = await fetch("/api/bookmarks/top");
  if (!response.ok) {
    throw new Error("Failed to fetch top bookmarks");
  }
  const { topBookmarks } = await response.json();
  return topBookmarks;
};