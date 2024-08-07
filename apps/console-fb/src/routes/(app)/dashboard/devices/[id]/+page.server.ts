import { UpdateDeviceStore } from '$houdini';
import type { devices_set_input } from '$houdini';
import { ToastLevel } from '$lib/components/toast';
import { updateDeviceSchema as schema } from '$lib/models/schema';
import { uuidSchema } from '$lib/utils/zod.utils';
import { Logger, cleanClone } from '@spectacular/utils';
import { fail } from '@sveltejs/kit';
import type { GraphQLError } from 'graphql';
import { redirect as redirectWithFlash } from 'sveltekit-flash-message/server';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const log = new Logger('device.update.server');

const updateDeviceStore = new UpdateDeviceStore();
export const actions = {
  default: async (event) => {
    const { params, request, locals } = event;
    const id = uuidSchema.parse(params.id);
    const session = await locals.auth();
    if (session?.user === undefined) {
      throw redirect(307, `/auth/signin?callbackUrl=/dashboard/devices/${id}`);
    }

    const form = await superValidate(request, zod(schema));
    log.debug({ form });

    // superform validation
    if (!form.valid) return fail(400, { form });

    log.debug('before cleanClone with null:', form.data);
    const dataCopy = cleanClone(form.data, { empty: 'null' });
    log.debug('after cleanClone with null:', dataCopy);
    const payload: devices_set_input = dataCopy;
    const variables = { id, data: payload };
    log.debug('UPDATE action variables:', variables);
    const { errors, data } = await updateDeviceStore.mutate(variables, {
      metadata: { logResult: true },
      event,
    });
    if (errors) {
      errors.forEach((error) => {
        log.error('update device api error', error);
        setError(form, '', (error as GraphQLError).message);
      });
      return setMessage(form, 'Update device failed');
    }

    const result = data?.update_devices_by_pk;
    if (!result) return setMessage(form, 'Update device failed: responce empty', { status: 404 });

    const message = {
      message: `Device: ${result.displayName} updated`,
      dismissible: true,
      duration: 10000,
      type: ToastLevel.Success,
    } as const;
    redirectWithFlash(302, '/dashboard/devices', message, event);
  },
};
