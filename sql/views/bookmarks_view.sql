CREATE OR REPLACE VIEW bookmark_view AS
SELECT
  bookmark_id,
  user_id,
  category_id,
  title,
  url,
  thumbnail_url,
  description,
  created_at,
  updated_at,
  COALESCE(
    (SELECT value FROM user_activity 
    WHERE content_type_id = 1 
      AND user_id = bookmark.user_id
      AND target_id = bookmark.bookmark_id
      AND activity_type = 'click'
  ), 0) AS click_count
FROM bookmark
ORDER BY click_count DESC;
