<script lang="ts" context="module">
type T = Record<string, unknown>;
</script>

<!-- <script lang="ts" generics="T extends Record<string, unknown>"> -->
<script lang="ts">
import { FloatingLabelInput, Helper } from 'flowbite-svelte';
import type { InputType } from 'flowbite-svelte';
import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
import { formFieldProxy } from 'sveltekit-superforms';
import { getFormContext } from './forms';

export let form: SuperForm<T, unknown>;
export let field: FormPathLeaves<T>;
export let label = '';
export let type: InputType = 'text';
export let size: 'small' | 'default' = 'default';
export let style: 'filled' | 'outlined' | 'standard' = 'outlined';

const { superform } = getFormContext();
const { path, value, errors, constraints } = formFieldProxy(superform, field);
</script>

<FloatingLabelInput
  {type}
  {style}
  {size}
  name={field}
  bind:value={$value}
  data-invalid={$errors}
  color={$errors ? 'red' : 'base'}
  aria-describedby={`${path}_help`}
  aria-invalid={Boolean($errors)}
  aria-errormessage={Array($errors).join('. ')}
  aria-required="{$constraints?.required},"
  {...$constraints}
  {...$$restProps}
>
  {label}
</FloatingLabelInput>
{#if $errors}
  <Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
