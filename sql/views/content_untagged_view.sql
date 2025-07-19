CREATE OR REPLACE VIEW content_untagged_view AS
SELECT
    cv.content_type_id,
    cv.user_id,
    cv.target_id,
    cv.category_id,
    cv.title,
    cv.created_at,
    cv.updated_at,
    cv.use_count,
    cv.url,
    cv.thumbnail_url,
    cv.description,
    cv.memo
FROM content_view cv 
WHERE 
  NOT EXISTS (
    SELECT 1
    FROM taggable
    WHERE taggable.content_type_id = cv.content_type_id
    AND taggable.target_id = cv.target_id
  )