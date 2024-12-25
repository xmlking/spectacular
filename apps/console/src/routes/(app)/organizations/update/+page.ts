import { CachePolicy, GetOrgsbyOrgStore } from '$houdini';
import { updateOrganizationSchema as schema } from '$lib/schema/organization';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const getOrgsbyOrgStore = new GetOrgsbyOrgStore();
export async function load({ params, url }) {
  console.log(params, url.searchParams);
  const organization = url.searchParams.get('organization');
  const variables = { organization }; // TODO: validate `id`
  const { errors, data } = await getOrgsbyOrgStore.fetch({
    policy: CachePolicy.NetworkOnly,
    variables,
  });
  if (errors) error(400, errors[0] as GraphQLError);
  const orgdata = data?.organizations_by_pk;
  if (!orgdata) error(404, 'organization not found');
  const form = await superValidate(orgdata, zod(schema));
  return { orgdata, form };
}
