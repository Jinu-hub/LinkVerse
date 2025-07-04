CREATE OR REPLACE FUNCTION sync_ui_view_with_category()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  tab_ui_type_id INTEGER;
BEGIN
  -- 'tab' 코드의 ui_type_id 조회
  SELECT ui_type_id INTO tab_ui_type_id
  FROM ui_type
  WHERE ui_type_code = 'tab'
  LIMIT 1;

  -- INSERT or UPDATE
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.content_type_id = 1 AND NEW.parent_category_id IS NULL THEN
      
      IF EXISTS (
        SELECT 1 FROM ui_view WHERE category_id = NEW.category_id
      ) THEN
        -- 기존 ui_view 존재 시 UPDATE
        UPDATE ui_view
        SET
          name = NEW.category_name,
          sort_order = NEW.sort_order,
          updated_at = now()
        WHERE category_id = NEW.category_id;
      ELSE
        -- 존재하지 않으면 INSERT
        INSERT INTO ui_view (
          user_id,
          ui_type_id,
          content_type_id,
          category_id,
          name,
          sort_order,
          created_at,
          updated_at
        )
        VALUES (
          NEW.user_id,
          tab_ui_type_id,
          NEW.content_type_id,
          NEW.category_id,
          NEW.category_name,
          NEW.sort_order,
          now(),
          now()
        );
      END IF;

    END IF;

  -- DELETE
  ELSIF (TG_OP = 'DELETE') THEN
    IF OLD.content_type_id = 1 AND OLD.parent_category_id IS NULL THEN
      DELETE FROM ui_view
      WHERE category_id = OLD.category_id;
    END IF;
  END IF;

  RETURN NULL;
END;
$$;
