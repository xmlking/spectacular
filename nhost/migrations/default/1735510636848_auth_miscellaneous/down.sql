SET ROLE postgres;
DELETE
FROM auth.roles
WHERE role IN ('public', 'private', 'sys:admin', 'org:owner', 'org:admin', 'org:billing', 'org:member');
---
DROP INDEX IF EXISTS auth.refresh_tokens_metadata_name_user_id_unique;
---
ALTER TABLE auth.users
  DROP COLUMN IF EXISTS default_org;
