SET check_function_bodies = false;
INSERT INTO public.user_settings (key, value, user_id, org_id, created_by, updated_by, created_at, updated_at)
VALUES
  ('USER_NOTIFICATIONS_ENABLED', 'true', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-19 06:13:04.806093+00', '2024-12-19 06:13:04.806093+00'),
  ('USER_NOTIFICATIONS_ENABLED', 'false', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-19 06:13:04.806093+00', '2024-12-19 06:13:04.806093+00')

ON CONFLICT (key, user_id, org_id) DO NOTHING;
