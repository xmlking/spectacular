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
-- let invites to accept or reject the invitation and auto convert invitations to memberships
CREATE OR REPLACE FUNCTION handle_invitation_acceptance()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Only proceed if status is changing from 'pending' to 'accepted'
  IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN

    -- Insert only if a user with the given email exists
    INSERT INTO public.memberships (user_id, org_id, role, created_by, updated_by)
    SELECT u.id, NEW.org_id, NEW.role, NEW.created_by, NEW.updated_by
    FROM auth.users u
    WHERE u.email = NEW.email
    ON CONFLICT (user_id, org_id) DO NOTHING; -- Prevent duplicate entries
  END IF;

  RETURN NEW;
END
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION handle_invitation_acceptance () IS 'This function enroll membership if invite accepts the invitation';
---
CREATE TRIGGER trg_on_invitation_acceptance
  AFTER UPDATE
  ON public.invitations
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status = 'accepted')
EXECUTE FUNCTION handle_invitation_acceptance();
COMMENT ON TRIGGER trg_on_invitation_acceptance ON public.invitations IS 'This trigger enroll membership if invite accepts the invitation';
---
