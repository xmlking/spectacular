<script lang="ts">
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { graphql, type policies_insert_input } from '$houdini';
import * as m from '$i18n/messages';
import { searchRulesFn } from '$lib/api/search-rules';
import { searchSubjects } from '$lib/api/search-subjects';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { updateOrganizationSchema as schema } from '$lib/schema/organization';
import { createOrganizationKeys as keys } from '$lib/schema/organization';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { actionOptions, directionOptions, protocols, subjectTypeOptions } from '$lib/utils/options';
import { InputChip, RadioGroup, RadioItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Control, Description, Field, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
import { fade } from 'svelte/transition';
import { Logger, cleanClone } from '@spectacular/utils';
import * as Form from 'formsnap';
import type { GraphQLError } from 'graphql';
import {
  Loader,
  MonitorSmartphone,
  MoreHorizontal,
  Search,
  Server,
  User,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-svelte';
import Select from 'svelte-select';
import SuperDebug, { dateProxy, defaults, setError, setMessage, superForm } from 'sveltekit-superforms';
import { zod, zodClient } from 'sveltekit-superforms/adapters';

const log = new Logger('organizations.update.browser');

export let data;

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;

const updateOrganization = graphql(`
    mutation UpdateOrganization($id: uuid!,  $data: organizations_set_input!) {
      update_organizations_by_pk(pk_columns: {id: $id}, _set: $data) {
        displayName
      }
    }
  `);
// initializing a form based on superForm with zod schema
const form = superForm(data.form, {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(schema),
});

const {
  form: formData,
  delayed,
  enhance,
  errors,
  constraints,
  message,
  isTainted,
  tainted,
  allErrors,
  reset,
  submitting,
  timeout,
  capture,
  restore,
} = form;
export const snapshot = { capture, restore };

function isValidEmail(value: string): boolean {
  return value.includes('@') && value.includes('.');
}
function isValidEmailDomain(value: string): boolean {
  const dotindex = value.lastIndexOf('.');
  const afterdot = value.substring(dotindex + 1);
  return value.includes('.') && afterdot.length >= 2;
}
// Reactivity
$: valid = $allErrors.length === 0;
$: loadingState.setFormLoading($delayed);
</script>

<svelte:head>
	<title>Organizations</title>
	<meta name="description" content=" Update Organization" />
</svelte:head>

<div class="page-container">
  <form
    method="POST"
    class=" variant-ghost-surface space-y-6 rounded-md p-4 shadow-md"
    use:enhance
  >

<!-- Form Level Errors / Messages -->
<Alerts errors={$errors._errors} message={$message} />

<div class="md:grid-cols-col-span-3 mb-6 grid gap-6 lg:grid-cols-6">
		<div class="col-span-3">
			<Form.Field {form} name="Organization">
				<Form.Control let:attrs>
					<div class="grid gap-2">
						<Form.Label class="label">Organization</Form.Label>
						<input
							class="input"
							{...attrs}
							bind:value={$formData.organization}
              disabled
						/>
					</div>
				</Form.Control>
				<FieldErrors />
			</Form.Field>
		</div>
		<div class="col-span-3">
			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<div class="grid gap-2">
						<Form.Label class="label">Description</Form.Label>
						<input
							class="input"
							{...attrs}
							bind:value={$formData.description}
						/>
					</div>
				</Form.Control>
				<FieldErrors />
			</Form.Field>
		</div>
		<div class="col-span-3">
			<Form.Field {form} name="allowedEmails">
				<Form.Control let:attrs>
					<div class="grid gap-2">
							<Form.Label class="label">Allowed Emails</Form.Label>
							<InputChip
								{...attrs}
								bind:value={$formData.allowedEmails}
                validation={isValidEmail}
							/>
					</div>
				</Form.Control>
			</Form.Field>
		</div>
    <div class="col-span-3">
			<Form.Field {form} name="allowedEmailDomains">
				<Form.Control let:attrs>
					<div class="grid gap-2">
							<Form.Label class="label">Allowed Email Domains</Form.Label>
							<InputChip
								{...attrs}
								bind:value={$formData.allowedEmailDomains}
                validation={isValidEmailDomain}
							/>
					</div>
				</Form.Control>
			</Form.Field>
		</div>
	</div>
    <!-- Form Action Buttons -->
    <button
      type="button"
      class="variant-ghost-secondary btn"
      on:click={() => history.back()}>Back</button
    >
    <button
      type="button"
      class="variant-ghost-warning btn"
      disabled={!$tainted}
      on:click={() => reset()}
    >
      Reset
    </button>

    <button
      class="variant-ghost-success btn"
      type="submit"
      disabled={!$tainted || $submitting}
    >
      {#if $submitting}
        <aside
          class="alert rounded-sm"
          transition:fade|local={{ duration: 400 }}
        >
          Saving..
        </aside>
      {:else}
        Update
      {/if}
    </button>
  </form>

<DebugShell>
	<SuperDebug
		label="Miscellaneous"
		status={false}
		data={{
			message: $message,
			isTainted: isTainted,
			submitting: $submitting,
			delayed: $delayed,
			timeout: $timeout
		}}
	/>
	<br />
	<SuperDebug label="Form" data={$formData} />
	<br />
	<SuperDebug label="Tainted" status={false} data={$tainted} />
	<br />
	<SuperDebug label="Errors" status={false} data={$errors} />
	<br />
	<SuperDebug label="Constraints" status={false} data={$constraints} />
</DebugShell>
</div>
