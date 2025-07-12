import type { Memo } from "./memo.types";

export function toMemo(item: any): Memo {
  return {
    memoId: Number(item.memo_id),
    contentTypeId: Number(item.content_type_id),
    title: item.title ?? '',
    content: item.memo ?? '',
    createdAt: item.created_at ?? '',
    updatedAt: item.updated_at ?? '',
  };
}