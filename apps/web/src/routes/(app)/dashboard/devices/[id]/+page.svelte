<script lang="ts">
	import { dev } from '$app/environment';
	import { FloatingTextInput, Form, TagsInput } from '$lib/components/form';
	import { updateDeviceKeys as keys } from '$lib/models/schema';
	import { Logger } from '$lib/utils';
	import { Breadcrumb, BreadcrumbItem, Heading, Helper } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	const log = new Logger('routes:devices:update');
	export let data;
	// Client API:
	const superform = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		syncFlashMessage: false,
		onError({ result, message }) {
			log.error('superForm', { result }, { message });
		}
	});
	const {
		form,
		delayed,
		enhance,
		errors,
		constraints,
		message,
		tainted,
		posted,
		allErrors,
		reset,
		submitting,
		capture,
		restore
	} = superform;
	export const snapshot = { capture, restore };
</script>

<svelte:head>
	<title>Devices | Update</title>
	<meta name="description" content="Update Device" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/devices">Devices</BreadcrumbItem>
	<BreadcrumbItem>Update Device</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h4" class="pb-5">Update Device</Heading>

<Form {superform} submitButtonText="Update" class="space-y-6">
	<div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
		<div class="col-span-2">
			<FloatingTextInput field="displayName" label="Display Name" disabled />
		</div>
		<div class="col-span-4">
			<FloatingTextInput field={keys.description} label="Description" />
		</div>
		<div class="col-span-3">
			<TagsInput field={keys.tags} label="Tags" placeholder={'Enter tags...'} />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field={keys.annotations} label="Annotations" />
			<Helper class="mt-2 text-sm italic"
				>Format: key1=>value1 (or) "key2" => "value2 with space"</Helper
			>
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="ip" label="IP" disabled />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="version" label="Version" disabled />
		</div>
	</div>
</Form>

{#if dev}
	<br />
	<SuperDebug
		label="Miscellaneous"
		status={false}
		data={{
			message: $message,
			submitting: $submitting,
			delayed: $delayed,
			posted: $posted
		}}
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
{/if}
