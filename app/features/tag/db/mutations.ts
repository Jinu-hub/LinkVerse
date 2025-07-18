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

export const updateTagName = async (client: SupabaseClient<Database>, 
    { userId, tagId, name }: { userId: string, tagId: number, name: string }) => {
  const { data, error } = await client
    .from('tag')
    .update({ tag_name: name})
    .eq('tag_id', tagId)
    .eq('user_id', userId)
    .select();
  if (error) {
    throw error;
  }
  return data?.length > 0 ? data[0] : null;
}

export const deleteTag = async (client: SupabaseClient<Database>, 
    { userId, tagId }: { userId: string, tagId: number }) => {
  const { error } = await client
    .from('tag')
    .delete()
    .eq('tag_id', tagId)
    .eq('user_id', userId);
  if (error) {
    throw error;
  }
}

export const updateTagUsageCount = async (client: SupabaseClient<Database>, 
    { tag_id }: { tag_id: number }) => {
  const { error } = await client
    .rpc('sync_tag_usage_with_content', { p_tag_id: tag_id });
  if (error) {
    console.error('updateTagUsageCount error', error);
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

export const deleteContentTags = async (client: SupabaseClient<Database>, 
    { userId, content_type_id, tag_ids }: 
    { userId: string, content_type_id: number, tag_ids: number[] }) => {
  const { error } = await client
    .rpc('sync_taggable_with_content_delete', {
      p_content_type_id: content_type_id,
      p_user_id: userId,
      p_tag_ids: tag_ids,
    });
  if (error) {
    console.error('deleteContentTags error', error);
    throw error;
  }
}