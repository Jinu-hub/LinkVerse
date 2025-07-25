

// url에서 도메인만 추출하는 헬퍼 함수
function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return url;
  }
}

export const toHomeBookmarks = (bookmark: any) => ({
  id: bookmark.bookmark_id,
  title: bookmark.title,
  description:
    bookmark.memo?.trim() ||
    bookmark.description?.trim() ||
    (bookmark.url ? extractDomain(bookmark.url) : ''),
  url: bookmark.url,
  created_at: bookmark.created_at,
});