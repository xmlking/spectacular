SET ROLE postgres;
CREATE UNIQUE INDEX refresh_tokens_metadata_name_unique ON auth.refresh_tokens USING btree (((metadata ->> 'name'::text))) WHERE (metadata IS NOT NULL);