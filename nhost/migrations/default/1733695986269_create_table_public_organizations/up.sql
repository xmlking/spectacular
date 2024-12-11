CREATE TABLE public.organizations
(
    id                    uuid        NOT NULL DEFAULT gen_random_uuid(),
    display_name          text        NOT NULL,
    description           text,
    tags                  text[],
    metadata              jsonb,
    created_by            uuid        NOT NULL,
    updated_by            uuid        NOT NULL,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    owner_id              uuid        NOT NULL,
    allowed_email_domains text[],
    allowed_emails        text[],
    blocked_email_domains text[],
    blocked_emails        text[],
    auto_enroll           boolean     NOT NULL DEFAULT false,
    PRIMARY KEY (id),
    FOREIGN KEY (owner_id) REFERENCES auth.users (id) ON UPDATE restrict ON DELETE cascade
);
COMMENT ON TABLE public.organizations IS 'Table containing organizations owned by users. Auto-enroll members based on email domain';
---
CREATE TRIGGER set_public_organizations_updated_at
    BEFORE UPDATE
    ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_organizations_updated_at ON public.organizations IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER insert_deleted_record_when_public_organizations_deleted
    AFTER DELETE
    ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.deleted_record_insert();
COMMENT ON TRIGGER insert_deleted_record_when_public_organizations_deleted ON public.organizations IS 'trigger to save deleted records for audit';
