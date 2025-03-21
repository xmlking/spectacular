--- use cases : upcoming payments, availability of a product, order placement, or order shipment.
CREATE TABLE public.notifications
(
  id           uuid        NOT NULL DEFAULT gen_random_uuid(),
  display_name text        NOT NULL,
  description  text,
  tags         text[],
  metadata     jsonb,
  created_by   uuid        NOT NULL,
  updated_by   uuid        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  org_id       uuid,                                      -- if null, then it is global notification shared with all orgs
  title        text        NOT NULL,
  message      text        NOT NULL,
  type         text        NOT NULL DEFAULT 'info'::text, -- e.g., "info", "warning", "error"
  PRIMARY KEY (id),
  FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (type) REFERENCES public.notification_type (value) ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE (org_id, display_name)
);
COMMENT ON TABLE public.notifications IS 'Table to store the notifications triggered by the application';
---
CREATE TRIGGER set_public_notifications_updated_at
  BEFORE UPDATE
  ON public.notifications
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_notifications_updated_at ON public.notifications IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER log_deleted_record_when_public_notifications_deleted
  AFTER DELETE
  ON public.notifications
  FOR EACH ROW
EXECUTE FUNCTION public.log_deleted_record();
COMMENT ON TRIGGER log_deleted_record_when_public_notifications_deleted ON public.notifications IS 'trigger to save deleted records for audit';
---
SET check_function_bodies = false;
-- setup some global notifications that are shared with all organizations
INSERT INTO public.notifications (id, display_name, description, tags, metadata, created_by, updated_by, created_at, updated_at, title, message, type)
VALUES
  ('92eaf45e-5d9d-41b2-9f9e-96bbde1e6b64', 'upcoming_payments', 'upcoming payments', '{payment}', '{"priority": "high"}', '8e91bfc4-520d-4349-9888-b628a848f649', '8e91bfc4-520d-4349-9888-b628a848f649', '2025-01-19 22:50:54.467739+00', '2025-01-19 22:50:54.467739+00',  'upcoming payments', 'you payment due: ', 'info'),
  ('4759bf67-9fb7-4bb1-902d-61378c66d03b', 'certs_expiring', 'certs expiring', '{certs}', '{"priority": "high"}', '8e91bfc4-520d-4349-9888-b628a848f649', '8e91bfc4-520d-4349-9888-b628a848f649', '2025-01-19 22:52:51.370365+00', '2025-01-19 22:52:51.370365+00', 'certs expiring', 'you certs are  expiring', 'warning')

ON CONFLICT (id) DO NOTHING;
