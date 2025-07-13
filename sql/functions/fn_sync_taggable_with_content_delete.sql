CREATE OR REPLACE FUNCTION sync_taggable_with_content_delete(
  p_content_type_id INT,
  p_user_id UUID,
  p_tag_ids INT[]
)
RETURNS integer AS $$
DECLARE
  --v_tag_ids INT[];
  v_deleted_count integer;
BEGIN
  -- 수집
  /*
  SELECT ARRAY(
    SELECT DISTINCT tag_id
    FROM taggable 
    WHERE content_type_id = p_content_type_id 
      AND EXISTS (
        SELECT 1
        FROM bookmark 
        WHERE category_id = p_category_id 
          AND user_id = p_user_id
          AND bookmark_id = taggable.target_id
      )
  ) INTO v_tag_ids;

  -- NULL 대비
  v_tag_ids := COALESCE(v_tag_ids, '{}');
  */


  -- 삭제
  DELETE FROM taggable 
  WHERE NOT EXISTS (
    SELECT 1
    FROM content_view
    WHERE content_view.content_type_id = p_content_type_id
      AND content_view.target_id = taggable.target_id
      AND content_view.user_id = p_user_id
  );

  -- 삭제된 태그 수 카운트
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  -- usage_count 업데이트
  UPDATE tag t
  SET usage_count = sub.usage_count
  FROM (
    SELECT tag_id, COUNT(*) AS usage_count
    FROM taggable
    WHERE tag_id = ANY(p_tag_ids)
    GROUP BY tag_id
  ) sub
  WHERE t.tag_id = sub.tag_id;

  UPDATE tag
  SET usage_count = 0
  WHERE tag_id = ANY(p_tag_ids)
    AND tag_id NOT IN (
      SELECT DISTINCT tag_id FROM taggable WHERE tag_id = ANY(p_tag_ids)
      );

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;
