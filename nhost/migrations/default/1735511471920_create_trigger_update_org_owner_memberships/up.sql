--  trigger to update memberships user_id when org owner changed
CREATE OR REPLACE FUNCTION update_org_owner_memberships()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Update public.memberships user_id where role is "org:owner"
  UPDATE public.memberships
  SET user_id    = NEW.owner_id,
      updated_by = NEW.updated_by,
      updated_at = now()
  WHERE org_id = NEW.id
    AND role = 'org:owner';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_org_owner_memberships() IS 'This function update memberships user_id when org owner changed';
---
SET ROLE postgres;
-- Trigger to invoke the function after update on public.organizations
CREATE TRIGGER trg_update_org_owner_memberships
  AFTER UPDATE OF owner_id
  ON public.organizations
  FOR EACH ROW
EXECUTE FUNCTION update_org_owner_memberships();

COMMENT ON TRIGGER trg_update_org_owner_memberships ON public.organizations IS 'This trigger update memberships user_id when org owner changed';
