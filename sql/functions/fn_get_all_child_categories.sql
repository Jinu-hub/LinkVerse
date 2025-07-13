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
