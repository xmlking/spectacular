SET ROLE postgres;
DELETE FROM auth.roles
WHERE role IN ('public', 'private', 'sys:admin', 'org:owner', 'org:admin', 'org:billing', 'org:member');

DROP INDEX IF EXISTS refresh_tokens_metadata_name_unique;
