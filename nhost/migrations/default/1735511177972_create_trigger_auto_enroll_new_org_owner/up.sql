-- this trigger auto enroll newly created org's owners membership with role: 'org:owner'
CREATE OR REPLACE FUNCTION auto_enroll_new_org_owner()
  RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO public.memberships (user_id, org_id, role, created_by, updated_by)
  VALUES (NEW.owner_id, NEW.id, 'org:owner', NEW.created_by, NEW.updated_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_enroll_new_org_owner() IS 'This function auto enroll newly created org owners membership with role: ''org:owner''';
---
-- Trigger to invoke the function after insert on public.organizations
CREATE TRIGGER trg_auto_enroll_new_org_owner
  AFTER INSERT
  ON public.organizations
  FOR EACH ROW
EXECUTE FUNCTION auto_enroll_new_org_owner();

COMMENT ON TRIGGER trg_auto_enroll_new_org_owner ON public.organizations IS 'This trigger auto enroll newly created org owners membership with role: ''org:owner''';
