CREATE TABLE public.status
(
  value       text PRIMARY KEY,
  description text NOT NULL
);
COMMENT ON TABLE public.status IS 'status enum';
---
INSERT INTO public.status (value, description)
VALUES ('active', 'Active'),
       ('disabled', 'Disabled'),
       ('closed', 'Closed')

ON CONFLICT (value) DO NOTHING;
