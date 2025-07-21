-- 주어진 content_type_id, user_id, category_ids에 대해
-- 해당 사용자가 지정한 카테고리 내에서 연결된 tag_id 목록을 중복 없이 반환하는 함수
CREATE OR REPLACE FUNCTION fetch_user_tags_by_categories(  
  p_content_type_id INT,
  p_user_id UUID,
  p_category_ids INT[]
)
RETURNS INT[] AS $$
DECLARE
  v_tag_ids INT[];
BEGIN
 
  SELECT ARRAY(
    SELECT DISTINCT tag_id
    FROM taggable 
    WHERE content_type_id = p_content_type_id 
      AND EXISTS (
        SELECT 1
        FROM content_view 
        WHERE content_view.category_id = ANY(p_category_ids) 
          AND content_view.user_id = p_user_id
          AND content_view.target_id = taggable.target_id
      )
  ) INTO v_tag_ids;

  RETURN v_tag_ids;
END;
$$ LANGUAGE plpgsql;
