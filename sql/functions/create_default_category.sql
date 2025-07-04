CREATE OR REPLACE FUNCTION create_default_category()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO category (
    category_id,
    user_id,
    content_type_id,
    category_name,
    level,
    parent_category_id,
    sort_order,
    is_default,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,                    -- users 테이블의 PK
    COALESCE(
      (SELECT content_type_id FROM content_type WHERE content_type_code = 'bookmark' LIMIT 1),
      1
    ),
    'uncategorized',
    1,                         -- 기본 level
    NULL,                      -- 부모 없음
    0,                         -- 정렬 우선순위
    TRUE,                      -- 디폴트 카테고리
    now(),
    now()
  );
  RETURN NEW;
END;
$$;
