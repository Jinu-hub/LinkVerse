CREATE OR REPLACE VIEW memo_content_view AS
SELECT
    memo.memo_id,
    memo.user_id,
    memo.summary,
    memo.content AS memo,
    memo.created_at,
    memo.updated_at,
    memo.position,
    memo.is_pinned,
    cv.content_type_id,
    cv.target_id,
    cv.category_id,
    cv.title,
    cv.url,
    cv.thumbnail_url,
    cv.description
FROM memo
JOIN content_view cv 
  ON memo.content_type_id = cv.content_type_id
  AND memo.target_id = cv.target_id
  AND memo.user_id = cv.user_id
  