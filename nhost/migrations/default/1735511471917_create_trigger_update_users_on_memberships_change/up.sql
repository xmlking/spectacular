--  trigger to update users default_role and default_org on memberships changes
CREATE OR REPLACE FUNCTION update_users_default_role_default_org_on_memberships_change()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Case 1: Update users default_role and default_org on new membership added when user's current org is unset.
  IF TG_OP = 'INSERT' THEN
    UPDATE auth.users
    SET default_role = NEW.role,
        default_org  = NEW.org_id
    WHERE id = NEW.user_id
      AND (default_org IS NULL OR default_org = uuid_nil());
  END IF;

  -- Case 2: Update users default_role when membership role changed, and it is user's current org
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    UPDATE auth.users
    SET default_role = NEW.role
    WHERE id = NEW.user_id
      AND default_org = NEW.org_id;
  END IF;

  -- Case 3: Update users default_role and default_org when membership deleted, and it is user's current org
  IF TG_OP = 'DELETE' THEN
    UPDATE auth.users
    SET default_role = 'user',
        default_org  = NULL
    WHERE id = OLD.user_id
      AND default_org = OLD.org_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION update_users_default_role_default_org_on_memberships_change() IS 'This function update users default_role and default_org on membership changes';
---
CREATE TRIGGER trg_update_users_default_role_default_org_on_memberships_change
  AFTER INSERT OR UPDATE OR DELETE
  ON public.memberships
  FOR EACH ROW
EXECUTE FUNCTION update_users_default_role_default_org_on_memberships_change();
COMMENT ON TRIGGER trg_update_users_default_role_default_org_on_memberships_change ON public.memberships IS 'This trigger update users default_role and default_org on membership changes';
