import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const createBookmarkCategory = async (
    client: SupabaseClient<Database>,
    { userId, name, parentId, level, sortOrder }:
    { userId: string, name: string, parentId: number | null, level: number, sortOrder: number },
) => {
    const { error } = await client
        .from('category')
        .insert({
            user_id: userId, 
            content_type_id: 1,
            category_name: name, 
            parent_category_id: parentId,
            is_default: false,
            level: level ? level : 1,
            sort_order: sortOrder ? sortOrder : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
    if (error) {
        throw error
    }
}

export const updateBookmarkCategory = async (
    client: SupabaseClient<Database>,
    { userId, name, parentId, categoryId }:
    { userId: string, name: string, parentId: number | null, categoryId: number },
) => {
    const { data, error } = await client
        .from('category')
        .update({ category_name: name, parent_category_id: parentId })
        .eq('user_id', userId)
        .eq('category_id', categoryId)  
        .select()
    if (error) {
        throw error
    }
    return data
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
        .select()
    if (error) {
        throw error
    }
    return data
}