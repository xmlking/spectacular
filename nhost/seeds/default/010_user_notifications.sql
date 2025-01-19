SET check_function_bodies = false;
INSERT INTO public.user_notifications (user_id, notification_id, metadata, status, created_at, updated_at)
VALUES
  ('572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '92eaf45e-5d9d-41b2-9f9e-96bbde1e6b64', '{"amount": 101, "priority": "high"}', 'unread', '2025-01-19 23:01:05.316547+00', '2025-01-19 23:01:05.316547+00'),
  ('bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'b06b6da5-81a9-457a-b0ab-f7a2da2b9157', '{"amount": 101, "priority": "high"}', 'unread', '2025-01-19 23:02:06.409152+00', '2025-01-19 23:02:06.409152+00'),
  ('bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '4759bf67-9fb7-4bb1-902d-61378c66d03b', '{"amount": 101, "priority": "high"}', 'unread', '2025-01-19 23:02:14.949021+00', '2025-01-19 23:02:14.949021+00')

ON CONFLICT (user_id, notification_id) DO NOTHING;
