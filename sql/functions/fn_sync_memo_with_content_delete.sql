-- 주어진 content_type_id와 user_id에 대해 
-- content_view에 존재하지 않는 메모 데이터를 삭제하고, 삭제된 개수를 반환하는 함수
CREATE OR REPLACE FUNCTION sync_memo_with_content_delete(
  p_content_type_id INT,
  p_user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- 메모 삭제: content_view에 존재하지 않는 항목만
  DELETE FROM memo
  WHERE NOT EXISTS (
    SELECT 1
    FROM content_view
    WHERE content_view.content_type_id = p_content_type_id
      AND content_view.target_id = memo.target_id
      AND content_view.user_id = p_user_id
  );

  -- 삭제된 메모 수 반환
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;
