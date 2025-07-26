-- 주어진 tag_id에 대해 taggable 테이블에서 사용된 횟수를 집계하여 tag 테이블의 usage_count를 갱신하는 함수
CREATE OR REPLACE FUNCTION sync_tag_usage_with_content(p_tag_id INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_usage_count INT;
BEGIN
  SELECT COUNT(*) INTO v_usage_count FROM taggable WHERE tag_id = p_tag_id;

  UPDATE tag
  SET usage_count = v_usage_count
  WHERE tag_id = p_tag_id;
END;
$$;
