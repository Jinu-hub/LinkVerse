-- 주어진 user_id와 parent_id(부모 카테고리) 기준으로 
-- 해당 사용자의 카테고리 중 최대 sort_order 값을 반환하는 함수
CREATE OR REPLACE FUNCTION get_max_category_sort_order(p_user_id uuid, p_parent_id int)
RETURNS int
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT COALESCE(MAX(sort_order), 0)
  FROM category
  WHERE user_id = p_user_id
    AND (
      parent_category_id = p_parent_id
      OR (parent_category_id IS NULL AND p_parent_id IS NULL)
    );
$$;
