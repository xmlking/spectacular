INSERT INTO public.direction (value, description) VALUES ('ingress', 'INGRESS');
INSERT INTO public.direction (value, description) VALUES ('egress', 'EGRESS');

INSERT INTO public.action (value, description) VALUES ('callout_terminating', 'CALLOUT_TERMINATING');
INSERT INTO public.action (value, description) VALUES ('callout_inspection', 'CALLOUT_INSPECTION');
INSERT INTO public.action (value, description) VALUES ('callout_unknown', 'CALLOUT_UNKNOWN');
INSERT INTO public.action (value, description) VALUES ('block', 'BLOCK');
INSERT INTO public.action (value, description) VALUES ('permit', 'PERMIT');

INSERT INTO public.subject_type (value, description) VALUES ('device', 'DEVICE');
INSERT INTO public.subject_type (value, description) VALUES ('device_pool', 'DEVICE_POOL');
INSERT INTO public.subject_type (value, description) VALUES ('user', 'USER');
INSERT INTO public.subject_type (value, description) VALUES ('group', 'GROUP');
INSERT INTO public.subject_type (value, description) VALUES ('service_account', 'SERVICE_ACCOUNT');

INSERT INTO public.protocol (value, description) VALUES ('Any', 'Any');
INSERT INTO public.protocol (value, description) VALUES ('IP', 'IP');
INSERT INTO public.protocol (value, description) VALUES ('ICMP', 'ICMP');
INSERT INTO public.protocol (value, description) VALUES ('IGMP', 'IGMP');
INSERT INTO public.protocol (value, description) VALUES ('TCP', 'TCP');
INSERT INTO public.protocol (value, description) VALUES ('UDP', 'UDP');
INSERT INTO public.protocol (value, description) VALUES ('IPV6', 'IPV6');
INSERT INTO public.protocol (value, description) VALUES ('ICMPV6', 'ICMPV6');
INSERT INTO public.protocol (value, description) VALUES ('RM', 'RM');

INSERT INTO public.organization (value, description) VALUES ('chinthagunta', 'chinthagunta org');
INSERT INTO public.organization (value, description) VALUES ('example', 'example org');
