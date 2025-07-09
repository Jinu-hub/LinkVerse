import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Retrieve all memo contents for a specific user
 * 
 * This function fetches all memo contents for a user,
 * including all memo content details like name, color, and parent tag.
 * The RLS policies ensure users can only access their own memo contents.

 * @param client - Authenticated Supabase client instance
 * @param userId - The ID of the user whose memo contents to retrieve
 * @returns An array of memo contents for the specified user
 */
export const getMemoContents = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string },
) => {
  const { data, error } = await client
    .from('memo_content_view')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    //console.error('getMemoContents: error:', error);
    throw error;
  } 
  return data;
}

export const getTargetMemo = async (
  client: SupabaseClient<Database>,
  { content_type_id, target_id, userId }: 
  { content_type_id: number, target_id: number, userId: string },
): Promise<string | undefined> => {
  const { data, error } = await client
    .from('memo')
    .select('content')
    .eq('content_type_id', content_type_id)
    .eq('target_id', target_id)
    .eq('user_id', userId);

  if (error) throw error;
  return data?.[0]?.content || '';
}

export const getMemoDetail = async (
  client: SupabaseClient<Database>,
  { userId, memoId }: { userId: string, memoId: number },
) => {
  const { data, error } = await client
    .from('memo_content_view')
    .select('*')
    .eq('user_id', userId)
    .eq('memo_id', memoId);

  if (error) {
    //console.error('getMemoDetail: error:', error);
    throw error;
  }
  return data;
}