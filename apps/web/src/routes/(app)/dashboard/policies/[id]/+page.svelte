<script lang="ts">
	import { dev } from '$app/environment';
	import {
		Checkbox,
		DateInput,
		FloatingTextInput,
		Form,
		Select as FormSelect,
		Radio,
		Range,
		TagsInput
	} from '$lib/components/form';
	import {
		actionOptions,
		directionOptions,
		protocols,
		subjectTypeOptions2
	} from '$lib/models/enums';
	import { updatePolicyKeys as keys } from '$lib/models/schema';
	import { Logger } from '$lib/utils';
	import { A, Breadcrumb, BreadcrumbItem, Heading, Helper, UserCircle } from 'flowbite-svelte';
	import { DevicePhoneMobile, RectangleGroup, User, UserGroup } from 'svelte-heros-v2';
	import Select from 'svelte-select';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	const log = new Logger('routes:policies:update');
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

	// const validFrom = dateProxy(form, "validFrom", { format: "datetime-utc" });
	// const validTo = dateProxy(form, "validTo", { format: "datetime-utc" });

	// TODO: reset buttom should also reset `subject & rule search inputs`
	// subject settings
	let subject = $form?.subjectId
		? {
				id: $form.subjectId,
				displayName: $form.subjectDisplayName,
				secondaryId: $form.subjectSecondaryId
		  }
		: null;
	// rule settings
	const disabled = $form?.originalShared;
</script>

<svelte:head>
	<title>Policies | Update</title>
	<meta name="description" content="Update Policy" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/policies">Policy</BreadcrumbItem>
	<BreadcrumbItem>Update Policy</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h4" class="pb-5">Update policy</Heading>

<Form {superform} submitButtonText="Update" class="space-y-6">
	<input type="hidden" name="ruleId" bind:value={$form.ruleId} />

	<div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
		<div class="col-span-2">
			<Radio field={keys.subjectType} items={subjectTypeOptions2} disabled />
		</div>
		<div class="col-span-2">
			<Select
				class="input"
				itemId="displayName"
				label="displayName"
				placeholder="Type to select subject"
				bind:value={subject}
				disabled
				--list-z-index="100"
				--border-radius="8px"
			>
				<b slot="prepend">
					{#if $form.subjectType == 'group'}
						<UserGroup />
					{:else if $form.subjectType == 'service_account'}
						<UserCircle />
					{:else if $form.subjectType == 'device'}
						<DevicePhoneMobile />
					{:else if $form.subjectType == 'device_pool'}
						<RectangleGroup />
					{:else}
						<User />
					{/if}
				</b>
				<svelte:fragment slot="input-hidden" let:value>
					<input
						type="hidden"
						name="subjectDisplayName"
						value={value ? value.displayName : null}
					/>
				</svelte:fragment>
			</Select>
			{#if $errors.subjectId || $errors.subjectSecondaryId || $errors.subjectDisplayName}
				<Helper class="mt-2" color="red">Subject is required</Helper>
			{/if}
		</div>
		<div class="col-span-2 flex justify-end">
			{#if $form.originalShared}
				<A class="btn" href="/dashboard/rules/{$form.ruleId}">edit this golden rule</A>
			{/if}
		</div>
		<div class="col-span-2">
			<FloatingTextInput field="rule.displayName" label="Display Name" {disabled} />
		</div>
		<div class="col-span-4">
			<FloatingTextInput field="rule.description" label="Description" {disabled} />
		</div>
		<div class="col-span-3">
			<TagsInput field="rule.tags" label="Tags" placeholder={'Enter tags...'} {disabled} />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="rule.annotations" label="Annotations" {disabled} />
			<Helper class="mt-2 text-sm italic"
				>Format: key1=>value1 (or) "key2" => "value2 with space"</Helper
			>
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="rule.source" label="Source" {disabled} />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="rule.sourcePort" label="Source port" {disabled} />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="rule.destination" label="Destination" {disabled} />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field="rule.destinationPort" label="Destination port" {disabled} />
		</div>
		<div>
			<FormSelect field="rule.protocol" items={protocols} {disabled} />
		</div>
		<div>
			<Radio field="rule.action" items={actionOptions} {disabled} />
		</div>
		<div>
			<Radio field="rule.direction" items={directionOptions} {disabled} />
		</div>
		<div class="col-start-5 flex justify-end">
			<Checkbox
				field="rule.shared"
				class="toggle-secondary toggle"
				labelPosition="before"
				{disabled}>Shared</Checkbox
			>
		</div>
		<div class="col-end-7">
			<FloatingTextInput field={keys.weight} type="number" label="Weight" />
		</div>

		<div class="col-span-4">
			<FloatingTextInput field="rule.appId" label="App id" {disabled} />
			<Helper class="mt-2 text-sm italic"
				>If no app is selected, throttle rate applied system wide.</Helper
			>
		</div>
		<div class="col-span-2">
			<Range
				field="rule.throttleRate"
				class="range-primary range-md"
				min="0"
				max="100"
				label="Bandwidth limit"
				{disabled}>Throttle Rate {$form.rule.throttleRate}</Range
			>
		</div>
		<div class="flex justify-start">
			<Checkbox field={keys.active} class="toggle-secondary toggle" labelPosition="before"
				>Active</Checkbox
			>
		</div>
		<div class="col-start-5">
			<DateInput type="datetime-local" field={keys.validFrom} label="Valid From" />
		</div>
		<div class="col-end-auto">
			<DateInput type="datetime-local" field={keys.validTo} label="Valid To" />
		</div>
	</div>
</Form>

{#if dev}
	<br />
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
{/if}
