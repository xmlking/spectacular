import { UpdateRoleStore, type users_set_input } from '$houdini';
import { updateUserSchema as schema, userSchema } from '$lib/schema/delegation';
import { Logger, cleanClone } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, setMessage, superValidate } from 'sveltekit-superforms/server';
const log = new Logger('user.update.server');
const uuidSchema = userSchema.shape.id;
const updateRoleStore = new UpdateRoleStore();
export const actions = {
  default: async (event) => {
    const { params, request } = event;
    const id = uuidSchema.parse(params.id);

    const form = await superValidate(request, zod(schema));
    log.debug({ form });

    // superform validation
    if (!form.valid) return fail(400, { form });

    log.debug('before cleanClone with null:', form.data);
    const dataCopy = cleanClone(form.data, { empty: 'null' });
    log.debug('after cleanClone with null:', dataCopy);
    const payload: users_set_input = {
      ...dataCopy,
    };
    const variables = { id: id, data: payload };
    log.debug('UPDATE action variables:', variables);
    const { errors, data } = await updateRoleStore.mutate(variables, {
      metadata: { logResult: true },
      event,
    });
    if (errors) {
      for (const error of errors) {
        log.error('update subscriber api error', error);
        if (error.message.includes('Uniqueness violation')) {
          setError(form, 'defaultRole', 'Role is already taken');
        } else {
          setError(form, '', (error as GraphQLError).message);
        }
      };
      return setMessage(form, { type: 'error', message: 'Update user failed' });
    }

    throw redirect(302, '/users', null, event);
  },
};
