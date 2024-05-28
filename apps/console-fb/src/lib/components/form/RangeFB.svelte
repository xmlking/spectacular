<script lang="ts" context="module">
type T = Record<string, unknown>;
</script>

<!-- <script lang="ts" generics="T extends Record<string, unknown>"> -->
<script lang="ts">
	import { Helper, Label, Range } from 'flowbite-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import type { SuperForm } from 'sveltekit-superforms';
	import { formFieldProxy } from 'sveltekit-superforms';
	import { getFormContext } from './forms';

	export let form: SuperForm<T, unknown>;
	export let field: FormPathLeaves<T>;
	const { superform } = getFormContext();
	const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<Label><slot /></Label>
<Range
	name={field}
	bind:value={$value}
	data-invalid={$errors}
	aria-invalid={Boolean($errors)}
	aria-errormessage={Array($errors).join('. ')}
	{...$constraints}
	{...$$restProps}
/>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
