CREATE TRIGGER trg_create_default_category
AFTER INSERT ON auth.users 
FOR EACH ROW
EXECUTE FUNCTION create_default_category();
