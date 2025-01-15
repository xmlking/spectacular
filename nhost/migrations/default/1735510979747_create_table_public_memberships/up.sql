CREATE TABLE public.memberships
(
  user_id    uuid        NOT NULL,
  org_id     uuid        NOT NULL,
  role       text        NOT NULL,
  created_by uuid        NOT NULL,
  updated_by uuid        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, org_id),
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (role) REFERENCES auth.roles (role) ON UPDATE CASCADE ON DELETE RESTRICT
);
COMMENT ON TABLE public.memberships IS 'Table containing user''s org and org''s default_role';
---
CREATE TRIGGER set_public_memberships_updated_at
  BEFORE UPDATE
  ON public.memberships
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_memberships_updated_at ON public.memberships IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER log_deleted_record_when_public_memberships_deleted
  AFTER DELETE
  ON public.memberships
  FOR EACH ROW
EXECUTE FUNCTION public.log_deleted_record('user_id', 'org_id');
COMMENT ON TRIGGER log_deleted_record_when_public_memberships_deleted ON public.memberships IS 'trigger to save deleted records for audit';
