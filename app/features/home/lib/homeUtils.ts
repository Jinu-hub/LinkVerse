

export const toHomeBookmarks = (bookmark: any) => ({
  id: bookmark.bookmark_id,
  title: bookmark.title,
  description: bookmark.memo ?? bookmark.description,
  url: bookmark.url,
  created_at: bookmark.created_at,
});