import { CachePolicy, GetPolicyStore } from '$houdini';
import { policySchema, updatePolicySchema as schema } from '$lib/schema/policy';
import { Logger } from '@spectacular/utils';
import { error } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const log = new Logger('policies.get.browser');
const uuidSchema = z.object({ id: policySchema.shape.id });

const getPolicyStore = new GetPolicyStore();
export const load = async (event) => {
  const {
    url,
    params: { id },
  } = event;
  const form = await superValidate(url, zod(uuidSchema));
  if (!form.valid) return { status: 400, form };

  const variables = { id }; // TODO: validate `id`
  const { errors, data } = await getPolicyStore.fetch({
    event,
    blocking: true,
    policy: CachePolicy.CacheAndNetwork,
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
  const policy = data?.policies_by_pk;
  if (!policy) error(404, 'policy not found');

  const form2 = await superValidate(policy, zod(schema));
  // we need `originalShared` to track if `rule.shared` is changeing from false ==> true
  form2.data.originalShared = form2.data.rule.shared;
  return { form: form2 };
};
