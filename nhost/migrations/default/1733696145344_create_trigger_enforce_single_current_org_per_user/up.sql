CREATE OR REPLACE FUNCTION enforce_single_current_org_per_user()
    RETURNS TRIGGER AS $$
BEGIN
    -- If the new value of is_current_org is true and it changed from false
    IF NEW.is_current_org = TRUE AND (OLD.is_current_org IS FALSE OR OLD.is_current_org IS DISTINCT FROM TRUE) THEN
        -- Set is_current_org to false for all other rows with the same user_id
        UPDATE public.user_org_roles
        SET is_current_org = false
        WHERE user_id = NEW.user_id
          AND org_id != NEW.org_id
          AND is_current_org = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION enforce_single_current_org_per_user() IS 'Function for Ensuring Only One "is_current_org" is True per "user_id"';

CREATE TRIGGER trg_enforce_single_current_org_per_user
    BEFORE INSERT OR UPDATE OF is_current_org ON public.user_org_roles
    FOR EACH ROW
EXECUTE FUNCTION enforce_single_current_org_per_user();
COMMENT ON TRIGGER trg_enforce_single_current_org_per_user ON public.user_org_roles IS 'Trigger for Enforcing Single Current Org Per User';
