import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "database.types"
import { getUserActivity } from "./queries";
import type { ACTIVITY_TYPE } from "../lib/activity.types";


export const registUserActivity = async (
    client: SupabaseClient<Database>,
    { user_id, content_type_id, target_id, activity_type }: 
    { user_id: string, content_type_id: number, target_id: number, activity_type: ACTIVITY_TYPE },
) => {
    const userActivity = await getUserActivity(client, {
        user_id,
        content_type_id,
        target_id,
        activity_type,
    });
    if (userActivity) {
        const { data, error } = await client
            .from('user_activity')
            .update({ value: userActivity.value ? userActivity.value + 1 : 1 })
            .eq('user_id', user_id)
            .eq('content_type_id', content_type_id)
            .eq('target_id', target_id)
            .eq('activity_type', activity_type)
            .select()
            .single();
        if (error) {
            throw error
        }
        return data;
    } else {
        const { data, error } = await client
            .from('user_activity')
            .insert({
                user_id,
                content_type_id,
                target_id,
                activity_type,
                value: 1,
            })
            .select()
            .single();
        if (error) {
            throw error
        }
        return data;
    }
}