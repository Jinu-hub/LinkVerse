CREATE OR REPLACE FUNCTION sync_taggable_with_category_delete(
  p_category_id INT,
  p_content_type_id INT,
  p_user_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_tag_ids INT[];
BEGIN
  -- 수집
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

  -- 삭제
  DELETE FROM taggable 
  WHERE content_type_id = p_content_type_id 
    AND EXISTS (
      SELECT 1
      FROM bookmark 
      WHERE category_id = p_category_id 
        AND user_id = p_user_id
        AND bookmark_id = taggable.target_id
    );

  -- usage_count 업데이트
  UPDATE tag t
  SET usage_count = sub.usage_count
  FROM (
    SELECT tag_id, COUNT(*) AS usage_count
    FROM taggable
    WHERE tag_id = ANY(v_tag_ids)
    GROUP BY tag_id
  ) sub
  WHERE t.tag_id = sub.tag_id;

  UPDATE tag
  SET usage_count = 0
  WHERE tag_id = ANY(v_tag_ids)
    AND tag_id NOT IN (
      SELECT DISTINCT tag_id FROM taggable WHERE tag_id = ANY(v_tag_ids)
      );

END;
$$ LANGUAGE plpgsql;
