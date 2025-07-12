import { sortArray } from "~/core/lib/utils";
import type { SortKey, Tag, TagContent } from "./tag.types";

export function toTag(item: any): Tag {
  return {
    id: Number(item.tag_id),
    name: item.tag_name ?? '',
    usage_count: Number(item.usage_count),
    createdAt: item.created_at ?? '',
  };
}
      
export function toTagContent(item: any): TagContent {
  return {
    tagId: Number(item.tag_id),
    tagName: item.tag_name,
    contentTypeId: Number(item.content_type_id),
    contentId: item.target_id,
    title: item.title,
    useCount: Number(item.use_count) || undefined,
    description: '',
    memo: item.memo ?? '',
    createdAt: item.created_at ?? '',
    url: item.url ?? '',
    extra: {},
  };
}

export function getSortedTags(tags: Tag[], sortKey: SortKey, sortOrder: 'asc' | 'desc') {
  if (sortKey === "usage_count") {
    return sortArray(tags, "usage_count", sortOrder);
  } else if (sortKey === "name") {
    return sortArray(tags, "name", sortOrder);
  } else if (sortKey === "created_at") {
    return sortArray(tags, "createdAt", sortOrder);
  }
  return tags;
}