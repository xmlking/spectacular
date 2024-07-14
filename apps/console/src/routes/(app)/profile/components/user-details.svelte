<script lang="ts">
import { page } from '$app/stores';
import { CachePolicy, GetUserStore, PendingValue, type UserDetailsFragment, fragment, graphql } from '$houdini';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { updateUserDetailsSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { AppBar, Avatar, NoirLight, filter, getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import * as Form from 'formsnap';
import { UserRound } from 'lucide-svelte';
import SuperDebug, { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

export let user: UserDetailsFragment;
$: data = fragment(
  user,
  graphql(`
      fragment UserDetailsFragment on users @loading(cascade: true) {
        id
        displayName
        email
        phoneNumber
        defaultOrg
        defaultRole
        avatarUrl
        locale
        plan: metadata(path: ".plan")
      }
    `),
);

// Variables
const log = new Logger('profile:profile:details:browser');
const toastStore = getToastStore();
const loadingState = getLoadingState();
const nhost = getNhostClient();
const form = superForm(defaults(zod(updateUserDetailsSchema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  clearOnSubmit: 'errors-and-message',
  delayMs: 100,
  timeoutMs: 4000,
  resetForm: true,
  invalidateAll: false, // this is key to avoid unnecessary data fetch call while using houdini smart cache.
  validators: zodClient(updateUserDetailsSchema),
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
    // Second, update user profile
    // TODO
    // Finally notify user: successfully added a new security key
    const message = {
      message: 'User Details Updated',
      hideDismiss: true,
      timeout: 10000,
      type: 'success',
    } as const;
    setMessage(form, message);
    handleMessage(message, toastStore);
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

<AppBar>
  <svelte:fragment slot="lead"><UserRound /></svelte:fragment>
  {#if $data.displayName === PendingValue}
    <div class="placeholder animate-pulse" />
  {:else}
    <h2 class="h2" data-toc-ignore>{$data.displayName}</h2>
  {/if}
  <svelte:fragment slot="trail">
    {#if $data.avatarUrl === PendingValue || $data.displayName === PendingValue}
      <div class="placeholder-circle w-16 animate-pulse" />
    {:else}
      <Avatar
        src={$data.avatarUrl || undefined}
        initials={$data.displayName}
        width="w-11"
        action={filter}
        actionParams="#NoirLight"
      />
    {/if}
  </svelte:fragment>
</AppBar>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Update User Details Form -->
<div class="card">
  <header class="card-header">
      <div class="text-2xl">Edit Profile</div>
      <div>Update your account information</div>
  </header>
  <div class="p-4 grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <div class="grid gap-2">
              <!-- <Form.Field {form} name="displayName">
                <Form.Control let:attrs>
                  <Form.Label class="label">Display Name</Form.Label>
                  <input
                    type="text"
                    class="input data-[fs-error]:input-error"
                    {...attrs}
                    bind:value={$formData.displayName}
                  />
                </Form.Control>
                <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">Enter name for the PAT</Form.Description>
                <Form.FieldErrors class="data-[fs-error]:text-error-500" />
              </Form.Field> -->
              <label for="displayName">Display Name</label>
              <input class="input" id="displayName" placeholder="John Doe" bind:value={$data.displayName} />
            </div>
            <div class="grid gap-2">
              <label for="email">Email</label>
              <input class="input" id="email" type="email" placeholder="example@email.com" bind:value={$data.email} />
            </div>
            <div class="grid gap-2">
              <label for="locale">Locale</label>
              <select class="select" id="locale">
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español (España)</option>
                  <option value="fr-FR">Français (France)</option>
                  <option value="de-DE">Deutsch (Deutschland)</option>
              </select>
            </div>
          </div>
          <div class="space-y-4">
            <div class="grid gap-2">
              <label for="phoneNumber">Phone Number</label>
              <input class="input" id="phoneNumber" type="tel" placeholder="+1 (555) 555-5555" bind:value={$data.phoneNumber} />
            </div>
            <div class="grid gap-2">
              <label for="defaultRole">Default Role</label>
              <input class="input" id="defaultRole" type="text" placeholder="Manager" bind:value={$data.defaultRole} />
            </div>
            <div class="grid gap-2">
              <label for="plan">Plan</label>
              <select class="select" id="plan">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div class="col-span-2 space-y-4">
            <div class="grid gap-2">
              <label for="avatarUrl">Avatar URL</label>
              <input class="input" id="avatarUrl" type="url" placeholder="https://example.com/avatar.jpg" bind:value={$data.avatarUrl} />
            </div>
          </div>
  </div>
  <footer class="card-footer flex justify-end">
    <button type="submit" class="btn variant-filled-secondary">Save Changes</button>
  </footer>
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
