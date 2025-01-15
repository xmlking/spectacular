--  trigger to update users default_role when users default_org changes
CREATE OR REPLACE FUNCTION update_users_default_role_on_users_default_org_change()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Check if the default_org column is being updated
  IF NEW.default_org IS DISTINCT FROM OLD.default_org THEN
    -- Update the default_role in auth.users based on public.memberships
    UPDATE auth.users
    SET default_role = (SELECT role
                        FROM public.memberships
                        WHERE user_id = NEW.id
                          AND org_id = NEW.default_org
                        LIMIT 1)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_users_default_role_on_users_default_org_change() IS 'This function update users default_role when users default_org changes';
---
SET ROLE postgres;
-- Trigger to invoke the function after update on public.users
CREATE TRIGGER trg_update_users_default_role_on_users_default_org_change
  AFTER UPDATE OF default_org
  ON auth.users
  FOR EACH ROW
EXECUTE FUNCTION update_users_default_role_on_users_default_org_change();

COMMENT ON TRIGGER trg_update_users_default_role_on_users_default_org_change ON auth.users IS 'This trigger update users default_role when users default_org changes';
