create index idx_category_user_parent ON category(user_id, parent_category_id);


-- 추천 인덱스
CREATE INDEX idx_taggable_content_type_id ON taggable(content_type_id);
CREATE INDEX idx_taggable_target_id ON taggable(target_id);
CREATE INDEX idx_bookmark_category_user_target ON bookmark(category_id, user_id, bookmark_id);
