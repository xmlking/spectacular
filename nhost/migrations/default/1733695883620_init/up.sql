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

--- Docs:  https://brandur.org/fragments/deleted-record-insert
CREATE TABLE public.deleted_record
(
    id         uuid PRIMARY KEY      DEFAULT gen_random_uuid(),
    data       jsonb        NOT NULL,
    deleted_at timestamptz  NOT NULL DEFAULT current_timestamp,
    object_id  uuid         NOT NULL,
    table_name varchar(200) NOT NULL,
    updated_at timestamptz  NOT NULL DEFAULT current_timestamp
);
COMMENT ON TABLE public.deleted_record IS 'Table containing all deleted records';

CREATE OR REPLACE FUNCTION public.deleted_record_insert() RETURNS trigger
    LANGUAGE plpgsql AS
$$
BEGIN
    EXECUTE 'INSERT INTO deleted_record (data, object_id, table_name) VALUES ($1, $2, $3)'
        USING to_jsonb(OLD.*), OLD.id, TG_TABLE_NAME;
    RETURN OLD;
END;
$$;
COMMENT ON FUNCTION public.deleted_record_insert() IS 'Function that copy deleted rows for any table to deleted_record table';
