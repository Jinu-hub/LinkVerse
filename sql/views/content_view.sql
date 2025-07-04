CREATE OR REPLACE VIEW content_view AS
SELECT
    1                         AS content_type_id,
    content.bookmark_id           AS target_id,
    content.user_id               AS user_id,
    content.category_id           AS category_id,
    content.title                 AS title,
    content.created_at            AS created_at,
    content.updated_at            AS updated_at,
    content.click_count           AS use_count,
    content.url                   AS url,
    content.thumbnail_url         AS thumbnail_url
FROM bookmark_view content
/*
UNION ALL
SELECT
    2                            AS content_type_id,
    content.tag_content_id        AS target_id,
    content.user_id               AS user_id,
    content.tag_id                AS category_id,
    content.title                 AS title,
    content.created_at            AS created_at,
    content.updated_at            AS updated_at,
    content.click_count           AS use_count,
    content.url                   AS url,
    content.thumbnail_url         AS thumbnail_url  
FROM tag_content_view content
*/

