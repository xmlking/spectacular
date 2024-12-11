CREATE OR REPLACE FUNCTION public.user_current_org(user_row auth.users)
    RETURNS uuid AS $$
DECLARE
    current_org_id uuid;
BEGIN
    -- Retrieve the org_id where is_current_org is true for the given user
    SELECT org_id
    INTO current_org_id
    FROM public.user_org_roles
    WHERE user_id = user_row.id AND is_current_org = true
    LIMIT 1;

    -- Return the retrieved org_id
    RETURN current_org_id;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION public.user_current_org(user_row auth.users) IS 'Function Used as Computed Field on Users Table';
