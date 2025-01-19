CREATE TABLE public.org_settings
(
  key        text        NOT NULL,
  value      JSONB       NOT NULL,
  org_id     uuid        NOT NULL,
  created_by uuid        NOT NULL,
  updated_by uuid        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (key, org_id),
  FOREIGN KEY (key) REFERENCES public.settings_metadata (key) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (org_id) REFERENCES public.organizations (id) ON UPDATE RESTRICT ON DELETE CASCADE
);
COMMENT ON TABLE public.org_settings IS 'Table containing organization''s settings and feature flags';
---
CREATE TRIGGER set_public_org_settings_updated_at
  BEFORE UPDATE
  ON public.org_settings
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_org_settings_updated_at ON public.org_settings IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER log_deleted_record_when_public_org_settings_deleted
  AFTER DELETE
  ON public.org_settings
  FOR EACH ROW
EXECUTE FUNCTION public.log_deleted_record('key', 'org_id');
COMMENT ON TRIGGER log_deleted_record_when_public_org_settings_deleted ON public.org_settings IS 'trigger to save deleted records for audit';
---
CREATE OR REPLACE VIEW public.org_settings_with_defaults AS
SELECT sm.key                              AS key,
       COALESCE(s.value, sm.default_value) AS value,
       org.id                              AS org_id,
       s.created_by,
       s.updated_by,
       s.created_at,
       s.updated_at
FROM public.settings_metadata sm
       CROSS JOIN
     public.organizations org
       LEFT JOIN
     public.org_settings s
     ON
       sm.key = s.key AND org.id = s.org_id
WHERE sm.type = 'org';

COMMENT ON VIEW public.org_settings_with_defaults IS 'View that expand public.org_setting table with missing key/values from public.settings_metadata';
---
-- To enforce that the `key` in the `public.org_settings` table matches the `type=org` in the `public.settings_metadata` table, you can create a trigger.
CREATE OR REPLACE FUNCTION validate_org_settings_key()
  RETURNS TRIGGER AS
$$
BEGIN
  -- Ensure the key exists in settings_metadata with type 'org'
  IF NOT EXISTS (SELECT 1
                 FROM public.settings_metadata
                 WHERE key = NEW.key
                   AND type = 'org') THEN
    RAISE EXCEPTION 'Invalid key "%", only keys of type "org" are allowed in org_settings.', NEW.key;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMENT ON FUNCTION validate_org_settings_key() IS 'This function enforce that the ''key'' in the ''public.org_settings'' table matches the ''type=org'' in the ''public.settings_metadata'' table';
---
CREATE TRIGGER trg_validate_org_settings_key
  BEFORE INSERT OR UPDATE
  ON public.org_settings
  FOR EACH ROW
EXECUTE FUNCTION validate_org_settings_key();
COMMENT ON TRIGGER trg_validate_org_settings_key ON public.org_settings IS 'This trigger enforce that the ''key'' in the ''public.org_settings'' table matches the ''type=org'' in the ''public.settings_metadata'' table';
---
/*
-- Optional: Enforcing allowed_values Validation with a Trigger
-- To enforce that the `value` in the `public.org_settings` table matches the `allowed_values` in the `public.settings_metadata` table, you can create a trigger.
CREATE OR REPLACE FUNCTION validate_org_settings_value()
 RETURNS TRIGGER AS $$
BEGIN
 -- Check if the value is allowed
 IF NOT (
   (SELECT allowed_values FROM public.settings_metadata WHERE key = NEW.key)::jsonb @> NEW.value
   ) THEN
   RAISE EXCEPTION 'Value % is not allowed for setting %', NEW.value, NEW.key;
 END IF;

 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_org_settings_value
 BEFORE INSERT OR UPDATE ON public.org_settings
 FOR EACH ROW
EXECUTE FUNCTION validate_org_settings_value();
*/;
