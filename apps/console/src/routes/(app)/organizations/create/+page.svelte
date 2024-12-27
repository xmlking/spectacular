<script lang="ts">
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { graphql, type policies_insert_input } from '$houdini';
import * as m from '$i18n/messages';
import { searchRulesFn } from '$lib/api/search-rules';
import { searchSubjects } from '$lib/api/search-subjects';
import { handleMessage } from '$lib/components/layout/toast-manager';
import { i18n } from '$lib/i18n';
import { createOrganizationSchema as schema } from '$lib/schema/organization';
import { createOrganizationKeys as keys } from '$lib/schema/organization';
import { getLoadingState } from '$lib/stores/loading';
import type { PartialGraphQLErrors } from '$lib/types';
import { actionOptions, directionOptions, protocols, subjectTypeOptions } from '$lib/utils/options';
import { InputChip, RadioGroup, RadioItem, RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
import { getToastStore } from '@skeletonlabs/skeleton';
import { DebugShell, GraphQLErrors } from '@spectacular/skeleton';
import { Alerts } from '@spectacular/skeleton/components/form';
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

const log = new Logger('organizations.create.browser');

// Variables
const toastStore = getToastStore();
const loadingState = getLoadingState();
let gqlErrors: PartialGraphQLErrors;

const createOrganization = graphql(`
    mutation CreateOrganization($data: organizations_insert_input!) {
      insert_organizations_one(object: $data) {
        displayName
      }
    }
  `);

const form = superForm(defaults(zod(schema)), {
  SPA: true,
  dataType: 'json',
  taintedMessage: null,
  syncFlashMessage: false,
  resetForm: true,
  delayMs: 100,
  timeoutMs: 4000,
  validators: zodClient(schema),
  async onUpdate({ form, cancel }) {
    if (!form.valid) return;
  },
  onError({ result }) {
    log.error('superForm onError:', { result });
  },
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
  <meta name="description" content="Create Organization" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Organizations</h1>
    <p>create organization</p>
  </section>

  <section class="space-y-4">
    <!-- Form Level Errors / Messages -->
    <Alerts errors={$errors._errors} message={$message} />
    <!-- GraphQL Errors  -->
    {#if gqlErrors}
      <GraphQLErrors errors={gqlErrors} />
    {/if}
    <!-- Update User Details Form -->
    <form
    class=" variant-ghost-surface space-y-6 rounded-md p-4 shadow-md"
    method="POST"
    use:enhance
  >
      <header class="card-header">
        <div class="text-xl">Create Organization</div>
        <!-- <div>Create new Organization</div> -->
      </header>
      <section class="p-4 grid gap-6 content-center md:grid-cols-3 lg:grid-cols-6">
			<div class="col-span-3">
				<Form.Field {form} name={keys.displayName}>
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label class="label">Name</Form.Label>
							<input {...attrs} class="input" bind:value={$formData.displayName} />
							<Form.FieldErrors class="data-[fs-error]:text-error-500" />
						</div>
					</Form.Control>
				</Form.Field>
			</div>
			<div class="col-span-3">
				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label class="label">Description</Form.Label>
							<input class="input" {...attrs} bind:value={$formData.description} />
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="col-span-3">
				<Form.Field {form} name="allowedEmails">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label class="label">Allowed_Emails</Form.Label>
							<InputChip {...attrs} bind:value={$formData.allowedEmails} validation={isValidEmail}/>
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
      <div class="col-span-3">
				<Form.Field {form} name="allowedEmailDomains">
					<Form.Control let:attrs>
						<div class="grid gap-2">
							<Form.Label class="label">Allowed_Email_Domains</Form.Label>
							<InputChip {...attrs} bind:value={$formData.allowedEmailDomains} validation={isValidEmailDomain}/>
						</div>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
    </section>
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
        Create
      {/if}
    </button>
  </form>
  </section>

    <section class="space-y-4">
    <!-- Debug -->
    <DebugShell label="form-data">
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
    </section>
</div>
