SET check_function_bodies = false;
INSERT INTO public.notifications (id, display_name, description, tags, metadata, created_by, updated_by, created_at, updated_at, org_id, title, message, type)
VALUES
  ('92eaf45e-5d9d-41b2-9f9e-96bbde1e6b64', 'upcoming_payments', 'upcoming payments', '{payment}', '{"priority": "high"}', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2025-01-19 22:50:54.467739+00', '2025-01-19 22:50:54.467739+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270', 'upcoming payments', 'you payment due: ', 'info'),
  ('b06b6da5-81a9-457a-b0ab-f7a2da2b9157', 'upcoming_payments', 'upcoming payments', '{payment}', '{"priority": "high"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2025-01-19 22:51:53.401694+00', '2025-01-19 22:51:53.401694+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'upcoming payments', 'you payment due for org 2', 'info'),
  ('4759bf67-9fb7-4bb1-902d-61378c66d03b', 'certs_expiring', 'certs expiring', '{certs}', '{"priority": "high"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2025-01-19 22:52:51.370365+00', '2025-01-19 22:52:51.370365+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'certs expiring', 'you certs are  expiring', 'warning')

ON CONFLICT (id) DO NOTHING;
