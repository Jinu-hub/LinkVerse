CREATE OR REPLACE FUNCTION sync_tag_usage_with_content()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
BEGIN

  -- INSERT or UPDATE
  IF (TG_OP = 'INSERT') THEN
    IF NEW.tag_id IS NOT NULL THEN
        -- 기존 tag의 사용 횟수 증가
        UPDATE tag
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    END IF;

  -- DELETE
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.tag_id IS NOT NULL THEN
      -- 기존 tag의 사용 횟수 감소
      UPDATE tag
      SET usage_count = usage_count - 1
      WHERE id = OLD.tag_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;
