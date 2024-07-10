<script lang="ts">
import * as m from '$i18n/messages';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { createPATSchema } from '$lib/schema/user';
import { getLoadingState } from '$lib/stores/loading';
import { getNhostClient } from '$lib/stores/nhost';
import { getToastStore } from '@skeletonlabs/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Logger, sleep } from '@spectacular/utils';
import * as Form from 'formsnap';
import { type ErrorStatus, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

// Variables
let showModal = false;

const openModal = () => {
  showModal = true;
};

const log = new Logger('profile:password:browser');
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
  invalidateAll: false, // this is key for avoid calling the load function on server side
  validators: zodClient(createPATSchema),
  async onUpdate({ form }) {
    if (!form.valid) {
      console.log('Form is not valid');
    }
    if (form.valid) {
      await sleep(4500);
      let expiresAt = new Date(form.data.expiryDate);
      const { error } = await nhost.auth.createPAT(expiresAt, { name: form.data.name });
      if (error) {
        log.error('Error occurred while creating a PAT token:', { error });
        setError(form, '', error.error, {
          status: error.status as ErrorStatus,
        });
        return;
      }
      const message = {
        message: 'PAT Token created',
        hideDismiss: true,
        timeout: 10000,
        type: 'success',
      } as const;
      setMessage(form, message);
      handleMessage(message, toastStore);
    }
  },
});

const { form: formData, delayed, timeout, enhance, errors, message, allErrors, tainted, submitting } = form;

const today = new Date().toISOString().split('T')[0];

// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />
<!-- Form -->
<!-- Creating new PAT token -->
  <div class="card p-4">

              {#if !showModal}
              <button on:click={openModal} class="variant-filled-primary btn w-full">{m.profile_forms_create_pat_button()}</button>
              {:else}
      <form method="POST" use:enhance>
  <div class="card">
    <section class="p-4 space-y-2">
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
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500">
          Enter name for the PAT.
        </Form.Description>
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
      <Form.Field {form} name="expiryDate">
        <Form.Control let:attrs>
          <Form.Label>Expiry Date</Form.Label>
          <input
            type="date"
            min={today}
            class="input data-[fs-error]:input-error"
            {...attrs}
            bind:value={$formData.expiryDate}
          />
        </Form.Control>
        <Form.Description class="sr-only md:not-sr-only text-sm text-gray-500"
          >Enter the desired expiry date</Form.Description
        >
        <Form.FieldErrors class="data-[fs-error]:text-error-500" />
      </Form.Field>
    </section>
    <footer class="card-footer flex justify-end">
      <button
        type="submit"
        class="btn variant-filled-secondary"
        disabled={!$tainted || !valid || $submitting}
      >
        Submit
      </button>
    </footer>
  </div>
</form>
{/if}
    </div>