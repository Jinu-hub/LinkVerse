import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

/**
 * Retrieve all tags for a specific user
 * 
 * This function fetches all tags for a user,
 * including all tag details like name, color, and parent tag.
 * The RLS policies ensure users can only access their own tags.
 * 
 * @param client - Authenticated Supabase client instance
 * @param userId - The ID of the user whose tags to retrieve
 * @returns An array of tags for the specified user
*/
export const getTags = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string },
) => {
  const { data, error } = await client
    .from('tag')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    throw error;
  }
  return data;
}

/**
 * Retrieve all tag contents for a specific user
 * 
 * This function fetches all tag contents for a user,
 * including all tag content details like name, color, and parent tag.
 * The RLS policies ensure users can only access their own tag contents.
 * 
 * @param client - Authenticated Supabase client instance
 * @param userId - The ID of the user whose tag contents to retrieve
 * @returns An array of tag contents for the specified user
 */
export const getTagContents = async (
  client: SupabaseClient<Database>,
  { userId, tagId }: { userId: string, tagId: number },
) => {
  const { data, error } = await client
    .from('tag_content_view')
    .select('*')
    .eq('user_id', userId)
    .eq('tag_id', tagId);
  if (error) {
    throw error;
  }
  return data;
}
