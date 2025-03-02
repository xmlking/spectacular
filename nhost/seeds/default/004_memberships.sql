SET check_function_bodies = false;
INSERT INTO public.memberships ( user_id, org_id, role, created_by, updated_by, created_at, updated_at)
VALUES
  ( '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', 'd5dbb6b6-5e43-4dca-b855-be9b65b6695b', 'org:member', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83','bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', '2024-12-02 03:28:40.616639+00', '2024-12-02 03:28:40.616639+00')

ON CONFLICT (user_id, org_id) DO NOTHING;

UPDATE public.memberships SET role = 'sys:admin' WHERE user_id = '8e91bfc4-520d-4349-9888-b628a848f649' AND org_id = '00000000-0000-0000-0000-000000000000';
UPDATE public.memberships SET role = 'sys:admin' WHERE user_id = '8e91bfc4-520d-4349-9888-b628a848f649' AND org_id = 'ce1f436e-6e84-4c31-8c78-44d869b27b30';
