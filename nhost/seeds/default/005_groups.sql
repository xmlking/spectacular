SET check_function_bodies = false;
INSERT INTO public.groups (id, display_name, description, tags, metadata, created_by, updated_by, created_at, updated_at, org_id)
VALUES
  ('bd11ab92-75ac-4787-ba0d-abb718164a9b', 'intern', 'student interns', NULL, NULL, '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-08 02:14:49.967558+00', '2024-12-08 02:14:49.967558+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270'),
  ('28dc6efe-19e8-4dcc-b325-cb4cea2e6ff4', 'contractor', 'contractor', NULL, NULL, '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', '2024-12-08 02:08:52.701743+00', '2024-12-08 02:15:02.762333+00', '8dfd9a31-de01-47be-92a7-ba1c720c6270')

ON CONFLICT (id) DO NOTHING;
