<script lang="ts">
import { invalidate, invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { cache } from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { webAuthnSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { DebugShell } from '$lib/ui/components';
import { Alerts } from '$lib/ui/components/form';
import { Logger } from '@repo/utils';
import { getToastStore } from '@skeletonlabs/skeleton';
import * as Form from 'formsnap';
import { Loader, LoaderCircle, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { defaults, type ErrorStatus, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

// Variables
const log = new Logger('user:profile:keys:form:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const form = superForm(defaults(zod4(webAuthnSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  validators: zod(webAuthnSchema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
    // First, check if elevate is required
    const error = await nhost.elevate();
    if (error) {
      log.error('Error elevating user', { error });
      setError(form, '', error.message, {
        status: error.status as ErrorStatus,
      });
      return;
    }
    // Second, add the security key to database
    const { key, error: addKeyError } = await nhost.auth.addSecurityKey(form.data.nickname);
    if (addKeyError) {
      log.error('Error occurred while adding security key', { error: addKeyError });
      setError(form, '', addKeyError.message, {
        status: addKeyError.status as ErrorStatus,
      });
      return;
    }
    // Finally notify user
    const message = {
      message: `Added security key: ${key?.nickname}`,
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
    // Since addSecurityKey() is not using houdini client,
    // we have to manually invalidate cache.
    // Mark all type 'authUserSecurityKeys' stale
    // this may not work for first time, since there is no cache to mark stale
    // cache.markStale('authUserSecurityKeys');
    // TODO: https://github.com/HoudiniGraphql/houdini/issues/891
    const user = cache.get('users', { id: $page.data.userId });
    user.markStale();
    await invalidate(() => true);
  },
});

const {
  form: formData,
  errors,
  allErrors,
  message,
  constraints,
  submitting,
  delayed,
  tainted,
  timeout,
  isTainted,
  enhance,
} = form;

// Functions

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Form -->
<div class="card">
  <header class="card-header">
    <div class="text-xl">Add Security keys</div>
    <!-- <div>Add are delete your security keys like TouchID, FaceID, YubiKeys etc</div> -->
  </header>
  <section class="p-4">
    <form method="POST" use:enhance>
      <Form.Field {form} name="nickname">
        <Form.Control let:attrs>
          <!-- <Form.Label class="label data-[fs-error]:text-error-500" >{m.profile_forms_nickname_label()}</Form.Label> -->
          <div class="input-group input-group-divider grid-cols-[1fr_auto]">
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.nickname}
              placeholder={m.profile_forms_nickname_placeholder()}
            />
            <button
              class="variant-filled"
              disabled={!$tainted || !valid || $submitting}
            >
              {#if $timeout}
                <MoreHorizontal class="m-2 h-4 w-4 animate-ping" />
              {:else if $delayed}
                <Loader class="m-2 h-4 w-4 animate-spin" />
              {:else}
                {m.buttons_add()}
              {/if}
            </button>
          </div>
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          {m.profile_forms_nickname_description()}
        </Form.Description>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
    </form>
  </section>
</div>

<!-- Debug -->
<DebugShell label="pat-form-data">
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{
      message: $message,
      isTainted: isTainted,
      submitting: $submitting,
      delayed: $delayed,
      timeout: $timeout,
    }}
    theme="vscode"
    --sd-code-date="lightgreen"
  />
  <br />
  <SuperDebug label="Form" data={$formData} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
  <!-- <br />
  <SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>
