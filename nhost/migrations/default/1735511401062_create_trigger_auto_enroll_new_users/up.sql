-- this trigger matches user's email to org rules and auto enroll new users with 'org:member' role.
CREATE OR REPLACE FUNCTION match_email_to_org_rules_and_auto_enroll_new_users()
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

-- If allowed, insert into public.memberships and update auth.users
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

-- Insert into public.memberships
    INSERT INTO public.memberships (user_id, org_id, role)
    VALUES (NEW.id, organization_id, 'org:member')
    RETURNING user_id;
    NEW.default_role := 'org:member';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION match_email_to_org_rules_and_auto_enroll_new_users() IS 'This function matches user''s email to org rules and auto enroll new users membership with ''org:member'' role';
---
SET ROLE postgres;
CREATE TRIGGER trg_match_email_to_org_rules_and_auto_enroll_new_users
  AFTER INSERT
  ON auth.users
  FOR EACH ROW
EXECUTE FUNCTION match_email_to_org_rules_and_auto_enroll_new_users();

COMMENT ON TRIGGER trg_match_email_to_org_rules_and_auto_enroll_new_users ON auth.users IS 'This trigger matches user''s email to org rules and auto enroll new users membership with ''org:member'' role';
---
