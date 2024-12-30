SET ROLE postgres;
DROP TRIGGER IF EXISTS trg_match_email_to_org_rules_and_auto_enroll_new_users ON auth.users;
DROP FUNCTION IF EXISTS match_email_to_org_rules_and_auto_enroll_new_users();

