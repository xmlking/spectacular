SET rules.soft_deletion TO off;
--
DELETE FROM public.policies;
--
DELETE FROM public.rules;
--
DELETE FROM device_pool;
--
DELETE FROM public.pools;
--
DELETE FROM public.devices;
--
DELETE FROM public.direction;
--
DELETE FROM public.action;
--
DELETE FROM public.subject_type;
--
DELETE FROM public.protocol;
--
DELETE FROM public.organization;
