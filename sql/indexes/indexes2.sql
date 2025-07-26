-- 외래키 인덱스
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookmark_user_id
ON bookmark (user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_category_content_type_id
ON category (content_type_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_category_parent_category_id
ON category (parent_category_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_memo_content_type_id
ON memo (content_type_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_memo_user_id
ON memo (user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ui_view_category_id
ON ui_view (category_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ui_view_content_type_id
ON ui_view (content_type_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ui_view_ui_type_id
ON ui_view (ui_type_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ui_view_user_id
ON ui_view (user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_activity_content_type_id
ON user_activity (content_type_id);

