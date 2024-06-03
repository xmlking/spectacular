import { UpdatePolicyStore } from '$houdini';
import type { policies_set_input, rules_set_input } from '$houdini';
import { policySchema, updatePolicySchema as schema } from '$lib/schema/policy';
import { Logger, cleanClone } from '@spectacular/utils';
/* FIXME */
/* eslint-disable no-undef,@typescript-eslint/no-unused-vars */
import { fail, redirect } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('policy.update.server');

const updatePolicyStore = new UpdatePolicyStore();
const uuidSchema = policySchema.shape.id;
export const actions = {
  default: async (event) => {
    const { params, request, locals } = event;
    const id = uuidSchema.parse(params.id);
    const session = await locals.auth();
    if (session?.user == undefined) {
      redirect(307, `/signin?callbackUrl=/policies/${id}`);
    }

    const form = await superValidate(request, zod(schema));
    log.debug({ form });

    // superform validation
    if (!form.valid) return fail(400, { form });

    log.debug('before cleanClone with null:', form.data);
    const dataCopy = cleanClone(form.data, { empty: 'null' });
    log.debug('after cleanClone with null:', dataCopy);
    const {
      subjectDisplayName,
      subjectId,
      subjectSecondaryId,
      subjectType,
      ruleId,
      originalShared,
      rule: { id: rid, shared, throttleRate, ...restRule },
      ...restPolicy
    } = dataCopy;

    // if we are updating Policy with exclusive Rule, overwrite Rule's weight with Policy's weight.
    if (!originalShared && restPolicy.weight) {
      restRule.weight = restPolicy.weight;
    }

    const policyData: policies_set_input = {
      ...restPolicy,
    };
    const ruleData: rules_set_input = {
      ...restRule,
      ...(throttleRate && { throttleRate: `${throttleRate}` }),
      // HINT: only allow changing `shared` property from `false` to `true`
      ...(originalShared == false && shared == true && { shared }),
    };

    const variables = {
      policyId: id,
      policyData,
      ruleId,
      ruleData,
      skipRuleUpdate: originalShared,
    };
    log.debug('UPDATE action variables:', variables);
    const { errors, data } = await updatePolicyStore.mutate(variables, {
      metadata: { logResult: true },
      event,
    });
    if (errors) {
       for (const error of errors) {
          log.error('update policy api error', error);
          // NOTE: you can add multiple errors, send all along with a message
          if (error.message.includes('Uniqueness violation')) {
            setError(form, 'rule.displayName', 'Display Name already taken');
          } else {
            setError(form, '', (error as GraphQLError).message);
          }
        };
        return setMessage(form, { type: 'error', message: 'Update policy failed' });
      }

      const { update_policies_by_pk: policyResult, update_rules_by_pk: ruleResult } = data || {};
      if (!policyResult)
        return setMessage(form, { type: 'error', message: 'Update policy failed: responce empty' }, { status: 404 });

      const message = {
        message: `Policy for Subject: ${policyResult.subjectDisplayName} ${
          ruleResult ? 'and Rule: ' + ruleResult?.displayName : ''
        } updated`,
        dismissible: true,
        duration: 10000,
        type: ToastLevel.Success,
      } as const;
      redirectWithFlash(302, '/policies', message, event);
  },
};
