CREATE TABLE public.action
(
    value       text PRIMARY KEY,
    description text NOT NULL
);
COMMENT ON TABLE public.action IS 'policy action enum';
---
INSERT INTO public.action (value, description) VALUES ('callout_terminating', 'CALLOUT_TERMINATING')  ON CONFLICT (value) DO NOTHING;
INSERT INTO public.action (value, description) VALUES ('callout_inspection', 'CALLOUT_INSPECTION')  ON CONFLICT (value) DO NOTHING;
INSERT INTO public.action (value, description) VALUES ('callout_unknown', 'CALLOUT_UNKNOWN')  ON CONFLICT (value) DO NOTHING;
INSERT INTO public.action (value, description) VALUES ('block', 'BLOCK')  ON CONFLICT (value) DO NOTHING;
INSERT INTO public.action (value, description) VALUES ('permit', 'PERMIT')  ON CONFLICT (value) DO NOTHING;
