<script lang="ts" context="module">
type T = Record<string, unknown>;
</script>

<!-- <script lang="ts" generics="T extends Record<string, unknown>"> -->
<script lang="ts">
import { Toggle, Helper } from 'flowbite-svelte';
import type { Writable } from 'svelte/store';
import type { FormPathLeaves , SuperForm } from 'sveltekit-superforms';
import { formFieldProxy } from 'sveltekit-superforms';
import { getFormContext } from './forms';

export let form: SuperForm<T, unknown>;
export let field: FormPathLeaves<T>;

const { superform } = getFormContext();
const { path, value, errors, constraints } = formFieldProxy(superform, field);
$: checked = value as Writable<boolean>;
</script>

<Toggle
	name={field}
	color={$errors ? 'red' : 'green'}
	bind:checked={$checked}
	data-invalid={$errors}
	aria-invalid={Boolean($errors)}
	aria-errormessage={Array($errors).join('. ')}
	aria-required={$constraints?.required}
	{...$constraints}
	{...$$restProps}
>
	<span class:text-error={$errors} class="label-text"><slot /></span>
</Toggle>
{#if $errors}
	<Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
