CREATE OR REPLACE FUNCTION sync_memo_with_content_delete(
  p_content_type_id INT,
  p_user_id UUID
)
RETURNS integer AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  -- 삭제
DELETE FROM memo
WHERE NOT EXISTS (
  SELECT 1
  FROM content_view
  WHERE content_view.content_type_id = p_content_type_id
    AND content_view.target_id = memo.target_id
    AND content_view.user_id = p_user_id
);
  -- 삭제된 메모 수 카운트
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
