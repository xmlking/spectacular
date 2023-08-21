#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_USER" <<-EOSQL
	CREATE EXTENSION IF NOT EXISTS hstore;
	-- create extension if not exists postgis;
	SELECT * FROM PG_EXTENSION;
	-- add global variable for controlling hard/soft deletion
	ALTER DATABASE postgres SET rules.soft_deletion TO on;
	-- set system congfig
	-- ALTER SYSTEM SET wal_level = logical;
	-- ALTER SYSTEM SET max_wal_senders = 5;
	-- ALTER SYSTEM SET max_replication_slots = 5;
	-- setup app database and user
    -- CREATE USER app_user WITH ENCRYPTED PASSWORD 'app_user';
    -- CREATE DATABASE myapp;
    -- GRANT ALL PRIVILEGES ON DATABASE myapp TO app_user;
    -- CREATE ROLE app_user LOGIN PASSWORD app_user;
    -- CREATE SCHEMA myapp;
    -- GRANT ALL ON ALL TABLES IN SCHEMA myapp TO app_user;
EOSQL
