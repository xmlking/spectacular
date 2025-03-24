-- Add custom app roles
INSERT INTO auth.roles (role)
VALUES ('public'),
       ('private'),
       ('sys:admin'),
       ('org:owner'),
       ('org:admin'),
       ('org:billing'),
       ('org:member')

ON CONFLICT (role) DO NOTHING;

-- Create index on refresh_tokens table metadata column
SET ROLE postgres;
CREATE UNIQUE INDEX refresh_tokens_metadata_name_user_id_unique ON auth.refresh_tokens USING btree (
    ((metadata ->> 'name'::text)),
    user_id
)
WHERE (metadata IS NOT NULL);
---
ALTER TABLE auth.users
  ADD COLUMN default_org UUID;
