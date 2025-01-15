SET ROLE postgres;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
-- CREATE EXTENSION IF NOT EXISTS vectorscale WITH SCHEMA public CASCADE;
-- CREATE EXTENSION IF NOT EXISTS ai WITH SCHEMA public CASCADE;

---
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
  LANGUAGE plpgsql AS
$$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
COMMENT ON FUNCTION public.set_current_timestamp_updated_at IS 'set current timestamp for updated_at column';

---
-- Docs:  https://brandur.org/fragments/deleted-record-insert
CREATE TABLE public.deleted_records
(
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT  NOT NULL,
  keys       jsonb NOT NULL,
  data       jsonb,
  deleted_at timestamptz      DEFAULT now()
);

COMMENT ON
  TABLE public.deleted_records IS 'Table containing all deleted records';

CREATE OR REPLACE FUNCTION public.log_deleted_record()
  RETURNS TRIGGER AS
$$
DECLARE
  pk_columns  TEXT[]; -- Array of primary key column names passed via TG_ARGV
  pk_values   JSONB; -- JSONB object to hold primary key values
  column_name TEXT; -- Placeholder for individual column name
BEGIN
  -- Get the primary key columns from TG_ARGV
  pk_columns := TG_ARGV;

  -- Check if TG_ARGV is empty; if so, fallback to 'id'
  IF array_length(pk_columns, 1) IS NULL THEN
    -- Fallback to 'id'
    pk_columns := ARRAY ['id'];
  END IF;

  -- Build a JSON object of primary key values dynamically
  pk_values := jsonb_build_object();
  FOREACH column_name IN ARRAY pk_columns
    LOOP
      BEGIN
        -- Dynamically get the value of the column from the OLD record
        pk_values := pk_values || jsonb_build_object(column_name, (row_to_json(OLD) ->> column_name));
      EXCEPTION
        WHEN OTHERS THEN
          -- If the column does not exist, raise a NOTICE and skip it
          RAISE NOTICE 'Column "%" not found in Table "%".', column_name, TG_TABLE_NAME;
      END;
    END LOOP;

  -- Insert the audit log entry into the deleted_records table
  INSERT INTO deleted_records (table_name, keys, data, deleted_at)
  VALUES (TG_TABLE_NAME, -- Captures the name of the table
          pk_values, -- Captures the primary key values as JSON
          row_to_json(OLD), -- Captures the old row data as JSON
          now() -- Current timestamp
         );

  RETURN OLD; -- Return the OLD record
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.log_deleted_record() IS 'Function that log deleted rows for any table to deleted_records table';
