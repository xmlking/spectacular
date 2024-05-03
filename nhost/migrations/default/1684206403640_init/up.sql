SET check_function_bodies = false;
SET ROLE postgres;
---ALTER DATABASE postgres SET rules.soft_deletion TO on;
SET SESSION "rules.soft_deletion" = 'on';
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
-- CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;
-- CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA public;
CREATE TABLE public.devices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    display_name text NOT NULL,
    description text,
    tags text[],
    annotations public.hstore,
    organization text NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    ip text NOT NULL,
    version text
);
COMMENT ON TABLE public.devices IS 'Devices Metadata';
CREATE FUNCTION public.devices_not_in_pool(poolid uuid) RETURNS SETOF public.devices
    LANGUAGE sql STABLE
    AS $$
SELECT *
FROM devices
WHERE id NOT IN (SELECT device_id FROM public.device_pool WHERE pool_id = poolid)
	$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
_new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
RETURN _new;
END;
$$;
CREATE TABLE public.action (
    value text NOT NULL,
    description text NOT NULL
);
COMMENT ON TABLE public.action IS 'action enum';
CREATE TABLE public.device_pool (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    pool_id uuid NOT NULL,
    device_id uuid NOT NULL
);
COMMENT ON TABLE public.device_pool IS 'device to pool bridge table ';
CREATE TABLE public.direction (
    value text NOT NULL,
    description text NOT NULL
);
COMMENT ON TABLE public.direction IS 'direction enum';
CREATE TABLE public.organizations (
    organization text NOT NULL,
    description text NOT NULL,
    allowed_email_domains text[],
    allowed_emails text[]
);
COMMENT ON TABLE public.organizations IS 'organization enums';
CREATE TABLE public.policies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    organization text NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    active boolean DEFAULT true NOT NULL,
    valid_from timestamp with time zone DEFAULT now() NOT NULL,
    valid_to timestamp with time zone,
    weight smallint DEFAULT 1000 NOT NULL,
    subject_id uuid NOT NULL,
    subject_secondary_id text NOT NULL,
    subject_display_name text NOT NULL,
    subject_type text NOT NULL,
    rule_id uuid NOT NULL
);
COMMENT ON TABLE public.policies IS 'Joint table associating subjects polymorphically with rules';
CREATE TABLE public.pools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    display_name text NOT NULL,
    description text,
    tags text[],
    annotations public.hstore,
    organization text NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);
COMMENT ON TABLE public.pools IS 'Device pools';
CREATE TABLE public.protocol (
    value text NOT NULL,
    description text NOT NULL
);
COMMENT ON TABLE public.protocol IS 'network protocol enum';
CREATE TABLE public.rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    display_name text NOT NULL,
    description text,
    tags text[],
    annotations public.hstore,
    organization text NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shared boolean DEFAULT false NOT NULL,
    source text,
    source_port text,
    destination text,
    destination_port text,
    protocol text DEFAULT 'Any'::text NOT NULL,
    action text DEFAULT 'permit'::text NOT NULL,
    direction text DEFAULT 'egress'::text NOT NULL,
    app_id text,
    throttle_rate text,
    weight smallint DEFAULT 1000 NOT NULL
);
COMMENT ON TABLE public.rules IS '5-tuple firewalls rules';
CREATE TABLE public.subject_type (
    value text NOT NULL,
    description text NOT NULL
);
COMMENT ON TABLE public.subject_type IS 'subject enum';
CREATE TABLE public.user_org_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    organization text NOT NULL
);
COMMENT ON TABLE public.user_org_roles IS 'Roles of User for a given Org.';
ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.device_pool
    ADD CONSTRAINT device_pool_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.device_pool
    ADD CONSTRAINT device_pool_pool_id_device_id_key UNIQUE (pool_id, device_id);
ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_display_name_organization_key UNIQUE (display_name, organization);
ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.direction
    ADD CONSTRAINT direction_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organization_pkey PRIMARY KEY (organization);
ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.protocol
    ADD CONSTRAINT protocol_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.subject_type
    ADD CONSTRAINT subject_type_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.user_org_roles
    ADD CONSTRAINT user_org_roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_org_roles
    ADD CONSTRAINT user_org_roles_user_id_role_organization_key UNIQUE (user_id, role, organization);
CREATE UNIQUE INDEX policies_subject_id_subject_type_rule_id_organization_unique ON public.policies USING btree (subject_id, subject_type, rule_id, organization) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX pools_display_name_organization_unique ON public.pools USING btree (display_name, organization) WHERE (deleted_at IS NULL);
CREATE UNIQUE INDEX rules_display_name_organization_unique ON public.rules USING btree (display_name, organization) WHERE (deleted_at IS NULL);
CREATE RULE devices_soft_deletion_rule AS
    ON DELETE TO public.devices
   WHERE (current_setting('rules.soft_deletion'::text) = 'on'::text) DO INSTEAD  UPDATE public.devices SET deleted_at = now()
  WHERE (devices.id = old.id);
COMMENT ON RULE devices_soft_deletion_rule ON public.devices IS 'Make soft instead of hard deletion';
CREATE RULE policies_soft_deletion_rule AS
    ON DELETE TO public.policies
   WHERE (current_setting('rules.soft_deletion'::text) = 'on'::text) DO INSTEAD  UPDATE public.policies SET deleted_at = now()
  WHERE (policies.id = old.id);
COMMENT ON RULE policies_soft_deletion_rule ON public.policies IS 'Make soft instead of hard deletion';
CREATE RULE pools_soft_deletion_rule AS
    ON DELETE TO public.pools
   WHERE (current_setting('rules.soft_deletion'::text) = 'on'::text) DO INSTEAD  UPDATE public.pools SET deleted_at = now()
  WHERE (pools.id = old.id);
COMMENT ON RULE pools_soft_deletion_rule ON public.pools IS 'Make soft instead of hard deletion';
CREATE RULE rules_soft_deletion_rule AS
    ON DELETE TO public.rules
   WHERE (current_setting('rules.soft_deletion'::text) = 'on'::text) DO INSTEAD  UPDATE public.rules SET deleted_at = now()
  WHERE (rules.id = old.id);
COMMENT ON RULE rules_soft_deletion_rule ON public.rules IS 'Make soft instead of hard deletion';
CREATE TRIGGER set_public_device_pool_updated_at BEFORE UPDATE ON public.device_pool FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_device_pool_updated_at ON public.device_pool IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_devices_updated_at ON public.devices IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_policies_updated_at ON public.policies IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_pools_updated_at BEFORE UPDATE ON public.pools FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_pools_updated_at ON public.pools IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_rules_updated_at BEFORE UPDATE ON public.rules FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_rules_updated_at ON public.rules IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.device_pool
    ADD CONSTRAINT device_pool_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.device_pool
    ADD CONSTRAINT device_pool_pool_id_fkey FOREIGN KEY (pool_id) REFERENCES public.pools(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_organization_fkey FOREIGN KEY (organization) REFERENCES public.organizations(organization);
ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_organization_fkey FOREIGN KEY (organization) REFERENCES public.organizations(organization) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.rules(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_subject_type_fkey FOREIGN KEY (subject_type) REFERENCES public.subject_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_organization_fkey FOREIGN KEY (organization) REFERENCES public.organizations(organization);
ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_action_fkey FOREIGN KEY (action) REFERENCES public.action(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_direction_fkey FOREIGN KEY (direction) REFERENCES public.direction(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_organization_fkey FOREIGN KEY (organization) REFERENCES public.organizations(organization) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.rules
    ADD CONSTRAINT rules_protocol_fkey FOREIGN KEY (protocol) REFERENCES public.protocol(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_org_roles
    ADD CONSTRAINT user_org_roles_organization_fkey FOREIGN KEY (organization) REFERENCES public.organizations(organization) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_org_roles
    ADD CONSTRAINT user_org_roles_role_fkey FOREIGN KEY (role) REFERENCES auth.roles(role) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_org_roles
    ADD CONSTRAINT user_org_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
