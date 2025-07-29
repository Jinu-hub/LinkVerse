
export async function addCategory({
    name,
    parent_id,
    level,
}: {
    name: string;
    parent_id: number;
    level: number;
}) {
    const res_add = await fetch("/bookmarks/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name, 
            parent_id: parent_id === 0 ? null : parent_id, 
            level: level ?? 1, 
        }),
      });
    if (!res_add.ok) {
        throw new Error("Failed to add category");
    }
    const { category } = await res_add.json();
    return category;
}

export function prepareBookmarksFromCSV(
  parsedData: string[][],
  categoryMap: Record<string, { id: number; level: number; parent_id: number | null }>
) {
  const bookmarks: Array<{
    bookmark_id: number;
    category_id: number;
    title: string;
    url: string;
    description: string;
    tags: string[];
    memo: string;
  }> = [];

  let bookmarkId = 1;
  for (let i = 1; i < parsedData.length; i++) {
    const row = parsedData[i];
    if (row.length < 9) {
      // 컬럼 수 부족
      continue;
    }
    const categoryKey = row[1].replace(/>/g, ' > ');
    const title = row[2] || '';
    const url = row[3] || '';
    const description = row[6] || '';
    const tags = row[7] || '';
    const memo = row[8] || '';
    if (!url.trim()) {
      continue;
    }
    const categoryInfo = categoryMap[categoryKey];
    if (!categoryInfo) {
      continue;
    }
    const bookmark = {
      bookmark_id: bookmarkId,
      category_id: categoryInfo.id,
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      tags: tags
        ? tags
            .split(',')
            .map(tag => tag.replace(/\b/g, '').trim())
            .filter(tag => tag.length > 0)
        : [],
      memo: memo.trim(),
    };
    bookmarks.push(bookmark);
    bookmarkId++;
  }
  return bookmarks;
}

export async function bulkAddBookmark(bookmarks: Array<{
  title: string;
  url: string;
  categoryId: number;
  tags: string[];
  memo: string;
  description: string;
}>) {
  const res = await fetch("/api/bookmarks/bulk-add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookmarks }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}
