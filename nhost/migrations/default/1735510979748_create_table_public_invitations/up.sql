-- HINT: CREATE DOMAIN auth.email AS public.citext CHECK (value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
CREATE TABLE public.invitations
(
  email      auth.email  NOT NULL,
  org_id     uuid        NOT NULL,
  role       text        NOT NULL,
  created_by uuid        NOT NULL,
  updated_by uuid        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email, org_id),
  FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (role) REFERENCES auth.roles (role) ON UPDATE CASCADE ON DELETE RESTRICT
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
CREATE OR REPLACE FUNCTION handle_invitations_insert()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Check if the email exists in the auth.users table
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = NEW.email) THEN
    -- Get the user ID associated with the email
    INSERT INTO public.memberships (user_id, org_id, role, created_by, updated_by)
    SELECT id, NEW.org_id, NEW.role, NEW.created_by, NEW.updated_by
    FROM auth.users
    WHERE email = NEW.email;

    -- Skip inserting into the public.invitations table
    RETURN NULL;
  ELSE
    -- Email doesn't exist in auth.users, allow insertion into public.invitations
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION handle_invitations_insert () IS 'This function enroll membership if invite found in users table';
---
CREATE TRIGGER trg_handle_invitations_insert
  BEFORE INSERT
  ON public.invitations
  FOR EACH ROW
EXECUTE FUNCTION handle_invitations_insert();
COMMENT ON TRIGGER trg_handle_invitations_insert ON public.invitations IS 'This trigger enroll membership if invite found in users table';
---
