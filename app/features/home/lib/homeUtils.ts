

export const toHomeBookmarks = async (bookmarks: any) => {
  return bookmarks.map((bookmark: any) => ({
    id: bookmark.bookmark_id,
    title: bookmark.title,
    description: bookmark.memo ?? bookmark.description,
    link: bookmark.url,
    created_at: bookmark.created_at,
  }));
}