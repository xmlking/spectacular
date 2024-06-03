import { SearchGroupsStore, order_by, organizations_select_column } from '$houdini';
import { searchGroupSchema as schema } from '$lib/schema/group';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('groups.search.browser');
const searchGroupsStore = new SearchGroupsStore();

export const load = async (event) => {
  const { url } = event;
  const form = await superValidate(url, zod(schema));
  log.debug(form);

  if (!form.valid) return { status: 400, form };

  const {
    data: { limit, offset, displayName, organization },
  } = form;

  const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
  const where = {
    ...(displayName ? { displayName: { _ilike: `%${displayName}%` } } : {}),
    ...(organization ? { organization: { _eq: organization } } : {}),
  };

  const { errors, data } = await searchGroupsStore.fetch({
    event,
    blocking: true,
    variables: { orderBy, limit, offset, where },
  });

  if (errors) {
    for (const error of errors) {
      log.error('List Groups GraphQL Error', error);
      setError(form, (error as GraphQLError).message);
    }
    return setMessage(form, { type: 'error', message: 'List groups failed' }, { status: 500 });
  }

  const groups = data?.groups;
  if (!groups) error(404, 'No Groups were found');
  return { form, groups };
};
