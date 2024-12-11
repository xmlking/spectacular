DROP TRIGGER IF EXISTS trg_enforce_single_current_org_per_user ON public.user_org_roles;
DROP FUNCTION IF EXISTS enforce_single_current_org_per_user();
