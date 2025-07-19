export type DisplayType = "default" | "bookmarks" | "tags" | "memos" | "untagged";

export interface ContentType {
  id: number;      // DB의 PK (예: content_type_id)
  code: string;    // 코드 (예: 'bookmark', 'book', ...)
  name?: string;    // (선택) 콘텐츠 이름
  description?: string; // (선택) 설명
  // createdAt, updatedAt 등도 필요하면 추가
}

export interface UiType {
  id: number;
  code: string;
  name?: string;
  description?: string;
}

