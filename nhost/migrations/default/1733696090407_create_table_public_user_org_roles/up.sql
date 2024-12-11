CREATE TABLE public.user_org_roles
(
    created_by     uuid        NOT NULL,
    updated_by     uuid        NOT NULL,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    user_id        uuid        NOT NULL,
    org_id         uuid        NOT NULL,
    role           text        NOT NULL,
    is_current_org boolean     NOT NULL DEFAULT false,
    PRIMARY KEY (user_id, org_id),
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (role) REFERENCES auth.roles (role) ON UPDATE cascade ON DELETE restrict
);
COMMENT ON TABLE public.user_org_roles IS 'Table containing user''s org and default_role';
---
-- Add a partial unique index to enforce conditional uniqueness
CREATE UNIQUE INDEX user_org_roles_unique_current_org
    ON public.user_org_roles (user_id)
    WHERE is_current_org = true;
---
CREATE TRIGGER set_public_user_org_roles_updated_at
    BEFORE UPDATE
    ON public.user_org_roles
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_org_roles_updated_at ON public.user_org_roles IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER insert_deleted_record_when_public_user_org_roles_deleted
    AFTER DELETE
    ON public.user_org_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.deleted_record_insert();
COMMENT ON TRIGGER insert_deleted_record_when_public_user_org_roles_deleted ON public.user_org_roles IS 'trigger to save deleted records for audit';
