CREATE TRIGGER set_bookmark_updated_at -- <- name of the trigger
BEFORE UPDATE ON bookmark
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_memo_updated_at
BEFORE UPDATE ON memo
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_category_updated_at
BEFORE UPDATE ON category
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_content_type_updated_at
BEFORE UPDATE ON content_type
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_ui_type_updated_at
BEFORE UPDATE ON ui_type
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_ui_view_updated_at
BEFORE UPDATE ON ui_view
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_user_activity_updated_at
BEFORE UPDATE ON user_activity
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_tag_updated_at
BEFORE UPDATE ON tag
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
