import { CachePolicy, SearchPoliciesStore, order_by } from '$houdini';
import { policySearchSchema as schema } from '$lib/schema/policy';
import { Logger, sleep } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
const log = new Logger('policies.list.browser');

const searchPoliciesStore = new SearchPoliciesStore();
export const load = async (event) => {
  const { url } = event;
  const form = await superValidate(url, zod(schema));

  if (!form.valid) return { status: 400, form }; // return fail(400, { form }); // FIXME
  await sleep(5000);

  const {
    data: { limit, offset, subjectType, subjectId },
  } = form;

  const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
  const where = {
    ...(subjectType ? { subjectType: { _eq: subjectType } } : {}),
    ...(subjectId ? { subjectId: { _eq: subjectId } } : {}),
  };

  const variables = {
    limit,
    offset,
    orderBy,
    where,
  };
  const { errors, data } = await searchPoliciesStore.fetch({
    event,
    blocking: true,
    policy: CachePolicy.NetworkOnly,
    variables,
  });
  if (errors) {
    for (const error of errors) {
      log.error('list policies api error', error);
      // NOTE: you can add multiple errors, send all along with a message
      setError(form, '', (error as GraphQLError).message);
    }
    setMessage(form, { type: 'error', message: 'Backend error 😎' });
    return { status: 500, form };
  }
  const items = data?.policies;
  if (!items) error(404, 'policies not found');
  return { form, items };
};
