import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getTagsByNameList } from "~/features/tag/db/queries";
import {
    createTags, 
    createTaggable, 
    deleteTaggableByTarget, 
    updateTagUsageCount
 } from "~/features/tag/db/mutations";
import { getMaxCategorySortOrder } from "../db/queries";
import { createBookmarkCategory } from "../db/mutations";

export async function createNewCategory(
    client: SupabaseClient<Database>,
    { userId, name, parent_id, level }: 
    { userId: string, name: string, parent_id: number | null, level: number }) {

    const realParentId = parent_id === 0 ? null : parent_id;
    const maxSortOrder = await getMaxCategorySortOrder(client, {
        userId, parent_id: realParentId });
    
    const newCategory = await createBookmarkCategory(client, {
        userId,
        name,
        parent_id: realParentId,
        level,
        sort_order: maxSortOrder + 1,
        });
    return newCategory;
}


// 태그 처리 함수 분리
export async function handleBookmarkTags(
    client: SupabaseClient<Database>,
    { userId, bookmarkId, tags, isUpdate }: 
    { userId: string, bookmarkId: number, tags: string[], isUpdate: boolean }) {
        
    // 입력된 태그 목록 
    const tagList = tags.map(tag => tag.trim());
    // 기존 태그 목록 조회
    const existingTags = await getTagsByNameList(client, {
      userId: userId,
      name: tagList,
    });
    const existingTagNames = existingTags.map(tag => tag.tag_name);
    // 기존 태그 목록에 없는 태그 목록이 있으면 생성
    const newTagNames = tagList.filter(tag => !existingTagNames.includes(tag));
    if (newTagNames.length > 0) {
        const newTags = await createTags(client, {
            userId: userId,
            name: newTagNames,
        });
        existingTags.push(...newTags);
    }
    // 콘텐츠와 태그 연결:삭제
    if (isUpdate) {
        await deleteTaggableByTarget(client, {
            content_type_id: 1,
            target_id: bookmarkId,
        });
    }
    // 콘텐츠와 태그 연결:생성
    for (const tag of existingTags) {
        await createTaggable(client, {
            tag_id: tag.tag_id,
            content_type_id: 1,
            target_id: bookmarkId,
        });
    }
    // 태그 사용량 업데이트
    for (const tag of existingTags) {
        await updateTagUsageCount(client, {
            tag_id: tag.tag_id,
        });
    }
    return existingTags;
}