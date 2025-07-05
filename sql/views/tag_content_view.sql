CREATE OR REPLACE VIEW tag_content_view AS
SELECT
    tag.tag_id,
    tag.user_id,
    tag.tag_name,
    cv.content_type_id,
    cv.target_id,
    cv.category_id,
    cv.title,
    cv.created_at,
    cv.updated_at,
    cv.use_count,
    cv.url,
    cv.thumbnail_url,
    cv.memo
FROM tag
JOIN taggable 
  ON tag.tag_id = taggable.tag_id
JOIN content_view cv 
  ON taggable.content_type_id = cv.content_type_id 
  AND taggable.target_id = cv.target_id
  AND tag.user_id = cv.user_id
