CREATE OR REPLACE FUNCTION check_and_add_to_org_roles()
    RETURNS TRIGGER AS
$$
DECLARE
    allowed               BOOLEAN;
    organization_id       UUID;
    allowed_domains_regex TEXT;
    blocked_domains_regex TEXT;
BEGIN
    -- Build regex patterns for allowed and blocked email domains
    SELECT string_agg(domain, '|')
    INTO allowed_domains_regex
    FROM (SELECT unnest(allowed_email_domains) AS domain
          FROM public.organizations
          WHERE auto_enroll = TRUE -- Only consider organizations with auto_enroll = TRUE
         ) AS allowed_domains;

    SELECT string_agg(domain, '|')
    INTO blocked_domains_regex
    FROM (SELECT unnest(blocked_email_domains) AS domain
          FROM public.organizations
          WHERE auto_enroll = TRUE -- Only consider organizations with auto_enroll = TRUE
         ) AS blocked_domains;

-- Check if the user's email is allowed but not blocked
    SELECT TRUE
    INTO allowed
    FROM public.organizations
    WHERE auto_enroll = TRUE -- Only consider organizations with auto_enroll = TRUE
      AND (
        (allowed_domains_regex IS NOT NULL AND NEW.email ~* ('@(' || allowed_domains_regex || ')$'))
            OR NEW.email = ANY (allowed_emails)
        )
      AND NOT (
        (blocked_domains_regex IS NOT NULL AND NEW.email ~* ('@(' || blocked_domains_regex || ')$'))
            OR NEW.email = ANY (blocked_emails)
        )
    LIMIT 1;

-- If allowed, insert into public.user_org_roles and update auth.users
    IF allowed THEN
        -- Get the corresponding organization_id (if applicable)
        SELECT id
        INTO organization_id
        FROM public.organizations
        WHERE auto_enroll = TRUE -- Only consider organizations with auto_enroll = TRUE
          AND (
            (allowed_domains_regex IS NOT NULL AND NEW.email ~* ('@(' || allowed_domains_regex || ')$'))
                OR NEW.email = ANY (allowed_emails)
            )
        LIMIT 1;

-- Insert into public.user_org_roles
        INSERT INTO public.user_org_roles (user_id, org_id, role)
        VALUES (NEW.id, organization_id, 'org:member')
        RETURNING user_id;
        NEW.default_role := 'org:member';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE TRIGGER trg_check_and_add_to_user_org_roles
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
EXECUTE FUNCTION check_and_add_to_org_roles();
---
CREATE OR REPLACE FUNCTION add_user_org_role_for_org_owner()
    RETURNS TRIGGER AS
$$
BEGIN
    INSERT INTO public.user_org_roles (
        created_by,
        updated_by,
        user_id,
        org_id,
        role,
        is_current_org
    )
    VALUES (
        NEW.created_by,
        NEW.updated_by,
        NEW.owner_id,
        NEW.id,
        'org:owner',
        TRUE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to invoke the function after insert on public.organizations
CREATE TRIGGER trg_add_user_org_role_for_org_owner_after_organization_insert
    AFTER INSERT
    ON public.organizations
    FOR EACH ROW
EXECUTE FUNCTION add_user_org_role_for_org_owner();
