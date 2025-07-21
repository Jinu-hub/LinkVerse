-- 주어진 content_type_id에 대해 content_view에 존재하지 않는 taggable 데이터를 삭제하고,
-- 삭제된 태그의 usage_count를 갱신(0 또는 실제 사용량)하며, 삭제된 개수를 반환하는 함수
CREATE OR REPLACE FUNCTION sync_tag_usage_counts()
RETURNS integer AS $$
DECLARE
  v_tag_ids INT[];
  v_deleted_count integer;
BEGIN
  -- 삭제 대상 tag_id 수집
  SELECT ARRAY(
    SELECT DISTINCT tag_id
    FROM taggable 
    WHERE content_type_id = 1
      AND NOT EXISTS (
        SELECT 1
        FROM content_view 
        WHERE content_type_id = 1
          AND target_id = taggable.target_id
      )
  ) INTO v_tag_ids;

  -- NULL 대비
  v_tag_ids := COALESCE(v_tag_ids, '{}');

  -- 삭제
  DELETE FROM taggable 
  WHERE content_type_id = 1
    AND NOT EXISTS (
      SELECT 1
      FROM content_view
      WHERE content_type_id = 1
        AND target_id = taggable.target_id
    );

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  -- usage_count 재계산
  UPDATE tag t
  SET usage_count = sub.usage_count
  FROM (
    SELECT tag_id, COUNT(*) AS usage_count
    FROM taggable
    WHERE tag_id = ANY(v_tag_ids)
    GROUP BY tag_id
  ) sub
  WHERE t.tag_id = sub.tag_id;

  -- 사용되지 않는 태그 0 처리
  UPDATE tag
  SET usage_count = 0
  WHERE tag_id = ANY(v_tag_ids)
    AND NOT EXISTS (
      SELECT 1 FROM taggable WHERE taggable.tag_id = tag.tag_id
    );

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
