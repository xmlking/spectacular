CREATE TABLE public.organizations
(
  id                    uuid        NOT NULL DEFAULT gen_random_uuid(),
  display_name          text        NOT NULL,
  description           text,
  tags                  text[],
  metadata              jsonb,
  created_by            uuid        NOT NULL,
  updated_by            uuid        NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  owner_id              uuid        NOT NULL,
  allowed_email_domains text[],
  allowed_emails        text[],
  blocked_email_domains text[],
  blocked_emails        text[],
  auto_enroll           boolean     NOT NULL DEFAULT false,
  avatar_url            text,
  PRIMARY KEY (id),
  UNIQUE (owner_id, display_name),
  FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE CASCADE
);
COMMENT ON TABLE public.organizations IS 'Table containing organizations owned by users. Auto-enroll members based on email domain';
---
CREATE TRIGGER set_public_organizations_updated_at
  BEFORE UPDATE
  ON public.organizations
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_organizations_updated_at ON public.organizations IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER log_deleted_record_when_public_organizations_deleted
  AFTER DELETE
  ON public.organizations
  FOR EACH ROW
EXECUTE FUNCTION public.log_deleted_record();
COMMENT ON TRIGGER log_deleted_record_when_public_organizations_deleted ON public.organizations IS 'trigger to save deleted records for audit';
---
SET ROLE postgres;
-- Add auth.users FK to org id.  `ON DELETE SET NULL` ???
ALTER TABLE auth.users
  ADD CONSTRAINT fk_auth_users_default_org FOREIGN KEY (default_org) REFERENCES public.organizations (id) ON UPDATE RESTRICT ON DELETE NO ACTION;
