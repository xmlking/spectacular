<script lang="ts">
	import { format } from 'date-fns';
	import { createField } from 'felte';
	import { FloatingLabelInput } from 'flowbite-svelte';

	const DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS";
	// timestampz (ISO 8601 time zone) format, reset to UTC (e.g., 2018-04-25T14:05:15.953Z)
	export let value: string | null | undefined = null; // isoStr
	export let name: string;
	export let label: string;
	export let style: 'filled' | 'outlined' | 'standard' = 'outlined';
	export let error: string | undefined;

	// yyyy-MM-dd'T'HH:mm:ss.SSSX       >>>  2018-04-25T14:05:15.953Z
	// yyyy-MM-dd'T'HH:mm:ss.SSSXX      >>>  2001-07-04T12:08:56.235-0700
	// yyyy-MM-dd'T'HH:mm:ss.SSSXXX     >>>  2001-07-04T12:08:56.235-07:00 // (ISO 8601 time zone)
	// yyyy-MM-dd'T'HH:mm:ss.SSSSXXX    >>>  2014-12-03T10:05:59.5646+08:00
	// yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX  >>>  2022-12-14T21:33:47.453082+00:00
	let internal = value ? format(new Date(value), DATE_FORMAT) : undefined;

	const input = (value: string | null | undefined) =>
		(internal = value ? format(new Date(value), DATE_FORMAT) : undefined);
	const output = (internal: string | undefined) =>
		(value = internal ? new Date(internal).toISOString() : null);

	$: input(value);
	$: output(internal);

	const { field, onInput, onBlur } = createField({
		name,
		defaultValue: value,
		touchOnChange: true
	});
	$: onInput(value); // 2022-12-14T16:11:35.915Z // check null
</script>

<div use:field on:blur={onBlur} role="textbox">
	<FloatingLabelInput
		type="datetime-local"
		step="0.001"
		{style}
		class="input-bordered input"
		bind:value={internal}
		{...$$restProps}
		color={error ? 'red' : null}
		aria-describedby={`${name}_help`}
		{label}
	/>
	{#if error}
		<p id={`${name}_help`} class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
			<span class="font-medium">Oh, snapp!</span> {error}</p
		>
	{/if}
</div>
