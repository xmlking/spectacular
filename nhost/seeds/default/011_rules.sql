SET check_function_bodies = false;
INSERT INTO public.rules (id, display_name, description, tags, metadata, created_by, updated_by, created_at, updated_at, org_id, shared, source, source_port, destination, destination_port, protocol, action, direction, app_id, throttle_rate, weight)
VALUES
  ('8e65cf49-ccd3-4d75-85be-0f4256646bdb', 'block youtube', 'block youtube policy', '{tz,us}', '{"sumo": "demo"}', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2023-05-30 04:55:22.03475+00', '2023-05-30 04:55:22.03475+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270', true, '0.0.0.0', '5000', '1.1.1.1', '443', 'Any', 'block', 'egress', 'myapp.exe', '80', 600),
  ('e79ec959-26a5-4ac1-9920-36eab3e01841', 'block youtube 159', 'block youtube policy', '{tz,us}', '{"sumo": "demo"}', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2023-05-30 05:04:48.705066+00', '2023-05-30 06:21:34.515711+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270', true, '0.0.0.0', '5000', '1.1.1.1', '443', 'Any', 'block', 'egress', 'myapp.exe', '80', 670),
  ('f7f97727-8f96-4427-9a4e-b53e831e1ebf', 'block youtube 170', 'block youtube policy', '{tz,us}', '{"sumo": "demo"}', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2023-05-30 06:50:58.969585+00', '2023-05-30 06:50:58.969585+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270', true, '0.0.0.0', '5000', '1.1.1.1', '443', 'Any', 'block', 'egress', 'myapp.exe', '80', 670),
  ('edf5cd6a-9ca7-4f7b-9836-ecc656e630a0', 'block youtube 67', 'block youtube policy', '{tz,us}', '{"sumo": "demo"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2023-05-30 06:51:34.115969+00', '2023-05-30 06:52:07.86214+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', false, '0.0.0.0', '5000', '1.1.1.1', '443', 'Any', 'block', 'egress', 'myapp.exe', '80', 670),
  ('ff9cf187-6c4b-4fd5-aa6d-25c40980453e', 'block youtube 187', 'block youtube policy', '{tz,us}', '{"sumo": "demo"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2023-05-30 05:00:24.89965+00', '2023-05-30 06:54:15.969211+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', true, '0.0.0.0', '5000', '1.1.1.1', '443', 'Any', 'block', 'egress', 'myapp.exe', '80', 670),
  ('9cf25f46-f317-405a-a0a5-0e3209276dfe', 'block youtube 95', 'block youtube policy', '{tz,us}', '{"sumo": "demo"}', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2023-05-30 06:54:21.151096+00', '2023-05-30 06:54:37.609328+00', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', false, '0.0.0.0', '5000', '1.1.1.1', '443', 'Any', 'block', 'egress', 'myapp.exe', '80', 670)

ON CONFLICT (id) DO NOTHING;
