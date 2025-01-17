CREATE TABLE public.settings
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
COMMENT ON TABLE public.settings IS 'Table containing organization''s settings and feature flags';
---
CREATE TRIGGER set_public_settings_updated_at
  BEFORE UPDATE
  ON public.settings
  FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_settings_updated_at ON public.settings IS 'trigger to set value of column updated_at to current timestamp on row update';
---
CREATE TRIGGER log_deleted_record_when_public_settings_deleted
  AFTER DELETE
  ON public.settings
  FOR EACH ROW
EXECUTE FUNCTION public.log_deleted_record('key', 'org_id');
COMMENT ON TRIGGER log_deleted_record_when_public_settings_deleted ON public.settings IS 'trigger to save deleted records for audit';
---
CREATE OR REPLACE VIEW public.settings_with_defaults AS
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
     public.settings s
     ON
       sm.key = s.key AND org.id = s.org_id;
COMMENT ON VIEW public.settings_with_defaults IS 'View that expand public.setting table with missing key/values from public.settings_metadata';
---
/*
-- Optional: Enforcing allowed_values Validation with a Trigger
-- If you want to enforce that the `value` in the `public.settings` table matches the `allowed_values` in the `public.settings_metadata` table, you can create a trigger.
CREATE OR REPLACE FUNCTION validate_setting_value()
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

CREATE TRIGGER trg_validate_setting_value
 BEFORE INSERT OR UPDATE ON public.settings
 FOR EACH ROW
EXECUTE FUNCTION validate_setting_value();
*/;
