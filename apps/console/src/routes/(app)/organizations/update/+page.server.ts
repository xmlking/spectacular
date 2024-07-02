import { UpdateOrgsStore, type organizations_set_input } from '$houdini';
import { updateOrganizationsSchema as schema } from '$lib/schema/organizations';
import { Logger, cleanClone } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
const log = new Logger('subscriber.update.server');
const updateOrgsStore = new UpdateOrgsStore();
export const actions = {
  default: async (event) => {
    const { url, request } = event;
    const organization = url.searchParams.get('organization');
    const form = await superValidate(request, zod(schema));
    log.debug({ form });

    // superform validation
    if (!form.valid) return fail(400, { form });

    log.debug('before cleanClone with null:', form.data);
    const dataCopy = cleanClone(form.data, { empty: 'null' });
    log.debug('after cleanClone with null:', dataCopy);

    const payload: organizations_set_input = {
      ...dataCopy,
    };
    const variables = { organization, data: payload };
    log.debug('UPDATE action variables:', variables);
    const { errors, data } = await updateOrgsStore.mutate(variables, {
      metadata: { logResult: true },
      event,
    });
    if (errors) {
      for (const error of errors) {
        log.error('update organization api error', error);
        if (error.message.includes('Uniqueness violation')) {
          setError(form, '', (error as GraphQLError).message);
        }
      }

      return setMessage(form, { type: 'error', message: 'Update organization failed' });
    }
    const result = data?.update_organizations_by_pk;
    if (!result)
      return setMessage(
        form,
        { type: 'error', message: 'Update organization failed: responce empty' },
        { status: 404 },
      );

    const message = {
      message: `Organization: ${result.organization} updated`,
      dismissible: true,
      duration: 10000,
      type: 'success',
    } as const;
    throw redirect(302, '/organizations', message, event);
  },
};
