CREATE TABLE public.plan
(
    value       text PRIMARY KEY,
    description text NOT NULL
);
COMMENT ON TABLE public.plan IS 'plan enum';
---
INSERT INTO public.plan (value, description) VALUES ('starter', 'Starter')  ON CONFLICT (value) DO NOTHING;
INSERT INTO public.plan (value, description) VALUES ('pro', 'Pro')  ON CONFLICT (value) DO NOTHING;
INSERT INTO public.plan (value, description) VALUES ('enterprise', 'Enterprise')  ON CONFLICT (value) DO NOTHING;
