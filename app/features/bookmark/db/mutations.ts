import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { registUserActivity } from "~/features/user_activity/db/mutations";

export const createBookmarkCategory = async (
    client: SupabaseClient<Database>,
    { userId, name, parent_id, level, sort_order }:
    { userId: string, name: string, parent_id: number | null, level: number, sort_order: number },
) => {
    const { data, error } = await client
        .from('category')
        .insert({
            user_id: userId, 
            content_type_id: 1,
            category_name: name, 
            parent_category_id: parent_id,
            is_default: false,
            level: level ? level : 1,
            sort_order: sort_order ? sort_order : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).select().single();
    if (error) {
        throw error
    }
    return data;
}

export const updateBookmarkCategoryName = async (
    client: SupabaseClient<Database>,
    { userId, name, categoryId }:
    { userId: string, name: string, categoryId: number },
) => {
    const { error } = await client
        .from('category')
        .update({ category_name: name })
        .eq('user_id', userId)
        .eq('category_id', categoryId)  
        .eq('content_type_id', 1)
    if (error) {
        throw error
    }
}

export const deleteBookmarkCategory = async (
    client: SupabaseClient<Database>,
    { userId, categoryId }: { userId: string, categoryId: number },
) => {
    const { data, error } = await client
        .from('category')
        .delete()
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .eq('content_type_id', 1)
    if (error) {
        throw error
    }
    return data
}


export const createBookmark = async (
    client: SupabaseClient<Database>,
    { user_id, category_id, title, url, thumbnail_url, description }:
    { user_id: string, category_id: number, title: string, url: string, thumbnail_url: string, description: string },
) => {
    const realCategoryId = category_id === 0 ? null : category_id;
    const { data, error } = await client
        .from('bookmark')
        .insert({ 
            user_id, 
            category_id: realCategoryId, 
            title, 
            url, 
            thumbnail_url, 
            description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select().single();
    if (error) {
        throw error
    }
    return data;
}

export const updateBookmark = async (
    client: SupabaseClient<Database>,
    { user_id, bookmark_id, category_id, title, url }:
    { user_id: string, bookmark_id: number, category_id: number, title: string, url: string },
) => {
    const realCategoryId = category_id === 0 ? null : category_id;
    const { data, error } = await client
        .from('bookmark')
        .update({ category_id: realCategoryId, title, url })
        .eq('user_id', user_id)
        .eq('bookmark_id', bookmark_id)
        .select().single();
    if (error) {
        throw error
    }
    return data
}

export const deleteBookmark = async (
    client: SupabaseClient<Database>,
    { user_id, bookmark_id }: { user_id: string, bookmark_id: number },
) => {
    const { data, error } = await client
        .from('bookmark')
        .delete()
        .eq('user_id', user_id)
        .eq('bookmark_id', bookmark_id)
        .select()
    if (error) {
        throw error
    }
    return data?.length > 0 ? data[0] : null;
}

export const updateBookmarkClickCount = async (
    client: SupabaseClient<Database>,
    { user_id, bookmark_id }: { user_id: string, bookmark_id: number },
) => {
    try {
        const data = await registUserActivity(client, {
            user_id,
            content_type_id: 1,
            target_id: bookmark_id,
            activity_type: 'click',
        });
        return data;
    } catch (error) {
        console.error("updateBookmarkClickCount error", error);
        throw error;
    }
}