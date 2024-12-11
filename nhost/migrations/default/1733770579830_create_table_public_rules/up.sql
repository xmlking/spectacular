CREATE TABLE public.rules
(
    id               uuid        NOT NULL DEFAULT gen_random_uuid(),
    display_name     text        NOT NULL,
    description      text,
    tags             text[],
    metadata         jsonb,
    created_by       uuid        NOT NULL,
    updated_by       uuid        NOT NULL,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),
    org_id           uuid        NOT NULL,
    shared           boolean     NOT NULL DEFAULT false,
    source           text,
    source_port      text,
    destination      text,
    destination_port text,
    protocol         text                 DEFAULT 'Any'::text NOT NULL,
    action           text                 DEFAULT 'permit'::text NOT NULL,
    direction        text                 DEFAULT 'egress'::text NOT NULL,
    app_id           text,
    throttle_rate    text,
    weight           smallint    NOT NULL DEFAULT 1000,
    PRIMARY KEY (id),
    FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (action) REFERENCES public.action(value) ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY (direction) REFERENCES public.direction(value) ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY (protocol) REFERENCES public.protocol(value) ON UPDATE restrict ON DELETE restrict,
    UNIQUE (org_id, display_name)
);
COMMENT ON TABLE public.rules IS 'Table containing shared or single-use 5-tuple firewalls rules';
---
CREATE TRIGGER set_public_rules_updated_at
    BEFORE UPDATE
    ON public.rules
    FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_rules_updated_at ON public.rules IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER insert_deleted_record_when_public_rules_deleted
    AFTER DELETE
    ON public.rules
    FOR EACH ROW
EXECUTE FUNCTION public.deleted_record_insert();
COMMENT ON TRIGGER insert_deleted_record_when_public_rules_deleted ON public.rules IS 'trigger to save deleted records for audit';

