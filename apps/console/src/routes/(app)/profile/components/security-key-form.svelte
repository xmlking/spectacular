<script lang="ts">
import { page } from '$app/stores';
import { CachePolicy, GetUserStore, cache } from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { webAuthnSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, LoaderCircle, MoreHorizontal } from 'lucide-svelte';
import SuperDebug, { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

// Variables
const log = new Logger('profile:keys:form:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const form = superForm(defaults(zod(webAuthnSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false,
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
    // const user = cache.get("users", { id: '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3'});
    // user.refetch();
    await reload();
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
  posted,
  enhance,
} = form;

// Functions
/**
 * FIXME: Workaround for refresh page, after first time security token added
 * https://github.com/HoudiniGraphql/houdini/issues/891
 */
async function reload() {
  const getUserStore = new GetUserStore();
  // const userId = '076a79f9-ed08-4e28-a4c3-8d4e0aa269a3'
  const userId = $page.data.session.user.id;
  console.log({ userId });
  const { data, errors } = await getUserStore.fetch({
    blocking: true,
    policy: CachePolicy.NetworkOnly,
    variables: { userId },
  });
  console.log({ data, errors });
}
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
              class="variant-filled-secondary"
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
<DebugShell>
  <SuperDebug
    data={{
      message: $message,
      submitting: $submitting,
      delayed: $delayed,
      timeout: $timeout,
      posted: $posted,
      formData: $formData,
      errors: $errors,
      constraints: $constraints,
    }}
    theme="vscode"
    --sd-code-date="lightgreen"
  />
  <SuperDebug label="$page data" data={page} collapsible />
</DebugShell>
