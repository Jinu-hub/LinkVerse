import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";


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