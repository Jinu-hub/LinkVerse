-- INSERT 트리거
CREATE TRIGGER trg_insert_ui_view
AFTER INSERT ON category
FOR EACH ROW
EXECUTE FUNCTION sync_ui_view_with_category();

-- UPDATE 트리거
CREATE TRIGGER trg_update_ui_view
AFTER UPDATE ON category
FOR EACH ROW
EXECUTE FUNCTION sync_ui_view_with_category();

-- DELETE 트리거
CREATE TRIGGER trg_delete_ui_view
AFTER DELETE ON category
FOR EACH ROW
EXECUTE FUNCTION sync_ui_view_with_category();
