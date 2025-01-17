-- Metadata for Constraints: Allows flexible definitions of permissible values for settings.
-- Dynamic Validation: Enables runtime checks (via application or triggers) to ensure values adhere to allowed options.
-- Extensibility: Can store complex rules for validation (e.g., ranges, lists, or logical conditions).
CREATE TABLE public.settings_metadata
(
  key            text PRIMARY KEY,
  description    text,
  default_value  JSONB,
  allowed_values JSONB,
  CHECK (key ~ '^[A-Z]+(_[A-Z]+)*$') -- Allows only uppercase letters and underscores
);
COMMENT ON TABLE public.settings_metadata IS 'Table containing Organization unique Setting keys and Feature Flags, act like enum';
---
INSERT INTO public.settings_metadata (key, description, default_value, allowed_values)
VALUES
  ('THEME_COLOR', 'Theme color for the application', '"dark"', '["dark", "light"]'),
  ('ITEMS_PER_PAGE', 'Number of items displayed per page', '10', '{"min": 1, "max": 100}'),
  ('USER_NOTIFICATIONS', 'Enable user notifications', '{"email": true}', '{"email": true, "sms": true}'),
  ('AGENT_VERSION', 'Agent application version', '"v1.0.87"', '{"min": "v1.0.0", "max": "v3.0.0"}'),
  ('FEATURE_SHOW_MAGIC_LINK_LOGIN', 'Feature - show magic link login', 'true', '[true, false]'),
  ('FEATURE_SHOW_SOCIAL_LOGIN', 'Feature - show social login', 'true', '[true, false]'),
  ('FEATURE_SIMULATE_LOADING_STATE', 'Feature - simulate loading state', 'true', '[true, false]')

ON CONFLICT (key) DO NOTHING;
