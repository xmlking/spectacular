CREATE TABLE public.action
(
  value       text PRIMARY KEY,
  description text NOT NULL
);
COMMENT ON TABLE public.action IS 'policy action enum';
---
INSERT INTO public.action (value, description)
VALUES ('callout_terminating', 'CALLOUT_TERMINATING'),
       ('callout_inspection', 'CALLOUT_INSPECTION'),
       ('callout_unknown', 'CALLOUT_UNKNOWN'),
       ('block', 'BLOCK'),
       ('permit', 'PERMIT')

ON CONFLICT (value) DO NOTHING;
