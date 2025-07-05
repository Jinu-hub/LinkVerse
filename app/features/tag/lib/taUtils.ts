import type { Tag, TagContent } from "../types/tag.types";

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
