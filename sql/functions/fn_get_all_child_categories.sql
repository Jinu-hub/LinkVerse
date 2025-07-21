-- 주어진 부모 카테고리 ID로부터 모든 하위(자식, 손자 등) 카테고리 ID를 재귀적으로 찾아 반환하는 함수
CREATE OR REPLACE FUNCTION get_all_child_categories(p_parent_id BIGINT)
RETURNS TABLE(category_id BIGINT) AS $$
WITH RECURSIVE subcategories(category_id) AS (
  SELECT p_parent_id
  UNION
  SELECT c.category_id
  FROM category c
  JOIN subcategories s 
    ON c.parent_category_id = s.category_id
)
SELECT category_id
FROM subcategories
WHERE category_id <> p_parent_id;
$$ LANGUAGE sql;
