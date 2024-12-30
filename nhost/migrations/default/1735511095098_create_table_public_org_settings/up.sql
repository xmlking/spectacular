CREATE TABLE public.org_settings
(
  key        text        NOT NULL,
  value      JSONB,
  org_id     uuid        NOT NULL,
  created_by uuid        NOT NULL,
  updated_by uuid        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (key, org_id),
  FOREIGN KEY (key) REFERENCES public.setting_keys (key) ON UPDATE CASCADE ON DELETE CASCADE,
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
CREATE FUNCTION public.org_settings_with_defaults(org_row public.organizations) RETURNS SETOF public.org_settings
  LANGUAGE sql
  STABLE AS
$$
SELECT SK.key                               as key,
       COALESCE(OS.value, SK.default_value) AS value,
       OS.org_id                            AS org_id,
       OS.created_by                        AS created_by,
       OS.updated_by                        AS updated_by,
       OS.created_at                        AS created_at,
       OS.updated_at                        AS updated_at
FROM public.setting_keys SK
       LEFT JOIN public.org_settings OS ON SK.key = OS.key AND OS.org_id = org_row.id;
$$;
COMMENT ON FUNCTION public.org_settings_with_defaults(org_row public.organizations) IS 'Used as Computed Field on Organizations Table';
---
/*
-- Optional: Enforcing allowed_values Validation with a Trigger
-- If you want to enforce that the `value` in the `public.org_settings` table matches the `allowed_values` in the `public.setting_keys` table, you can create a trigger.
CREATE OR REPLACE FUNCTION validate_setting_value()
 RETURNS TRIGGER AS $$
BEGIN
 -- Check if the value is allowed
 IF NOT (
   (SELECT allowed_values FROM public.setting_keys WHERE key = NEW.key)::jsonb @> NEW.value
   ) THEN
   RAISE EXCEPTION 'Value % is not allowed for setting %', NEW.value, NEW.key;
 END IF;

 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_setting_value
 BEFORE INSERT OR UPDATE ON public.org_settings
 FOR EACH ROW
EXECUTE FUNCTION validate_setting_value();
*/;
