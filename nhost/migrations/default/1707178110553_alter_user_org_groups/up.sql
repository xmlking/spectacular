-- run this manuvaly after all services started for the first time. because by the time `auth.users` may not be created yet.
ALTER TABLE ONLY public.user_org_groups
    ADD CONSTRAINT user_org_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
