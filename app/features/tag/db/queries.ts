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

export const getTagsByNameList = async (
  client: SupabaseClient<Database>,
  { userId, name }: { userId: string, name: string[] },
) => {
  const { data, error } = await client
    .from('tag')
    .select('tag_id, tag_name')
    .eq('user_id', userId)
    .in('tag_name', name);
  if (error) {
    throw error;
  }
  return data;
}

export const getTaggableTags = async (
  client: SupabaseClient<Database>,
  { content_type_id, target_id, userId }: 
  { content_type_id: number, target_id: number, userId: string },
) => {
  const { data, error } = await client
    .from('taggable')
    .select('tag:tag_id(tag_name)')
    .eq('content_type_id', content_type_id)
    .eq('target_id', target_id)
    .eq('tag.user_id', userId);

  if (error) throw error;
  if (!Array.isArray(data)) return [];

  return data.map((row) => row.tag.tag_name);  // tag_name만 추출
};

export const getTaggableTagsIdName = async (
  client: SupabaseClient<Database>,
  { content_type_id, target_id, userId }: 
  { content_type_id: number, target_id: number, userId: string },
) => {
  const { data, error } = await client
    .from('taggable')
    .select('tag_id, target_id, tag:tag_id(tag_name)')
    .eq('content_type_id', content_type_id)
    .eq('target_id', target_id)
    .eq('tag.user_id', userId);

  if (error) throw error;
  if (!Array.isArray(data)) return [];

  return data.map(item => ({
    tag_id: item.tag_id,
    tag_name: item.tag.tag_name
  }));
};

export const getTagIdsWithCategory = async (
  client: SupabaseClient<Database>,
  { content_type_id, category_ids, userId }: 
  { content_type_id: number, category_ids: number[], userId: string },
) => {
  const { data, error } = await client
    .rpc('fetch_user_tags_by_categories', {
      p_content_type_id: content_type_id,
      p_category_ids: category_ids as any,
      p_user_id: userId,
    });
  if (error) throw error;
  if (!Array.isArray(data)) return [];
  return data;
}

export const getUntaggedContents = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string },
) => {
  const { data, error } = await client
    .from('content_untagged_view')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}