SET check_function_bodies = false;
INSERT INTO auth.user_roles (id, created_at, user_id, role)
VALUES
  ('588bbf6a-fb14-41f9-a458-e5dc9e6e3b29', '2024-12-30T06:29:11.368502+00', '8e91bfc4-520d-4349-9888-b628a848f649' , 'sys:admin'),
  ('588bbf6a-fb14-41f9-a458-e5dc9e6e3b29', '2024-12-30T06:29:11.368502+00', '8e91bfc4-520d-4349-9888-b628a848f649' , 'user'),
  ('02fb9614-c959-42af-9e65-cef7cb3a02e6', '2024-12-30T06:29:11.368502+00', '8e91bfc4-520d-4349-9888-b628a848f649' , 'me'),
  ('6cfccf75-d11d-49f7-a28f-f2d857b04638', '2024-12-02 03:17:53.317046+00', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', 'user'),
  ('87870b0c-9d70-4c0e-8203-dbfcf6f23abb', '2024-12-02 03:17:53.317046+00', '572ad1c0-f97b-4e16-b1f6-8b5ca90f931f', 'me'),
  ('2fe70998-9615-4a76-ab63-ac4b9fcb056c', '2024-12-02 03:19:49.436852+00', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'user'),
  ('18490385-ca78-4e3c-bb73-c4cbc5a39af6', '2024-12-02 03:19:49.436852+00', 'bacd19f4-0cc4-43d1-9e7a-4e5098ed8d83', 'me')

ON CONFLICT (id) DO NOTHING;
