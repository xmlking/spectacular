CREATE TABLE public.direction
(
  value       text PRIMARY KEY,
  description text NOT NULL
);
COMMENT ON TABLE public.direction IS 'policy direction enum';
---
INSERT INTO public.direction (value, description)
VALUES ('ingress', 'INGRESS'),
       ('egress', 'EGRESS')

ON CONFLICT (value) DO NOTHING;