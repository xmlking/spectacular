<script lang="ts">
import { updateOrganizationsSchema as schema } from '$lib/schema/organization';
import { InputChip } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Alerts } from '@spectacular/skeleton/components/form';
import { Control, Field, FieldErrors, Label } from 'formsnap';
import { fade } from 'svelte/transition';
import { superForm } from 'sveltekit-superforms';
import SuperDebug from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();
// initializing a form based on superForm with zod schema
const form = superForm(data.form, {
  dataType: 'json',
  validators: zodClient(schema),
});

const {
  form: formData,
  message,
  errors,
  tainted,
  reset,
  isTainted,
  submitting,
  delayed,
  timeout,
  posted,
  constraints,
  enhance,
} = form;
function isValidEmail(value: string): boolean {
  return value.includes('@') && value.includes('.');
}
function isValidEmailDomain(value: string): boolean {
  const dotindex = value.lastIndexOf('.');
  const afterdot = value.substring(dotindex + 1);
  return value.includes('.') && afterdot.length >= 2;
}
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
			<Field {form} name="Organization">
				<Control >
					{#snippet children({ attrs })}
												<div class="grid gap-2">
							<Label class="label">Organization</Label>
							<input
								class="input"
								{...attrs}
								bind:value={$formData.organization}
	              disabled
							/>
						</div>
																{/snippet}
										</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="col-span-3">
			<Field {form} name="description">
				<Control >
					{#snippet children({ attrs })}
												<div class="grid gap-2">
							<Label class="label">Description</Label>
							<input
								class="input"
								{...attrs}
								bind:value={$formData.description}
							/>
						</div>
																{/snippet}
										</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="col-span-3">
			<Field {form} name="allowedEmails">
				<Control >
					{#snippet children({ attrs })}
												<div class="grid gap-2">
								<Label class="label">Allowed Emails</Label>
								<InputChip
									{...attrs}
									bind:value={$formData.allowedEmails}
	                validation={isValidEmail}
								/>
						</div>
																{/snippet}
										</Control>
			</Field>
		</div>
    <div class="col-span-3">
			<Field {form} name="allowedEmailDomains">
				<Control >
					{#snippet children({ attrs })}
												<div class="grid gap-2">
								<Label class="label">Allowed Email Domains</Label>
								<InputChip
									{...attrs}
									bind:value={$formData.allowedEmailDomains}
	                validation={isValidEmailDomain}
								/>
						</div>
																{/snippet}
										</Control>
			</Field>
		</div>
	</div>
    <!-- Form Action Buttons -->
    <button
      type="button"
      class="variant-ghost-secondary btn"
      onclick={() => history.back()}>Back</button
    >
    <button
      type="button"
      class="variant-ghost-warning btn"
      disabled={!$tainted}
      onclick={() => reset()}
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
			timeout: $timeout,
			posted: $posted
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
