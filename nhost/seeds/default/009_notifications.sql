SET check_function_bodies = false;
INSERT INTO public.notifications (id, display_name, description, tags, metadata, created_by, updated_by, created_at, updated_at, org_id, title, message, type)
VALUES
  ('1a630add-db04-425a-815e-bf9bf8122eee', 'upcoming_payments', 'upcoming payments', '{payment}', '{"priority": "high"}', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2025-01-19 22:50:54.467739+00', '2025-01-19 22:50:54.467739+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270', 'upcoming payments', 'you payment due: ', 'info'),
  ('41aaef91-492f-4247-86e0-a463e6aa1878', 'upcoming_payments', 'upcoming payments', '{payment}', '{"priority": "high"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2025-01-19 22:51:53.401694+00', '2025-01-19 22:51:53.401694+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'upcoming payments', 'you payment due for org 2', 'info'),
  ('98b3326d-20f6-4ec2-89c9-418b81176366', 'certs_expiring', 'certs expiring', '{certs}', '{"priority": "high"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2025-01-19 22:52:51.370365+00', '2025-01-19 22:52:51.370365+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'certs expiring', 'you certs are  expiring', 'warning')

ON CONFLICT (id) DO NOTHING;
