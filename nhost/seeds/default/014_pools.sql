SET check_function_bodies = false;
INSERT INTO public.pools (id, display_name, description, tags, metadata, org_id, created_by, updated_by, created_at, updated_at, version, alternate_dns, proxy_ip)
VALUES
  ('f9b0da70-beeb-4652-abfe-05ac3a4e86c8', 'local-pool-1', 'local pool 1 description', '{foo,bar}', '{"key1": "val1"}', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '2023-08-28 18:17:41.49533+00', '2024-04-03 00:07:40.985992+00', 'v1.0.0', false, false),
  ('854f5e62-2049-4f74-a303-f98e399acf51', 'local-pool-2', 'local pool 2 description', '{foo,bar}', '{"key1": "val1"}', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '2023-08-28 18:17:41.49533+00', '2024-04-03 00:07:40.985992+00', 'v1.0.0', false, false),
  ('5b14f834-5993-47e2-a4da-99b25cf167a8', 'local-pool-3', 'local pool 3 description', '{foo,bar}', '{"key1": "val1"}', '8dfd9a31-de01-47be-92a7-ba1c720c6270', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '2023-08-28 18:17:41.49533+00', '2024-04-03 00:07:40.985992+00', 'v1.0.0', false, false)

ON CONFLICT (id) DO NOTHING;
