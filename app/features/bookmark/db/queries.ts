import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

/**
 * Retrieve all bookmark categories for a specific user
 * 
 * This function fetches all bookmark categories for a user,
 * including all category details like name, level, and parent category.
 * The RLS policies ensure users can only access their own bookmark categories.
 * 
 * @param client - Authenticated Supabase client instance
 * @param userId - The ID of the user whose categories to retrieve
 * @param contentTypeId - The ID of the content type to filter categories by
 * @returns An array of bookmark categories for the specified user and content type
 * @throws Will throw an error if the database query fails
 */
export const getBookmarkCategories = async (
    client: SupabaseClient<Database>,
    { userId }: 
    { userId: string },
) => {
  const { data: contentTypeData } = await client
    .from('content_type')
    .select('content_type_id')
    .eq('content_type_code', 'bookmark')
    .limit(1)
    .single();
  const contentTypeId = contentTypeData?.content_type_id ?? 1;

  const { data, error } = await client
    .from('category')
    .select('*')
    .eq('user_id', userId)
    .eq('content_type_id', contentTypeId);
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Retrieve all bookmark contents for a specific user
 * 
 * This function fetches all bookmark contents for a user,
 * including all bookmark details like title, url, and thumbnail.
 * The RLS policies ensure users can only access their own bookmark contents.
 * 
 * @param client - Authenticated Supabase client instance
 * @param userId - The ID of the user whose bookmark contents to retrieve
 * @returns An array of bookmark contents for the specified user
 * @throws Will throw an error if the database query fails
 */
export const getBookmarkContents = async (
    client: SupabaseClient<Database>,
    { userId }: 
    { userId: string },
) => {
  const { data, error } = await client
    .from('bookmark_view')
    .select('*')
    .eq('user_id', userId)
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Retrieve all UI view tabs for a specific user
 * 
 * This function fetches all UI view tabs for a user,
 * including all UI view tab details like name, category, and content type.
 * The RLS policies ensure users can only access their own UI view tabs.
 * 
 * @param client - Authenticated Supabase client instance
 * @param userId - The ID of the user whose UI view tabs to retrieve
 * @returns An array of UI view tabs for the specified user
 * @throws Will throw an error if the database query fails
 */
export const getUIViewTabs = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string },
) => {

  const { data: uiTypeData } = await client
    .from('ui_type')
    .select('ui_type_id')
    .eq('ui_type_code', 'tab')
    .limit(1)
    .single();

  const uiTypeId = uiTypeData?.ui_type_id ?? 3;

  const { data, error } = await client
    .from('ui_view')
    .select(
      `
      ui_view_id,
      user_id,
      ui_type_id,
      content_type_id,
      name,
      category_id
      `
    )
    .eq('user_id', userId)
    .eq('ui_type_id', uiTypeId)
    .eq('content_type_id', 1);
  if (error) {
    throw error;
  }
  return data;
}

