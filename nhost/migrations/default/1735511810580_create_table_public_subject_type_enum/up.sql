CREATE TABLE public.subject_type
(
  value       text PRIMARY KEY,
  description text NOT NULL
);
COMMENT ON TABLE public.subject_type IS 'policy subject type enum';
---
INSERT INTO public.subject_type (value, description)
VALUES ('device', 'DEVICE'),
       ('device_pool', 'DEVICE_POOL'),
       ('user', 'USER'),
       ('group', 'GROUP'),
       ('service_account', 'SERVICE_ACCOUNT')

ON CONFLICT (value) DO NOTHING;
