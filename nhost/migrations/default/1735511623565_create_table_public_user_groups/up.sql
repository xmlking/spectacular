CREATE TABLE public.user_groups
(
  user_id  uuid NOT NULL,
  group_id uuid NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES auth.users (id) ON UPDATE RESTRICT ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES public.groups (id) ON UPDATE RESTRICT ON DELETE CASCADE
);
COMMENT ON TABLE public.user_groups IS 'User to Group association table';
---
CREATE OR REPLACE FUNCTION public.user_associated_groups(user_row auth.users) RETURNS SETOF public.groups
  LANGUAGE sql
  STABLE AS
$$
SELECT *
FROM groups
WHERE id IN (SELECT group_id FROM public.user_groups WHERE user_id = user_row.id)
$$;
COMMENT ON FUNCTION public.user_associated_groups(user_row auth.users) IS 'Used as Computed Field on Users Table';
---
CREATE OR REPLACE FUNCTION public.user_dissociated_groups(user_row auth.users) RETURNS SETOF public.groups
  LANGUAGE sql
  STABLE AS
$$
SELECT *
FROM groups
WHERE id NOT IN (SELECT group_id FROM public.user_groups WHERE user_id = user_row.id)
$$;
COMMENT ON FUNCTION public.user_dissociated_groups(user_row auth.users) IS 'Used as Computed Field on Users Table';
