<script lang="ts">
import { page } from '$app/stores';
import { CachePolicy, ProfileDataStore, cache } from '$houdini';
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { createPATSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { AppBar, getToastStore } from '@skeletonlabs/skeleton';
import { clipboard } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { Loader, MoreHorizontal } from 'lucide-svelte';
import { onMount } from 'svelte';
import type { Writable } from 'svelte/store';
import SuperDebug, {
  type ErrorStatus,
  dateProxy,
  defaults,
  setError,
  setMessage,
  superForm,
} from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

// Variables
let copied: boolean;
let pat: string;
const log = new Logger('profile:pat:form:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const form = superForm(defaults(zod(createPATSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false, // this is key to avoid unnecessary data fetch call while using houdini smart cache.
  validators: zodClient(createPATSchema),
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
    // Second, add the PAT to database
    const { expiresAt, name } = form.data;
    const { data, error: addPATError } = await nhost.auth.createPAT(expiresAt, { name });
    if (addPATError) {
      log.error('Error occurred while creating a PAT token:', { error });
      setError(form, '', addPATError.error, {
        status: addPATError.status as ErrorStatus,
      });
      return;
    }
    if (!data?.personalAccessToken) {
      log.error('This shoud not happen', { data });
      return;
    }
    // Finally notify user: successfully added a new security key
    const message = {
      message: `Created '${name}' PAT token, Please save your PAT: ${data.personalAccessToken}`,
      hideDismiss: false,
      timeout: 10000,
      type: 'success',
    } as const;
    pat = data.personalAccessToken;
    setMessage(form, message);
    // handleMessage(message, toastStore);
    // TODO: https://github.com/HoudiniGraphql/houdini/issues/891
    // TODO: add { id, personalAccessToken }  to cache, instead of reload()
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

let proxyExpiresAt: Writable<string>;
onMount(() => {
  proxyExpiresAt = dateProxy(form, 'expiresAt', { format: 'date-local', empty: 'undefined' });
});
// Functions
/**
 * FIXME: Workaround for refresh page, after first time security token added
 * https://github.com/HoudiniGraphql/houdini/issues/891
 */
async function reload() {
  const profileDataStore = new ProfileDataStore();
  const { data, errors } = await profileDataStore.fetch({
    blocking: true,
    policy: CachePolicy.NetworkOnly,
  });
  console.log({ data, errors });
}
// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message}>
    <button
      slot="message"
      class:hidden={$message?.type !== "success"}
      class="btn variant-filled ml-2"
      use:clipboard={pat}
      on:click={() => {
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 1000);
      }}>{copied ? "Copied 👍" : "Copy"}</button
    >
</Alerts>

<!-- Creating new PAT token  Form -->
<form method="POST" use:enhance>
  <AppBar gridColumns="grid-cols-3" slotTrail="place-content-end">
    <svelte:fragment slot="lead">
      <div>
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label class="label">Name</Form.Label>
            <input
              type="text"
              class="input data-[fs-error]:input-error"
              {...attrs}
              bind:value={$formData.name}
            />
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter name for the PAT</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
      <div>
        <Form.Field {form} name="expiresAt">
          <Form.Control let:attrs>
            <Form.Label class="space-y-3">Expiry Date</Form.Label>
            <input
              type="date"
              class="input data-[fs-error]:input-error"
              {...attrs}
              {...$constraints.expiresAt}
              min={$constraints.expiresAt?.min?.toString().slice(0, 10)}
              max={$constraints.expiresAt?.max?.toString().slice(0, 10)}
              bind:value={$proxyExpiresAt}
            />
          </Form.Control>
          <!-- <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter the desired expiry date</Form.Description> -->
          <Form.FieldErrors class="data-[fs-error]:text-error-500" />
        </Form.Field>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="trail">
      <button
        type="submit"
        class="btn variant-filled-secondary"
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
    </svelte:fragment>
  </AppBar>
</form>

<!-- Debug -->
<DebugShell>
  <SuperDebug
    data={{
      pat,
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
