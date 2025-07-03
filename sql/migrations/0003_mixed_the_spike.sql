-- Custom SQL migration file, put your code below! --
-- bookmark
CREATE TRIGGER set_bookmark_updated_at  
BEFORE UPDATE ON bookmark
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- memo
CREATE TRIGGER set_memo_updated_at
BEFORE UPDATE ON memo
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- category
CREATE TRIGGER set_category_updated_at
BEFORE UPDATE ON category
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- content_type
CREATE TRIGGER set_content_type_updated_at
BEFORE UPDATE ON content_type
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ui_type
CREATE TRIGGER set_ui_type_updated_at
BEFORE UPDATE ON ui_type
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ui_view
CREATE TRIGGER set_ui_view_updated_at
BEFORE UPDATE ON ui_view
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- tag
CREATE TRIGGER set_tag_updated_at
BEFORE UPDATE ON tag
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
