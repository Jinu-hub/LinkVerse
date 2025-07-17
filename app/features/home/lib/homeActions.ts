


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