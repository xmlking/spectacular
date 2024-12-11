CREATE TABLE public.subject_type
(
    value       text PRIMARY KEY,
    description text NOT NULL
);
COMMENT ON TABLE public.subject_type IS 'policy subject type enum';
---
INSERT INTO public.subject_type (value, description) VALUES ('device', 'DEVICE') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.subject_type (value, description) VALUES ('device_pool', 'DEVICE_POOL') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.subject_type (value, description) VALUES ('user', 'USER') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.subject_type (value, description) VALUES ('group', 'GROUP') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.subject_type (value, description) VALUES ('service_account', 'SERVICE_ACCOUNT') ON CONFLICT (value) DO NOTHING;
