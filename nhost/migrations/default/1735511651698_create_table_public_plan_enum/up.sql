CREATE TABLE public.plan
(
  value       text PRIMARY KEY,
  description text NOT NULL
);
COMMENT ON TABLE public.plan IS 'plan enum';
---
INSERT INTO public.plan (value, description)
VALUES ('starter', 'Starter'),
       ('pro', 'Pro'),
       ('enterprise', 'Enterprise')

ON CONFLICT (value) DO NOTHING;
