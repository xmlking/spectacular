CREATE TABLE public.protocol
(
    value       text PRIMARY KEY,
    description text NOT NULL
);
COMMENT ON TABLE public.protocol IS 'policy network protocol enum';
---
INSERT INTO public.protocol (value, description) VALUES ('Any', 'Any') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('IP', 'IP') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('ICMP', 'ICMP') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('IGMP', 'IGMP') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('TCP', 'TCP') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('UDP', 'UDP') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('IPV6', 'IPV6') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('ICMPV6', 'ICMPV6') ON CONFLICT (value) DO NOTHING;
INSERT INTO public.protocol (value, description) VALUES ('RM', 'RM') ON CONFLICT (value) DO NOTHING;
