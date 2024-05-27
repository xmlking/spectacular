<script lang="ts" context="module">
type T = Record<string, unknown>;
</script>

<!-- <script lang="ts" generics="T extends Record<string, unknown>"> -->
<script lang="ts">
import { Helper, Label, Textarea } from 'flowbite-svelte';
import type { FormPathLeaves, SuperForm } from 'sveltekit-superforms';
import { formFieldProxy } from 'sveltekit-superforms';
import { getFormContext } from './forms';

export let form: SuperForm<T, unknown>;
export let field: FormPathLeaves<T>;
export let label = '';

const { superform } = getFormContext();
const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

{#if label}
  <Label color={$errors ? 'red' : 'gray'} for={field} class="mb-2">{label}</Label>
{/if}
<Textarea
  name={field}
  bind:value={$value}
  data-invalid={$errors}
  rows="4"
  color={$errors ? 'red' : 'base'}
  aria-invalid={Boolean($errors)}
  aria-errormessage={Array($errors).join('. ')}
  aria-required="{$constraints?.required},"
  {...$constraints}
  {...$$restProps}
/>
{#if $errors}
  <Helper class="mt-2" color="red">{$errors}</Helper>
{/if}
