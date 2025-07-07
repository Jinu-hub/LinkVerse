import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const createBookmarkCategory = async (
    client: SupabaseClient<Database>,
    { userId, name, parent_id, level, sort_order }:
    { userId: string, name: string, parent_id: number | null, level: number, sort_order: number },
) => {
    const { error } = await client
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
        })
        .select()
    if (error) {
        throw error
    }
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
    console.log("deleteBookmarkCategory", userId, categoryId);
    const { data, error } = await client
        .from('category')
        .delete()
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .eq('content_type_id', 1)
    console.log("deleteBookmarkCategory", error);
    if (error) {
        throw error
    }
    return data
}