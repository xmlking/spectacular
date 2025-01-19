-- Metadata for Constraints: Allows flexible definitions of permissible values for settings.
-- Dynamic Validation: Enables runtime checks (via application or triggers) to ensure values adhere to allowed options.
-- Extensibility: Can store complex rules for validation (e.g., ranges, lists, or logical conditions).
CREATE TABLE public.settings_metadata
(
  key            text PRIMARY KEY,
  description    text,
  default_value  JSONB,
  allowed_values JSONB,
  type           text DEFAULT 'org'::text NOT NULL,
  CHECK (key ~ '^[A-Z]+(_[A-Z]+)*$'), -- Allows only uppercase letters and underscores
  FOREIGN KEY (type) REFERENCES public.setting_type (value) ON UPDATE RESTRICT ON DELETE RESTRICT
);
COMMENT ON TABLE public.settings_metadata IS 'Table containing unique Setting keys and Feature Flags for Orgs and Users, act like enum';
---
INSERT INTO public.settings_metadata (key, description, default_value, allowed_values, type)
VALUES
  ('THEME_COLOR', 'Theme color for the application', '"dark"', '["dark", "light"]', 'org'),
  ('ITEMS_PER_PAGE', 'Number of items displayed per page', '10', '{"min": 1, "max": 100}', 'org'),
  ('NOTIFICATIONS_ENABLED', 'Enable Org Level Notifications', 'true', '[true, false]', 'org'),
  ('USER_NOTIFICATIONS_ENABLED', 'Opt-in User Notifications. Do-not-disturb', 'true', '[true, false]', 'user'),
  ('COMMUNICATION_PREFERENCES', 'User communication preferences', '{"email": true}', '{"email": true, "sms": true, "web": true, "push": true}', 'org'),
  ('AGENT_VERSION', 'Agent application version', '"v1.0.87"', '{"min": "v1.0.0", "max": "v3.0.0"}', 'org'),
  ('FEATURE_SHOW_MAGIC_LINK_LOGIN', 'Feature - show magic link login', 'true', '[true, false]', 'org'),
  ('FEATURE_SHOW_SOCIAL_LOGIN', 'Feature - show social login', 'true', '[true, false]', 'org'),
  ('FEATURE_SIMULATE_LOADING_STATE', 'Feature - simulate loading state', 'true', '[true, false]', 'org')

ON CONFLICT (key) DO NOTHING;
