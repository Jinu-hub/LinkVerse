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
import { createMemo, updateMemo } from "~/features/memo/db/mutations";
import { getTargetMemoId } from "~/features/memo/db/queries";
import type { Bookmark } from "./bookmark.types";

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

// 태그 처리 함수
export async function handleContentTags(
    client: SupabaseClient<Database>,
    { userId, content_type_id, target_id, tags, mode }: 
    { userId: string, content_type_id: number, target_id: number, tags: string[]
        , mode: "add" | "update" | "delete" }) {
        
    // 입력된 태그 목록 
    const tagList = tags.map(tag => tag.trim());
    // 기존 태그 목록 조회
    const existingTags = await getTagsByNameList(client, {
      userId: userId,
      name: tagList,
    });

    // 기존 태그 목록에 없는 태그 목록이 있으면 생성
    if (mode === "add" || mode === "update") {
        const existingTagNames = existingTags.map(tag => tag.tag_name);
        const newTagNames = tagList.filter(tag => !existingTagNames.includes(tag));
        if (newTagNames.length > 0) {
            const newTags = await createTags(client, {
                userId: userId,
                name: newTagNames,
            });
            existingTags.push(...newTags);
        }
    }

    // 콘텐츠와 태그 연결:삭제
    if (mode === "update" || mode === "delete") {
        await deleteTaggableByTarget(client, {
            content_type_id,
            target_id,
        });
    }

    // 콘텐츠와 태그 연결:생성
    if (mode === "add" || mode === "update") {
        for (const tag of existingTags) {
            await createTaggable(client, {
                tag_id: tag.tag_id,
                content_type_id,
                target_id,
            });
        }
    }

    // 태그 사용량 업데이트
    for (const tag of existingTags) {
        await updateTagUsageCount(client, {
            tag_id: tag.tag_id,
        });
    }
    return existingTags;
}

export async function handleBookmarkMemo(
    client: SupabaseClient<Database>,
    { userId, target_id, content, isUpdate }: 
    { userId: string, target_id: number, content: string, isUpdate: boolean }) {
    if (isUpdate) {
        const memoId = await getTargetMemoId(client, {
            content_type_id: 1,
            target_id,
            userId,
        });
        if (memoId !== null) {
            const memoData = await updateMemo(client, {
                user_id: userId,
                memo_id: memoId,
                content,
            });
            return memoData;
        } else {
            const memoData = await createMemo(client, {
                user_id: userId,
                content_type_id: 1,
                target_id,
                content,
            });
            return memoData;
        }
    } else {
        const memoData = await createMemo(client, {
            user_id: userId,
            content_type_id: 1,
            target_id,
            content,
        });
        return memoData;
    }
}

export function createBookmarkResult(bookmark: any, resTags: string[], resMemo: string) {
    //console.log("bookmark", bookmark);
    const bookmarkResult: Bookmark = {
        id: bookmark.bookmark_id,
        url: bookmark.url as string,
        title: bookmark.title ?? "",
        categoryId: bookmark.category_id ?? 0,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        description: bookmark.description ?? "",
        click_count: 0,
        tags: resTags,
        memo: resMemo,
      };
    return bookmarkResult;
}