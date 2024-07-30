<script lang="ts">
import { browser, dev } from '$app/environment';
import { goto, invalidateAll } from '$app/navigation';
import { handleMessage } from '$lib/components/layout/toast-manager';
import type { PolicySearch } from '$lib/schema/policy';
import { getToastStore } from '@skeletonlabs/skeleton';
// import { default as SelectFetch } from 'svelte-select';
// import { TimeDistance } from 'svelte-time-distance';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts, ErrorMessage } from '@spectacular/skeleton/components/form';
import { Logger } from '@spectacular/utils';
import { Trash2 } from 'lucide-svelte';
import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';

// Variables
const log = new Logger('policies:search-form:browser');

export let formData: SuperValidated<PolicySearch>;

// Variables
const toastStore = getToastStore();

// Search form
const superform = superForm(formData, {
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  onError({ result }) {
    // the onError event allows you to act on ActionResult errors.
    // TODO:
    // message.set(result.error.message)
    log.error('policy superForm error:', { result });
  },
});
const { form, delayed, errors, constraints, message, tainted, posted, submitting } = superform;

let searchForm: HTMLFormElement;
let subject = $form.subjectId
  ? {
      id: $form.subjectId,
      displayName: $form.subjectDisplayName,
      secondaryId: '',
    }
  : null;

// Functions
async function fetchSubjects(filterText: string) {
  if (!filterText.length) return Promise.resolve([]);
  const response = await fetch(`/api/directory/search?subType=${$form.subjectType}&filter=&search=${filterText}`);
  if (!response.ok) throw new Error(`An error has occurred: ${response.status}`);
  const data = await response.json();
  if (!data) throw new Error('no data');
  return data.results;
}
async function clearSubject(event: Event) {
  subject = null;
  if (browser) {
    await goto(`/policies?subjectType=${$form.subjectType}&limit=${$form.limit}&offset=${$form.offset}`);
  }
}
</script>

  <!-- Form Level Errors / Messages -->
  <Alerts errors={$errors._errors} message={$message} />

  <form data-sveltekit-noscroll bind:this={searchForm}>
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> Policies </span>
    <!--
      <ButtonGroup class="w-1/3">
        <Select
          name="subjectType"
          class="!w-fit !rounded-r-none"
          items={subjectTypeOptions}
          bind:value={$form.subjectType}
          on:change={clearSubject}
          placeholder="Select Type"
          data-invalid={$errors.subjectType}
          color={$errors.subjectType ? 'red' : 'base'}
          aria-invalid={Boolean($errors.subjectType)}
          aria-errormessage={Array($errors.subjectType).join('. ')}
          aria-required="{$constraints.subjectType?.required},"
          {...$constraints.subjectType}
        />
        <SelectFetch
          class="w-auto !rounded-l-none !bg-gray-50 !px-2 dark:!bg-gray-700"
          itemId="displayName"
          label="displayName"
          bind:value={subject}
          on:change={() => searchForm.requestSubmit()}
          on:clear={clearSubject}
          loadOptions={fetchSubjects}
          --list-z-index="100"
        >
          <b slot="prepend" class="p-2">
            {#if $form.subjectType == 'group'}
              <UsersGroupOutline />
            {:else if $form.subjectType == 'service_account'}
              <UserCircleOutline />
            {:else if $form.subjectType == 'device'}
              <MobilePhoneOutline />
            {:else if $form.subjectType == 'device_pool'}
              <ComputerSpeakerOutline />
            {:else}
              <UserOutline />
            {/if}
          </b>
          <svelte:fragment slot="input-hidden" let:value>
            <input type="hidden" name="subjectId" value={value ? value.id : null} />
            <input type="hidden" name="subjectDisplayName" value={value ? value.displayName : null} />
          </svelte:fragment>
        </SelectFetch>
      </ButtonGroup>
  -->

    <input name="limit" bind:value={$form.limit} type="hidden" />
    <input name="offset" bind:value={$form.offset} type="hidden" />
    <ErrorMessage error={$errors?.subjectType?.[0]} />
    <ErrorMessage error={$errors?.subjectId?.[0]} />
    <ErrorMessage error={$errors?.limit?.[0]} />
    <ErrorMessage error={$errors?.offset?.[0]} />
  </form>


  <DebugShell label="form-data">
  <SuperDebug
    label="Miscellaneous"
    status={false}
    data={{ message: $message, submitting: $submitting, delayed: $delayed, posted: $posted }}
  />
  <br />
  <SuperDebug label="Form" data={$form} />
  <br />
  <SuperDebug label="Tainted" status={false} data={$tainted} />
  <br />
  <SuperDebug label="Errors" status={false} data={$errors} />
  <br />
  <SuperDebug label="Constraints" status={false} data={$constraints} />
  <!-- <br />
	<SuperDebug label="$page data" status={false} data={$page} /> -->
</DebugShell>
