SET ROLE postgres;
DROP TRIGGER IF EXISTS trg_update_users_default_role_on_users_default_org_change ON auth.users;
DROP FUNCTION IF EXISTS update_users_default_role_on_users_default_org_change()
