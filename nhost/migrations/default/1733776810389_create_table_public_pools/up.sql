CREATE TABLE public.pools
(
    id            uuid        NOT NULL DEFAULT gen_random_uuid(),
    display_name  text        NOT NULL,
    description   text,
    tags          text[],
    metadata      jsonb,
    created_by    uuid        NOT NULL,
    updated_by    uuid        NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    org_id        uuid        NOT NULL,
    version       text,
    alternate_dns boolean              DEFAULT false,
    proxy_ip      boolean              DEFAULT false,
    PRIMARY KEY (id),
    FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE restrict ON DELETE cascade,
    UNIQUE (org_id, display_name)
);
COMMENT ON TABLE public.pools IS 'Table containing device pools data';
---
CREATE TRIGGER set_public_pools_updated_at
    BEFORE UPDATE
    ON public.pools
    FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_pools_updated_at ON public.pools IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER insert_deleted_record_when_public_pools_deleted
    AFTER DELETE
    ON public.pools
    FOR EACH ROW
EXECUTE FUNCTION public.deleted_record_insert();
COMMENT ON TRIGGER insert_deleted_record_when_public_pools_deleted ON public.pools IS 'trigger to save deleted records for audit';
