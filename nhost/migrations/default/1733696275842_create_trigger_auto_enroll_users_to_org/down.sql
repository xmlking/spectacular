DROP TRIGGER IF EXISTS trg_check_and_add_to_user_org_roles ON auth.users;
DROP FUNCTION IF EXISTS check_and_add_to_org_roles();
DROP TRIGGER IF EXISTS trg_add_user_org_role_for_org_owner_after_organization_insert  ON public.organizations;
DROP FUNCTION IF EXISTS add_user_org_role_for_org_owner()