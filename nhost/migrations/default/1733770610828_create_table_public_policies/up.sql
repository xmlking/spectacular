CREATE TABLE public.policies
(
    id                   uuid        NOT NULL DEFAULT gen_random_uuid(),
    created_by           uuid        NOT NULL,
    updated_by           uuid        NOT NULL,
    created_at           timestamptz NOT NULL DEFAULT now(),
    updated_at           timestamptz NOT NULL DEFAULT now(),
    org_id               uuid        NOT NULL,
    rule_id              uuid        NOT NULL,
    active               boolean     NOT NULL DEFAULT true,
    valid_from           timestamptz NOT NULL DEFAULT now(),
    valid_to             timestamptz,
    weight               smallint    NOT NULL DEFAULT 1000,
    subject_id           uuid        NOT NULL,
    subject_secondary_id text        NOT NULL,
    subject_display_name text        NOT NULL,
    subject_type         text        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (rule_id) REFERENCES public.rules (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (subject_type) REFERENCES public.subject_type (value) ON UPDATE restrict ON DELETE restrict,
    UNIQUE (org_id, rule_id, subject_id, subject_type)
);
COMMENT ON TABLE public.policies IS 'Joint table associating subjects polymorphically with rules';
---
CREATE TRIGGER set_public_policies_updated_at
    BEFORE UPDATE
    ON public.policies
    FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_policies_updated_at ON public.policies IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER insert_deleted_record_when_public_policies_deleted
    AFTER DELETE
    ON public.policies
    FOR EACH ROW
EXECUTE FUNCTION public.deleted_record_insert();
COMMENT ON TRIGGER insert_deleted_record_when_public_policies_deleted ON public.policies IS 'trigger to save deleted records for audit';
