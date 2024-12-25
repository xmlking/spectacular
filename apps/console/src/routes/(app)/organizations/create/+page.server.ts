import { goto } from '$app/navigation';
import { CreateOrgStore } from '$houdini';
import type { organizations_insert_input } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { createOrganizationSchema as schema } from '$lib/schema/organization';
import { getToastStore, popup } from '@skeletonlabs/skeleton';
import { Logger, cleanClone } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';

const log = new Logger('organizations.create.server');
const createOrg = new CreateOrgStore();
export const actions = {
  default: async (event) => {
    const { request } = event;

    console.log('server');
    const form = await superValidate(request, zod(schema));
    console.log('form -', form);

    if (!form.valid) return fail(400, { form });

    log.debug('before cleanClone with strip:', form.data);
    const dataCopy = cleanClone(form.data, { empty: 'strip' });
    log.debug('after cleanClone with strip:', dataCopy);
    const payload: organizations_insert_input = {
      ...dataCopy,
    };
    const variables = { data: payload };
    const { errors, data } = await createOrg.mutate(variables, {
      metadata: { logResult: true },
      event,
    });
    if (errors) {
      for (const error of errors) {
        log.error('create rule api error', error);
        if (error.message.includes('organization')) {
          if (error.message.includes('Uniqueness violation')) {
            setError(form, 'organization', 'Organization already exit');
          } else {
            setError(form, '', (error as GraphQLError).message);
          }
        }
      }

      return setMessage(form, { type: 'error', message: 'Create organizations failed' });
    }
    const result = data?.insert_organizations_one;

    if (!result)
      return setMessage(form, { type: 'error', message: 'Create policy failed: response empty' }, { status: 404 });
    throw redirect(302, '/organizations', null, event);
  },
};
