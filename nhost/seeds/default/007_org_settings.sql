SET check_function_bodies = false;
INSERT INTO public.org_settings (key, value, org_id, created_by, updated_by, created_at, updated_at)
VALUES
  ('THEME_COLOR', '"light"', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-19 06:13:04.806093+00', '2024-12-19 06:13:04.806093+00'),
  ('FEATURE_SHOW_SOCIAL_LOGIN', 'false', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-19 06:14:14.90919+00', '2024-12-19 06:29:26.199716+00'),
  ('FEATURE_SIMULATE_LOADING_STATE', 'true', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-19 06:14:29.227718+00', '2024-12-19 06:29:46.139623+00'),
  ('ITEMS_PER_PAGE', '15', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-19 06:15:09.843899+00', '2024-12-19 06:30:16.749885+00'),
  ('ITEMS_PER_PAGE', '15', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2024-12-19 06:15:39.55309+00', '2024-12-19 06:30:25.468719+00'),
  ('THEME_COLOR', '"dark"', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2024-12-19 06:16:06.949734+00', '2024-12-19 06:30:50.69442+00')

ON CONFLICT (key, org_id) DO NOTHING;
