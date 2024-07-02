<script lang="ts">
import BreadCrumb from '$lib/components/bread-crumb.svelte';
import { Form } from '$lib/components/form';
import { updateOrganizationsSchema as schema } from '$lib/schema/organizations';
import { InputChip } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Control, Field, FieldErrors, Label } from 'formsnap';
import { superForm } from 'sveltekit-superforms';
import SuperDebug from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
export let data;
// initializing a form based on superForm with zod schema
const form = superForm(data.form, {
  dataType: 'json',
  validators: zodClient(schema),
});
const breadcrumbItems = [
  { text: 'Home', link: '/dashboard' },
  { text: 'Organizations', link: '/organizationses' },
  { text: 'Update Organization', link: null },
];

const {
  form: formData,
  message,
  errors,
  tainted,
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
<Form
	{form}
	submitButtonText="Update"
	class=" variant-ghost-surface space-y-6 rounded-md p-4 shadow-md "
>
<BreadCrumb {...{ items: breadcrumbItems }} />
<div class="md:grid-cols-col-span-3 mb-6 grid gap-6 lg:grid-cols-6">
		<div class="col-span-3">
			<Field {form} name="Organization">
				<Control let:attrs>
					<div class="grid gap-2">
						<Label class="label">Organization</Label>
						<input
							class="input"
							{...attrs}
							bind:value={$formData.organization}
              disabled
						/>
					</div>
				</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="col-span-3">
			<Field {form} name="description">
				<Control let:attrs>
					<div class="grid gap-2">
						<Label class="label">Description</Label>
						<input
							class="input"
							{...attrs}
							bind:value={$formData.description}
						/>
					</div>
				</Control>
				<FieldErrors />
			</Field>
		</div>
		<div class="col-span-3">
			<Field {form} name="allowedEmails">
				<Control let:attrs>
					<div class="grid gap-2">
							<Label class="label">Allowed Emails</Label>
							<InputChip
								{...attrs}
								bind:value={$formData.allowedEmails}
                validation={isValidEmail}
							/>
					</div>
				</Control>
			</Field>
		</div>
    <div class="col-span-3">
			<Field {form} name="allowedEmailDomains">
				<Control let:attrs>
					<div class="grid gap-2">
							<Label class="label">Allowed Email Domains</Label>
							<InputChip
								{...attrs}
								bind:value={$formData.allowedEmailDomains}
                validation={isValidEmailDomain}
							/>
					</div>
				</Control>
			</Field>
		</div>
	</div>
</Form>
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
