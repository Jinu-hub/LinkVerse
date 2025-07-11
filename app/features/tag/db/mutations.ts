import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { sql } from "drizzle-orm";

export const createTags = async (client: SupabaseClient<Database>, 
    { userId, name }: { userId: string, name: string[] }) => {
  const { data, error } = await client
    .from('tag')
    .insert(name.map(name => ({
      user_id: userId,
      tag_name: name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })))
    .select('tag_id, tag_name');
  if (error) {
    throw error;
  }
  return data;
}

export const updateTagUsageCount = async (client: SupabaseClient<Database>, 
    { tag_id }: { tag_id: number }) => {
  const { error } = await client
    .rpc('sync_tag_usage_with_content', { p_tag_id: tag_id });
  if (error) {
    throw error;
  }
}

export const deleteTaggableByTarget = async (client: SupabaseClient<Database>, 
    { content_type_id, target_id }: 
    { content_type_id: number, target_id: number }) => {
  const { error } = await client
    .from('taggable')
    .delete()
    .eq('content_type_id', content_type_id)
    .eq('target_id', target_id);
  if (error) {
    throw error;
  }
}

export const createTaggable = async (client: SupabaseClient<Database>, 
    { tag_id, content_type_id, target_id }: 
    { tag_id: number, content_type_id: number, target_id: number }) => {
  const { error } = await client
    .from('taggable')
    .insert({
      tag_id,
      content_type_id,
      target_id,
    });
  if (error) {
    throw error;
  }
}