import { createTagValidation } from "~/features/tag/lib/constants";


export async function getBookmarkData() {
  const res = await fetch("/api/bookmarks/get");
  if (!res.ok) {
    throw new Error("Failed to get bookmarks");
  }
  const { bookmarksWithTagsMemo } = await res.json();
  return bookmarksWithTagsMemo;
}

export async function prepareCSVData(bookmarksData: any[]) {
    const header = ["url", "title", "category", "tags", "memo", "description"];
    
    const escapeCSVField = (field: string): string => {
        if (!field) return '';
        // 줄바꿈이나 쉼표가 있으면 따옴표로 감싸고, 내부 따옴표는 이스케이프
        const needsQuotes = field.includes(',') || field.includes('\n') || field.includes('"');
        if (needsQuotes) {
            return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
    };
    
    const rows = bookmarksData.map(bookmark => [
        escapeCSVField(bookmark.url || ''),
        escapeCSVField(bookmark.title || ''),
        escapeCSVField(bookmark.categoryPathString || ''),
        bookmark.tags && bookmark.tags.length > 0 ? `"${bookmark.tags.join(',')}"` : '',
        escapeCSVField(bookmark.memo || ''),
        escapeCSVField(bookmark.description || '')
    ]);
    
    const allRows = [header, ...rows];
    return allRows.map(row => row.join(",")).join("\n");
}

export async function downloadCSV(csvData: string) {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.csv";
    a.click();
}


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
  // 想定フォーマット: [url(0), title(1), category(2), tags(3), memo(4), description(5)]
  const bookmarks: Array<{
    bookmark_id: number;
    category_id: number | null;
    title: string;
    url: string;
    description: string;
    tags: string[];
    memo: string;
  }> = [];

  let bookmarkId = 1;
  for (let i = 1; i < parsedData.length; i++) {
    const row = parsedData[i];
    if (row.length < 6) {
      continue;
    }
    const url = (row[0] || '').trim();
    const title = (row[1] || '').trim();
    // カテゴリキーは split -> trim -> join で正規化（空白の二重化や全角混在を回避）
    const categoryKey = (row[2] || '')
      .replace(/＞/g, '>')
      .split('>')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .join(' > ');
    const tagsStr = row[3] || '';
    const memo = (row[4] || '').trim();
    const description = (row[5] || '').trim();

    if (!url) continue;
    const categoryInfo = categoryMap[categoryKey];

    const tags = tagsStr
      ? tagsStr
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const bookmark = {
      bookmark_id: bookmarkId,
      category_id: categoryInfo?.id || null,
      title,
      url,
      description,
      tags,
      memo,
    };
    bookmarks.push(bookmark);
    bookmarkId++;
  }
  return bookmarks;
}

export type CsvError = { row: number; field: string; message: string };

export function validateParsedCSV(parsedData: string[][]): { errors: CsvError[] } {
  const errors: CsvError[] = [];
  const tagSchema = createTagValidation();

  for (let i = 1; i < parsedData.length; i++) {
    const row = parsedData[i];
    if (row.length < 6) {
      errors.push({ row: i + 1, field: "row", message: "열 수가 부족합니다 (최소 6열)" });
      continue;
    }

    const url = (row[0] || "").trim();
    const title = (row[1] || "").trim();
    const categoryRaw = (row[2] || "").trim();
    const tagsStr = row[3] || "";
    const memo = (row[4] || "").trim();
    const description = (row[5] || "").trim();

    // URL 必須 & 形式チェック
    if (!url) {
      errors.push({ row: i + 1, field: "url", message: "url은 필수입니다" });
    } else {
      try {
        // new URL でスキーム必須チェック
        // スキームが無い場合は失敗
        // 例外時は形式不正
        // eslint-disable-next-line no-new
        new URL(url);
      } catch {
        errors.push({ row: i + 1, field: "url", message: "올바른 URL 형식이 아닙니다" });
      }
    }

    // category: レベル<=3, 各セグメント30文字以内
    if (categoryRaw) {
      const parts = categoryRaw
        .replace(/＞/g, ">")
        .split(">")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      if (parts.length > 3) {
        errors.push({ row: i + 1, field: "category", message: "> 문자가 2개를 초과할 수 없습니다 (레벨 최대 3)" });
      }
      for (const part of parts) {
        if (part.length > 30) {
          errors.push({ row: i + 1, field: "category", message: `카테고리 이름은 30자 이내여야 합니다: ${part}` });
        }
      }
    }

    // tags: "," 区切りで各タグを検証
    if (tagsStr) {
      const tags = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      for (const tag of tags) {
        const r = tagSchema.safeParse(tag);
        if (!r.success) {
          const msg = r.error.errors[0]?.message ?? "잘못된 태그 형식";
          errors.push({ row: i + 1, field: "tags", message: `태그 오류(${tag}): ${msg}` });
        }
      }
    }
  }

  return { errors };
}

// CSVからカテゴリパス配列を抽出（unique）
export function prepareCategoriesFromCSV(parsedData: string[][]): string[] {
  const categories = parsedData
    .slice(1)
    .map((row) => row[2])
    .filter((category) => category && category.trim() !== "")
    .map((p) =>
      p
        .replace(/＞/g, '>')
        .split(">")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .join(" > ")
    );
  return Array.from(new Set(categories));
}

// カテゴリ一括登録API呼び出し
export async function bulkAddCategory(categoryPaths: string[]) {
  const res = await fetch("/api/bookmarks/category-bulk-add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paths: categoryPaths }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}

// カテゴリ一括登録API結果から categoryMap を構築
export function buildCategoryMapFromBulkResults(
  results: Array<{ path: string; category_id: number }>
): Record<string, { id: number; level: number; parent_id: number | null }> {
  const map: Record<string, { id: number; level: number; parent_id: number | null }> = {};
  for (const r of results) {
    const level = r.path.split(" > ").length;
    map[r.path] = { id: r.category_id, level, parent_id: null };
  }
  return map;
}

export async function bulkAddBookmark(bookmarks: Array<{
  title: string;
  url: string;
  categoryId: number | null;
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
