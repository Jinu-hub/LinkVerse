-- 카테고리 조회 인덱스
create index idx_category_user_parent ON category(user_id, parent_category_id);

-- 북마크 조회 인덱스 
CREATE INDEX idx_bookmark_category_user_target ON bookmark(category_id, user_id, bookmark_id);

-- 태그 조회 인덱스
CREATE INDEX idx_taggable_content_target_id ON taggable(content_type_id, target_id);

-- 유저 활동 조회 인덱스
CREATE INDEX idx_user_activity_user_content_target
ON user_activity (user_id, content_type_id, target_id);
