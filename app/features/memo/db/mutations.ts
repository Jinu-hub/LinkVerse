import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { getTargetMemoId } from "./queries";


export const createMemo = async (client: SupabaseClient<Database>, 
    { user_id, content_type_id, target_id, content }: 
    { user_id: string, content_type_id: number, target_id: number, content: string }) => {
    const { data, error } = await client
        .from('memo')
        .insert({
            user_id,
            content_type_id,
            target_id,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }).select().single();
    if (error) {
        throw error;
    }
    return data;
}

export const updateMemo = async (client: SupabaseClient<Database>, 
    { user_id, memo_id, content }: 
    { user_id: string, memo_id: number, content: string }) => {
    const { data, error } = await client
        .from('memo')
        .update({ content })
        .eq('user_id', user_id)
        .eq('memo_id', memo_id)
        .select();
    if (error) {
        throw error;
    }
    return data?.length > 0 ? data[0] : null;
}

export const deleteMemo = async (client: SupabaseClient<Database>, 
    { user_id, content_type_id, target_id }: 
    { user_id: string, content_type_id: number, target_id: number }) => {
    const memoId = await getTargetMemoId(client, {
        content_type_id,
        target_id,
        userId: user_id,
    });
    if (memoId !== null) {
        const { data, error } = await client
            .from('memo')
            .delete()
            .eq('user_id', user_id)
            .eq('memo_id', memoId)
            .select();
        if (error) {
            throw error;
        }
        return data?.length > 0 ? data[0] : null;
    }
    return null;
}