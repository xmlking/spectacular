CREATE TABLE public.notification_type
(
  value       text PRIMARY KEY,
  description text NOT NULL
);

COMMENT ON TABLE public.notification_type IS 'notification type enum';
---
INSERT INTO public.notification_type (value, description)
VALUES ('info', 'INFO'),
       ('warning', 'WARNING'),
       ('error', 'ERROR')
ON CONFLICT (value) DO NOTHING;
