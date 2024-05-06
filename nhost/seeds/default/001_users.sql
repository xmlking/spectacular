SET check_function_bodies = false;

INSERT INTO auth.roles (role) VALUES ('manager');
INSERT INTO auth.roles (role) VALUES ('supervisor');

INSERT INTO auth.users (id, created_at, updated_at, last_seen, disabled, display_name, avatar_url, locale, email, phone_number, password_hash, email_verified, phone_number_verified, new_email, otp_method_last_used, otp_hash, otp_hash_expires_at, default_role, is_anonymous, totp_secret, active_mfa_type, ticket, ticket_expires_at, metadata, webauthn_current_challenge) VALUES ('076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '2024-04-06 22:25:09.676552+00', '2024-04-06 22:48:21.002518+00', '2024-04-06 22:48:20.999+00', false, 'sumo demo', 'https://www.gravatar.com/avatar/74a8c22043d4dfc24342e8e30f39ab70?d=mp&r=g', 'en', 'sumo@demo.com', NULL, '$2a$10$5P/IQv/OmBK4cp9TPT6fPOFyAmqk6mH3jE4OoALvjf5n.T95ym2GC', false, false, NULL, NULL, NULL, '2024-04-06 22:25:09.676552+00', 'user', false, NULL, NULL, NULL, '2024-04-06 22:25:09.675852+00', '{"default_org": "chinthagunta", "plan": "free"}', NULL);

INSERT INTO auth.user_roles (id, created_at, user_id, role) VALUES ('125a7851-d941-44f6-b5e2-35dfb8432123', '2024-04-06 22:25:09.676552+00', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', 'me');
INSERT INTO auth.user_roles (id, created_at, user_id, role) VALUES ('7c66978f-2758-4049-8b5f-10d8c9b5365b', '2024-04-06 22:25:09.676552+00', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', 'user');
INSERT INTO auth.user_roles (id, created_at, user_id, role) VALUES ('fc3272d4-9455-45d7-a054-3b5e876bc5e1', '2024-04-06 22:25:09.676552+00', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', 'manager');

INSERT INTO public.user_org_roles (id, created_at, created_by, user_id, role, organization) VALUES ('48c460e5-af5b-450d-9fb2-84a2dfbf3c17', '2023-05-21 22:28:18.535229+00', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', 'me', 'example');
INSERT INTO public.user_org_roles (id, created_at, created_by, user_id, role, organization) VALUES ('a9e93add-0d95-41c6-bfd7-400576cae85e', '2023-05-21 22:28:18.535229+00', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', 'user', 'example');
INSERT INTO public.user_org_roles (id, created_at, created_by, user_id, role, organization) VALUES ('52b10e5f-77fb-4718-ac7e-a6960553dc50', '2023-05-21 22:28:18.535229+00', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3', 'supervisor', 'example');
