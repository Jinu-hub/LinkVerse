-- 주어진 content_type_id, user_id, tag_id 목록에 대해
-- content_view에 존재하지 않는 taggable 데이터를 삭제하고,
-- 관련 태그의 usage_count를 갱신(0 또는 실제 사용량)하며, 삭제된 개수를 반환하는 함수
CREATE OR REPLACE FUNCTION sync_taggable_with_content_delete(
  p_content_type_id INT,
  p_user_id UUID,
  p_tag_ids INT[]
)
RETURNS integer AS $$
DECLARE
  v_deleted_count integer;
BEGIN

  -- 삭제
  DELETE FROM taggable 
  WHERE content_type_id = p_content_type_id
    AND NOT EXISTS (
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
    AND NOT EXISTS (
      SELECT 1 FROM taggable WHERE taggable.tag_id = tag.tag_id
    );

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;
