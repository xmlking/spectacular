<script lang="ts">
import { BreadCrumb } from '$lib/components';
import { Form } from '$lib/components/form';
import { organizationsCreateSchema as schema } from '$lib/schema/organizations';
import { InputChip } from '@skeletonlabs/skeleton';
import { DebugShell } from '@spectacular/skeleton/components';
import { Control, Description, Field, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
import { superForm } from 'sveltekit-superforms';
import SuperDebug from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
export let data;

const form = superForm(data.form, {
  dataType: 'json',
  validators: zodClient(schema),
});
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
const breadcrumbItems = [
  { text: 'Dashboard', link: '/dashboard' },
  { text: 'Organizations', link: '/organizations' },
  { text: 'Create Organization', link: null },
];
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
	<meta name="description" content="Showcase formsnap" />
</svelte:head>
<div class="page-container">
	<BreadCrumb {...{ items: breadcrumbItems }} />
	<h1 class="pb-8 text-3xl font-semibold tracking-tight">Create Stream</h1>
	<Form
		{form}
		submitButtonText="Create"
		class=" variant-ghost-surface space-y-6 rounded-md p-4 shadow-md "
	>
		<div class="md:grid-cols-col-span-3 mb-6 grid gap-6 lg:grid-cols-6">
			<div class="col-span-3">
				<Field {form} name="organization">
					<Control let:attrs>
						<div class="grid gap-2">
							<Label class="label">Organization</Label>
							<input {...attrs} class="input" bind:value={$formData.organization} />
							<FieldErrors class="data-fs-[error=true]:bg-red-200" />
						</div>
					</Control>
				</Field>
			</div>
			<div class="col-span-3">
				<Field {form} name="description">
					<Control let:attrs>
						<div class="grid gap-2">
							<Label class="label">Description</Label>
							<input class="input" {...attrs} bind:value={$formData.description} />
						</div>
					</Control>
					<FieldErrors />
				</Field>
			</div>
			<div class="col-span-3">
				<Field {form} name="allowedEmails">
					<Control let:attrs>
						<div class="grid gap-2">
							<Label class="label">Allowed_Emails</Label>
							<InputChip {...attrs} bind:value={$formData.allowedEmails} validation={isValidEmail}/>
						</div>
					</Control>
					<FieldErrors />
				</Field>
			</div>
      <div class="col-span-3">
				<Field {form} name="allowedEmailDomains">
					<Control let:attrs>
						<div class="grid gap-2">
							<Label class="label">Allowed_Email_Domains</Label>
							<InputChip {...attrs} bind:value={$formData.allowedEmailDomains} validation={isValidEmailDomain}/>
						</div>
					</Control>
					<FieldErrors />
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
