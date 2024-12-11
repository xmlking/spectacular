CREATE TABLE public.subscriptions
(
    id                         uuid        NOT NULL DEFAULT gen_random_uuid(),
    created_by                 uuid        NOT NULL,
    updated_by                 uuid        NOT NULL,
    created_at                 timestamptz NOT NULL DEFAULT now(),
    updated_at                 timestamptz NOT NULL DEFAULT now(),
    org_id                     uuid        NOT NULL,
    status                     text        NOT NULL,
    plan                       text        NOT NULL,
    credits                    integer     NOT NULL DEFAULT 0,
    valid_until                timestamptz NOT NULL,
    stripe_subscription_id     text,
    stripe_checkout_session_id text,
    stripe_customer_id         text,
    PRIMARY KEY (id),
    FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (status) REFERENCES public.status (value) ON UPDATE restrict ON DELETE cascade,
    FOREIGN KEY (plan) REFERENCES public.plan (value) ON UPDATE restrict ON DELETE cascade,
    UNIQUE (org_id, plan)
);
COMMENT ON TABLE public.subscriptions IS 'Table containing subscriptions for an organization';
---
CREATE TRIGGER set_public_subscriptions_updated_at
    BEFORE UPDATE
    ON public.subscriptions
    FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_subscriptions_updated_at ON public.subscriptions IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER insert_deleted_record_when_public_subscriptions_deleted
    AFTER DELETE
    ON public.subscriptions
    FOR EACH ROW
EXECUTE FUNCTION public.deleted_record_insert();
COMMENT ON TRIGGER insert_deleted_record_when_public_subscriptions_deleted ON public.subscriptions IS 'trigger to save deleted records for audit';
