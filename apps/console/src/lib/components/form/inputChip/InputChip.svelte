<script lang="ts" context="module">
	import { fly, scale } from 'svelte/transition';
	import { type Transition, type TransitionParams, prefersReducedMotionStore } from './index';
	import { dynamicTransition } from './transitions';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type FlyTransition = typeof fly;
	type ListTransitionIn = Transition;
	type ListTransitionOut = Transition;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type ScaleTransition = typeof scale;
	type ChipTransitionIn = Transition;
	type ChipTransitionOut = Transition;
</script>

<script
	lang="ts"
	generics="ListTransitionIn extends Transition = FlyTransition, ListTransitionOut extends Transition = FlyTransition, ChipTransitionIn extends Transition = ScaleTransition, ChipTransitionOut extends Transition = ScaleTransition"
>
	import { cn } from '$lib/components/utils/ui';
	import { createEventDispatcher, onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	// Types
	import type { SvelteEvent } from './index';
	import { CloseOutline } from 'flowbite-svelte-icons';

	// Event Dispatcher
	type InputChipEvent = {
		add: { event: SubmitEvent; chipIndex: number; chipValue: string };
		remove: { event: MouseEvent; chipIndex: number; chipValue: string };
		addManually: { chipIndex: number; chipValue: string };
		removeManually: { chipValue: string };
		invalid: { event: SubmitEvent; input: string };
		invalidManually: { input: string };
	};
	const dispatch = createEventDispatcher<InputChipEvent>();

	// Props
	/** Bind the input value. */
	export let input = '';
	/**
	 * Set a unique select input name.
	 * @type {string}
	 */
	export let name: string;
	/** An array of values. */
	export let value: any[] = [];
	/**
	 * Provide a whitelist of accepted values.
	 * @type {string[]}
	 */
	export let whitelist: string[] = [];
	/** Maximum number of chips. Set -1 to disable. */
	export let max = -1;
	/** Set the minimum character length. */
	export let minlength = -1;
	/** Set the maximum character length. */
	export let maxlength = -1;
	/** When enabled, allows for uppercase values. */
	export let allowUpperCase = false;
	/** When enabled, allows for duplicate values. */
	export let allowDuplicates = false;
	export let placeholder = 'Enter values followed by return';

	/**
	 * Provide a custom validator function.
	 * @type {function}
	 */
	export let validation: (...args: any[]) => boolean = () => true;

	/** The duration of the flip (first, last, invert, play) animation. */
	export let duration = 150;
	/** Set the required state for this input field. */
	export let required = false;

	// Props (transition)
	/**
	 * Enable/Disable transitions
	 * @type {boolean}
	 */
	export let transitions = !$prefersReducedMotionStore;
	/**
	 * Provide the transition used in list on entry.
	 * @type {ListTransitionIn}
	 */
	export let listTransitionIn: ListTransitionIn = fly as ListTransitionIn;
	/**
	 * Transition params provided to `ListTransitionIn`.
	 * @type {TransitionParams}
	 */
	export let listTransitionInParams: TransitionParams<ListTransitionIn> = {
		duration: 150,
		opacity: 0,
		y: -20
	};
	/**
	 * Provide the transition used in list on exit.
	 * @type {ListTransitionOut}
	 */
	export let listTransitionOut: ListTransitionOut = fly as ListTransitionOut;
	/**
	 * Transition params provided to `ListTransitionOut`.
	 * @type {TransitionParams}
	 */
	export let listTransitionOutParams: TransitionParams<ListTransitionOut> = {
		duration: 150,
		opacity: 0,
		y: -20
	};
	/**
	 * Provide the transition used in chip on entry.
	 * @type {ChipTransitionIn}
	 */
	export let chipTransitionIn: ChipTransitionIn = scale as ChipTransitionIn;
	/**
	 * Transition params provided to `ChipTransitionIn`.
	 * @type {TransitionParams}
	 */
	export let chipTransitionInParams: TransitionParams<ChipTransitionIn> = {
		duration: 150,
		opacity: 0
	};
	/**
	 * Provide the transition used in chip on exit.
	 * @type {ChipTransitionOut}
	 */
	export let chipTransitionOut: ChipTransitionOut = scale as ChipTransitionOut;
	/**
	 * Transition params provided to `ChipTransitionOut`.
	 * @type {TransitionParams}
	 */
	export let chipTransitionOutParams: TransitionParams<ChipTransitionOut> = {
		duration: 150,
		opacity: 0
	};

	// Local
	let inputValid = true;
	let chipValues: Array<{ val: (typeof value)[0]; id: number }> =
		value?.map((val) => {
			return { val: val, id: Math.random() };
		}) || [];

	// Reset Form
	function resetFormHandler() {
		value = [];
	}
	let selectElement: HTMLSelectElement;
	onMount(() => {
		// Verify external form is present
		if (!selectElement.form) return;

		const externalForm = selectElement.form as HTMLFormElement;

		// Attach reset event listener to external form
		externalForm.addEventListener('reset', resetFormHandler);

		// Return onDestroy handler that will remove the event listener from the external form
		return () => {
			externalForm.removeEventListener('reset', resetFormHandler);
		};
	});

	function onInputHandler(): void {
		inputValid = true;
	}

	function validateCustom(chip: string) {
		return validation === undefined || validation(chip);
	}

	function validateCount() {
		return max === -1 || value.length < max;
	}

	function validateLength(chip: string) {
		return (
			(minlength === -1 || chip.length >= minlength) &&
			(maxlength === -1 || chip.length <= maxlength)
		);
	}

	function validateWhiteList(chip: string) {
		return whitelist.length === 0 || whitelist.includes(chip);
	}

	function validateDuplicates(chip: string) {
		return allowDuplicates || !value.includes(chip);
	}

	function validate(chip: string = ''): boolean {
		if (!chip && !input) return false;
		// Format: trim value
		chip = chip !== '' ? chip.trim() : input.trim();
		return (
			validateCustom(chip) &&
			validateCount() &&
			validateLength(chip) &&
			validateWhiteList(chip) &&
			validateDuplicates(chip)
		);
	}

	function addChipCommon(chip: string) {
		// Format: to lowercase (if enabled)
		chip = allowUpperCase ? chip : chip.toLowerCase();
		// Append value to array
		value.push(chip);
		value = value;
		chipValues.push({ val: chip, id: Math.random() });
		chipValues = chipValues;
	}

	function removeChipCommon(chip: string) {
		let chipIndex = value.indexOf(chip);
		// Remove value from array
		value.splice(chipIndex, 1);
		value = value;
		chipValues.splice(chipIndex, 1);
		chipValues = chipValues;
	}

	function addChipInternally(event: SvelteEvent<SubmitEvent, HTMLFormElement>): void {
		event.preventDefault();
		// Validate
		inputValid = validate();
		// When the onInvalid hook is present
		if (inputValid === false) {
			/** @event {{ event: Event, input: any  }} invalid - Fires when the input value is invalid. */
			dispatch('invalid', { event, input });
			return;
		}
		addChipCommon(input);
		/** @event {{ event: Event, chipIndex: number, chipValue: string }} add - Fires when a chip is added. */
		dispatch('add', { event, chipIndex: value.length - 1, chipValue: input });
		// Clear input value
		input = '';
	}

	function removeChipInternally(
		event: SvelteEvent<MouseEvent, HTMLButtonElement>,
		chipIndex: number,
		chipValue: string
	): void {
		if ($$restProps.disabled) return;
		removeChipCommon(chipValue);
		/** @event {{ event: Event, chipIndex: number, chipValue: string }} remove - Fires when a chip is removed. */
		dispatch('remove', { event, chipIndex, chipValue });
	}

	// Export functions
	export function addChip(chip: string) {
		// Validate
		inputValid = validate(chip);
		// When the onInvalid hook is present
		if (inputValid === false) {
			/** @event {{ input: string  }} invalidManually - Fires when the manually added value is invalid. */
			dispatch('invalidManually', { input: chip });
			return;
		}
		addChipCommon(chip);
		/** @event {{ chipIndex: number, chipValue: string }} addManually - Fires when a chip is added manually. */
		dispatch('addManually', { chipIndex: value.length - 1, chipValue: chip });
	}

	export function removeChip(chip: string) {
		if ($$restProps.disabled) return;
		removeChipCommon(chip);
		/** @event {{ chipValue: string }} removeManually - Fires when a chip is removed manually. */
		dispatch('removeManually', { chipValue: chip });
	}

	// Reactive
	$: chipValues =
		value?.map((val, i) => {
			if (chipValues[i]?.val === val) return chipValues[i];
			return { id: Math.random(), val: val };
		}) || [];
</script>

<!-- NOTE: Don't use `hidden` as it prevents `required` from operating -->
<div class="h-0 overflow-hidden">
	<select bind:this={selectElement} bind:value {name} multiple {required} tabindex="-1">
		<!-- NOTE: options are required! -->
		{#each value as option}<option value={option}>{option}</option>{/each}
	</select>
</div>
<!-- Chip Wrapper -->
<div
	class={cn(
		`m-1 block w-full cursor-pointer items-center justify-center space-y-2 rounded-lg border-[1px] px-2.5 pb-2.5 pt-4 text-sm`,
		`${inputValid === false ? ' border-red-500 bg-red-200 focus:border-red-500 dark:text-red-500 dark:focus:border-red-500' : 'border-gray-300 bg-transparent text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'}`
	)}
>
	<!-- Input Field -->
	<form on:submit={addChipInternally}>
		<input
			type="text"
			bind:value={input}
			{...$$restProps}
			class={cn(
				`border-1 peer block w-full appearance-none rounded-lg px-2.5 pb-2.5 pt-4 text-sm`,
				`${inputValid === false ? 'border-red-500 bg-red-200 focus:border-red-500 dark:text-red-500 dark:focus:border-red-500' : 'border-gray-300 bg-transparent text-gray-900  focus:border-blue-600 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'}`
			)}
			{placeholder}
			on:input={onInputHandler}
			on:input
			on:focus
			on:blur
			disabled={$$restProps.disabled}
		/>
	</form>
	<!-- Chip List -->
	{#if chipValues.length}
		<div
			class="flex flex-wrap gap-1"
			in:dynamicTransition|local={{
				transition: listTransitionIn,
				params: listTransitionInParams,
				enabled: transitions
			}}
			out:dynamicTransition|local={{
				transition: listTransitionOut,
				params: listTransitionOutParams,
				enabled: transitions
			}}
		>
			{#each chipValues as { id, val }, i (id)}
				<!-- Wrapping div required for FLIP animation -->
				<div animate:flip={{ duration }}>
					<span
						class={cn(
							'inline-flex items-center rounded  px-2 font-medium ',
							`${inputValid === false ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`
						)}
					>
						{val}
						<button
							type="button"
							class={cn(
								`ml-1 inline-flex items-center rounded-sm text-sm`,
								`${inputValid === false ? 'text-red-400 hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-300' : 'text-blue-400 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300'}`
							)}
							on:click={(e) => removeChipInternally(e, i, val)}
							on:click
							on:keypress
							on:keydown
							on:keyup
							in:dynamicTransition|local={{
								transition: chipTransitionIn,
								params: chipTransitionInParams,
								enabled: transitions
							}}
							out:dynamicTransition|local={{
								transition: chipTransitionOut,
								params: chipTransitionOutParams,
								enabled: transitions
							}}
						>
							<CloseOutline size="sm" />
						</button>
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
