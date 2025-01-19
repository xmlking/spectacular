CREATE TABLE public.notification_status
(
  value       text PRIMARY KEY,
  description text NOT NULL
);

COMMENT ON TABLE public.notification_status IS 'user notification status enum';
---
INSERT INTO public.notification_status (value, description)
VALUES ('unread', 'UNREAD'),
       ('read', 'READ'),
       ('archived', 'ARCHIVED')
ON CONFLICT (value) DO NOTHING;
