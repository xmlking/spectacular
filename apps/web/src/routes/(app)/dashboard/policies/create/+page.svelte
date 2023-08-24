<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { CachePolicy, SearchRulesStore, order_by } from '$houdini';
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
	import { createPolicyKeys as keys } from '$lib/models/schema';
	import type { Subject } from '$lib/models/types';
	import { Logger } from '$lib/utils';
	import { Breadcrumb, BreadcrumbItem, Heading, Helper } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import {
		IconOutline
	} from 'svelte-heros-v2';
	import Select from 'svelte-select';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	const log = new Logger('routes:policies:create');
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

	// FIXME: tags component is not untainting when reset or on initialization.
	function untaintTags() {
		if ($tainted?.rule?.tags) {
			console.log('untaint tags');
			$tainted = undefined;
		}
	}
	onMount(() => {
		untaintTags();
	});

	// TODO: reset buttom should also reset `subject & rule search inputs`
	// subject settings
	let subject = $form?.subjectId
		? {
				id: $form.subjectId,
				displayName: $form.subjectDisplayName,
				secondaryId: $form.subjectSecondaryId
		  }
		: null;
	/**
	 * Search Subjects by displayName
	 * Note: min filterText length is set to '3'
	 */
	async function fetchSubjects(filterText: string) {
		if (filterText.length < 3) return [];
		const response = await fetch(
			`/api/directory/search?subType=${$form.subjectType}&filter=&search=${filterText}`
		);
		if (!response.ok) throw new Error(`An error has occurred: ${response.status}`);
		const data = await response.json();
		if (!data) throw new Error('no data');
		return data.results as Subject[];
	}
	async function onSubjectChange(changedSubject: CustomEvent) {
		log.debug('onSubjectChange', changedSubject.detail);
		if (browser) {
			if (changedSubject?.detail) {
				$form.subjectId = changedSubject.detail.id;
				$form.subjectDisplayName = changedSubject.detail.displayName;
				$form.subjectSecondaryId = changedSubject.detail.secondaryId;
			} else {
				$form.subjectId = '';
				$form.subjectDisplayName = '';
				$form.subjectSecondaryId = '';
			}
		}
	}
	function clearSubject(event: CustomEvent | Event) {
		// reset Selected ???
		// log.debug('onSubjectTypeChange1',event.target?.value);
		// log.debug('onSubjectTypeChange', event.detail);
		if (browser) {
			subject = null;
			$form.subjectId = '';
			$form.subjectDisplayName = '';
			$form.subjectSecondaryId = '';
		}
	}

	// rule settings
	let rule = $form?.ruleId
		? {
				id: $form.ruleId,
				displayName: $form.rule.displayName
		  }
		: null;

	// $: disabled=$form.rule.shared
	$: disabled = rule != null;

	/**
	 * Search Rules by displayName
	 * Note: min filterText length is set to '3'
	 */
	const searchRulesStore = new SearchRulesStore();
	const orderBy = [{ updatedAt: order_by.desc_nulls_first }];
	async function fetchRule(filterText: string) {
		if (filterText.length < 3) return [];
		const where = {
			displayName: { _like: `%${filterText}%` },
			shared: { _eq: true }
		};
		const variables = { where, orderBy };
		const { errors, data } = await searchRulesStore.fetch({
			blocking: true,
			policy: CachePolicy.NetworkOnly,
			variables
		});
		if (errors) throw new Error(`An error has occurred: ${errors}`);

		if (!data) throw new Error('no data');
		return data.rules;
	}
	async function onRuleChange(changedSubject: CustomEvent) {
		log.debug('onRuleChange', changedSubject.detail);
		if (browser) {
			if (changedSubject?.detail) {
				$form.ruleId = changedSubject.detail.id;
				$form.rule.shared = changedSubject.detail.shared;
				$form.rule.displayName = changedSubject.detail.displayName;
				$form.rule.description = changedSubject.detail.description;
				$form.rule.tags = changedSubject.detail.tags;
				$form.rule.annotations = changedSubject.detail.annotations;
				$form.rule.source = changedSubject.detail.source;
				$form.rule.sourcePort = changedSubject.detail.sourcePort;
				$form.rule.destination = changedSubject.detail.destination;
				$form.rule.destinationPort = changedSubject.detail.destinationPort;
				$form.rule.protocol = changedSubject.detail.protocol;
				$form.rule.direction = changedSubject.detail.direction;
				$form.rule.action = changedSubject.detail.action;
				$form.rule.appId = changedSubject.detail.appId;
				$form.rule.weight = changedSubject.detail.weight;
				// HINT: we copy `rule.weight` to `policy.weight` initially and let users overwrite weightage afterwords.
				$form.weight = changedSubject.detail.weight;
			} else {
				// Reset rule section of form
				rule = null;
				$form.ruleId = undefined;
				$form.rule.shared = false;
				$form.rule.displayName = '';
				$form.rule.description = undefined;
				$form.rule.tags = undefined;
				$form.rule.annotations = undefined;
				$form.rule.source = undefined;
				$form.rule.sourcePort = undefined;
				$form.rule.destination = undefined;
				$form.rule.destinationPort = undefined;
				$form.rule.protocol = 'Any';
				$form.rule.direction = 'egress';
				$form.rule.action = 'block';
				$form.rule.appId = undefined;
				$form.rule.weight = 1000;
			}
		}
	}
	function clearRule(event: Event) {
		log.debug('onRuleClear', event.target);
		if (browser) {
			// Reset rule section of form
			rule = null;
			$form.ruleId = undefined;
			$form.rule.shared = false;
			$form.rule.displayName = '';
			$form.rule.description = undefined;
			$form.rule.tags = undefined;
			$form.rule.annotations = undefined;
			$form.rule.source = undefined;
			$form.rule.sourcePort = undefined;
			$form.rule.destination = undefined;
			$form.rule.destinationPort = undefined;
			$form.rule.protocol = 'Any';
			$form.rule.direction = 'egress';
			$form.rule.action = 'block';
			$form.rule.appId = undefined;
			$form.rule.weight = 1000;
		}
	}
</script>

<svelte:head>
	<title>Policies | Create</title>
	<meta name="description" content="Create Policy" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/policies">Policy</BreadcrumbItem>
	<BreadcrumbItem>Create Policy</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h4" class="pb-5">Create policy</Heading>

<Form {superform} submitButtonText="Create" class="space-y-6">
	<input type="hidden" name="ruleId" bind:value={$form.ruleId} />

	<div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
		<div class="col-span-2">
			<Radio field={keys.subjectType} items={subjectTypeOptions2} on:change={clearSubject} />
		</div>
		<div class="col-span-2">
			<Select
				class="input"
				itemId="displayName"
				label="displayName"
				placeholder="Type to select subject"
				bind:value={subject}
				on:change={onSubjectChange}
				on:clear={clearSubject}
				loadOptions={fetchSubjects}
				--list-z-index="100"
				--border-radius="8px"
				--border-focused="1px solid blue"
			>
				<b slot="prepend">
					{#if $form.subjectType == 'group'}
						<IconOutline name="user-group-outline" />
					{:else if $form.subjectType == 'service_account'}
						<IconOutline name="user-circle-outline" />
					{:else if $form.subjectType == 'device'}
						<IconOutline name="device-phone-mobile-outline" />
					{:else if $form.subjectType == 'device_pool'}
						<IconOutline name="rectangle-group-outline" />
					{:else}
						<IconOutline name="user-outline" />
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
		<div class="col-span-2">
			<Select
				class="input"
				itemId="id"
				label="displayName"
				placeholder="Type to select rule"
				bind:value={rule}
				on:change={onRuleChange}
				on:clear={clearRule}
				loadOptions={fetchRule}
				--list-z-index="100"
				--border-radius="8px"
				--border-focused="1px solid blue"
			>
				<b slot="prepend">
					<IconOutline name="magnifying-glass-outline" />
				</b>
				<svelte:fragment slot="input-hidden" let:value>
					<input
						type="hidden"
						name="ruleDisplayName"
						value={value ? value.displayName : null}
					/>
				</svelte:fragment>
			</Select>
			{#if $errors.ruleId}
				<Helper class="mt-2" color="red">{$errors.ruleId[0]}</Helper>
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
				label="Bandwidth limit">Throttle Rate {$form.rule.throttleRate}</Range
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
