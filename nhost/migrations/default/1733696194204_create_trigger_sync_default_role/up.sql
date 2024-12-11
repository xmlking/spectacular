CREATE OR REPLACE FUNCTION update_default_role_on_user_org_roles()
    RETURNS TRIGGER AS $$
BEGIN
    -- Case 1: Update default_role when is_current_org is set to true on INSERT or UPDATE
    IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.is_current_org = TRUE THEN
        UPDATE auth.users
        SET default_role = NEW.role
        WHERE id = NEW.user_id;
    END IF;

    -- Case 2: Update default_role when role changes on UPDATE
    IF TG_OP = 'UPDATE' AND NEW.is_current_org = TRUE AND NEW.role IS DISTINCT FROM OLD.role THEN
        UPDATE auth.users
        SET default_role = NEW.role
        WHERE id = NEW.user_id;
    END IF;

    -- Case 3: Update default_role to 'user' on DELETE if is_current_org was true
    IF TG_OP = 'DELETE' AND OLD.is_current_org = TRUE THEN
        UPDATE auth.users
        SET default_role = 'user'
        WHERE id = OLD.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_default_role_on_user_org_roles() IS 'This function set user''s "default_role" to "user_org_roles.role" value if is_current_org is "true"';
---
CREATE TRIGGER trg_update_default_role_on_user_org_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_org_roles
    FOR EACH ROW
EXECUTE FUNCTION update_default_role_on_user_org_roles();
COMMENT ON TRIGGER trg_update_default_role_on_user_org_roles ON public.user_org_roles IS 'This trigger updates user''s "default_role" on "user_org_roles" change';
