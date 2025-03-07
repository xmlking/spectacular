-- HINT: CREATE DOMAIN auth.email AS public.citext CHECK (value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
CREATE TABLE public.invitations
(
  email      auth.email  NOT NULL,
  org_id     uuid        NOT NULL,
  role       text        NOT NULL,
  status     text        NOT NULL DEFAULT 'pending'::text, -- Status: pending, accepted, declined
  created_by uuid        NOT NULL,
  updated_by uuid        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email, org_id),
  FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (role) REFERENCES auth.roles (role) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (status) REFERENCES public.status (value) ON UPDATE RESTRICT ON DELETE RESTRICT
);
COMMENT ON TABLE public.invitations IS 'Table containing invitations for non-org members to join an org.';
---
CREATE TRIGGER set_public_invitations_updated_at
  BEFORE UPDATE
  ON public.invitations
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_invitations_updated_at ON public.invitations IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER log_deleted_record_when_public_invitations_deleted
  AFTER DELETE
  ON public.invitations
  FOR EACH ROW
EXECUTE FUNCTION public.log_deleted_record(email, org_id);
COMMENT ON TRIGGER log_deleted_record_when_public_invitations_deleted ON public.invitations IS 'trigger to save deleted records for audit';
---
CREATE OR REPLACE FUNCTION public.inviter_org_name(invitation_row public.invitations) RETURNS TEXT AS
$$
SELECT display_name
FROM public.organizations
WHERE id = invitation_row.org_id
$$ LANGUAGE sql STABLE;
COMMENT ON FUNCTION public.inviter_org_name(invitation_row public.invitations) IS 'Used as Computed Field on Invitations Table';
---
CREATE OR REPLACE FUNCTION public.inviter_name(invitation_row public.invitations) RETURNS TEXT AS
$$
SELECT display_name
FROM auth.users
WHERE id = invitation_row.created_by
$$ LANGUAGE sql STABLE;
COMMENT ON FUNCTION public.inviter_name(invitation_row public.invitations) IS 'Used as Computed Field on Invitations Table';
---
CREATE OR REPLACE FUNCTION handle_invitation_status_change()
  RETURNS TRIGGER AS
$$
DECLARE
  v_user_id UUID;
BEGIN
  -- If status changed from 'pending' to 'accepted'
  IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN

    -- Check if user exists and get the user_id
    SELECT id INTO v_user_id FROM auth.users WHERE email = NEW.email;

    -- If user exists, insert into memberships
    IF v_user_id IS NOT NULL THEN
      INSERT INTO public.memberships (user_id, org_id, role, created_by, updated_by)
      VALUES (v_user_id, NEW.org_id, NEW.role, NEW.created_by, NEW.updated_by)
      ON CONFLICT (user_id, org_id) DO NOTHING; -- Prevent duplicate entries
    END IF;

    -- Delete the invitation after successful processing
    DELETE FROM public.invitations WHERE email = NEW.email AND org_id = NEW.org_id;

  -- If status changed from 'pending' to 'declined', just delete the invitation
  ELSIF OLD.status = 'pending' AND NEW.status = 'declined' THEN
    DELETE FROM public.invitations WHERE email = NEW.email AND org_id = NEW.org_id;
  END IF;

  RETURN NEW;
END
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION handle_invitation_status_change () IS 'This function let invites to accept or decline the invitation and auto convert invitations to memberships';
---
CREATE TRIGGER trg_on_invitation_status_change
  AFTER UPDATE
  ON public.invitations
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND (NEW.status = 'accepted' OR NEW.status = 'declined'))
EXECUTE FUNCTION handle_invitation_status_change();
COMMENT ON TRIGGER trg_on_invitation_status_change ON public.invitations IS 'This trigger let invites to accept or decline the invitation and auto convert invitations to memberships';
---
