CREATE TABLE public.setting_type
(
  value       text PRIMARY KEY,
  description text NOT NULL
);
COMMENT ON TABLE public.setting_type IS 'setting type enum';
---
INSERT INTO public.setting_type (value, description)
VALUES ('user', 'USER'),
       ('org', 'ORGANIZATION')
ON CONFLICT (value) DO NOTHING;
