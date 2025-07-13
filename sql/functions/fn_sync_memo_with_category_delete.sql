CREATE OR REPLACE FUNCTION sync_memo_with_category_delete(
  p_category_id INT,
  p_content_type_id INT,
  p_user_id UUID
)
RETURNS VOID AS $$
DECLARE
BEGIN

  -- 삭제
  DELETE FROM memo 
  WHERE content_type_id = p_content_type_id 
    AND EXISTS (
      SELECT 1
      FROM bookmark 
      WHERE category_id = p_category_id 
        AND user_id = p_user_id
        AND bookmark_id = memo.target_id
    );

END;
$$ LANGUAGE plpgsql;
