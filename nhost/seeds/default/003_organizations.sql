SET check_function_bodies = false;
INSERT INTO public.organizations (id, display_name, description, tags, metadata, created_by, updated_by, created_at, updated_at, owner_id, allowed_email_domains, allowed_emails, blocked_email_domains, blocked_emails, auto_enroll)
VALUES
  ('8dfd9a31-de01-47be-92a7-ba1c720c6270', 'chinthagunta', 'chinthagunta''s org', NULL, NULL, '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-02 03:23:16.413062+00', '2024-12-02 03:23:16.413062+00', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', NULL, NULL, NULL, NULL, false),
  ('d5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'species', 'species''s org', NULL, NULL, 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2024-12-02 03:24:32.486328+00', '2024-12-02 03:24:32.486328+00', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', NULL, NULL, NULL, NULL, false)

ON CONFLICT (id) DO NOTHING;
