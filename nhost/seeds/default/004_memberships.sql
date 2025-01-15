SET check_function_bodies = false;
INSERT INTO public.memberships ( user_id, org_id, role, created_by, updated_by, created_at, updated_at)
VALUES
  ( '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '8dfd9a31-de01-47be-92a7-ba1c720c6270', 'org:owner', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f','572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-02 03:28:40.616639+00', '2024-12-02 03:28:40.616639+00'),
  ( '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'org:member', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83','bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2024-12-02 03:28:40.616639+00', '2024-12-02 03:28:40.616639+00'),
  ( 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'org:owner', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83','bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2024-12-02 03:28:40.616639+00', '2024-12-02 03:28:40.616639+00')

ON CONFLICT (user_id, org_id) DO NOTHING;
