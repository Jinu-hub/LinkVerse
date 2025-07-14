import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import type { ACTIVITY_TYPE } from "../lib/activity.types";

export const getUserActivity = async (
    client: SupabaseClient<Database>,
    { user_id, content_type_id, target_id, activity_type }: 
    { user_id: string, content_type_id: number, target_id: number, activity_type: ACTIVITY_TYPE },
) => {
    const { data, error } = await client
        .from('user_activity')
        .select('*')
        .eq('user_id', user_id)
        .eq('content_type_id', content_type_id)
        .eq('target_id', target_id)
        .eq('activity_type', activity_type)
    if (error) {
        throw error
    }
    return data?.length > 0 ? data[0] : null;
}