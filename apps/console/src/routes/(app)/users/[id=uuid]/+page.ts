import { CachePolicy, GetUserByIdStore } from '$houdini';
import { updateUserSchema as schema } from '$lib/schema/delegation';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const getUsersByIdStore = new GetUserByIdStore();
export const load = async (event) => {
  const {
    params: { id },
  } = event;
  const variables = { id }; // TODO: validate `id`
  const { errors, data } = await getUsersByIdStore.fetch({
    event,
    blocking: true,
    policy: CachePolicy.NetworkOnly,
    variables,
  });
  if (errors) error(400, errors[0] as GraphQLError);
  const user = data?.user;
  const orgRoles = data?.user_org_roles;
  const organizations = data?.organizations;
  console.log('user:', user);
  if (!user) error(404, 'User not found');
  const form = await superValidate(user, zod(schema));
  return { form, user, orgRoles, organizations };
};
