<script lang="ts" module>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormPath, FormPathLeaves } from 'sveltekit-superforms';
type T = Record<string, unknown>;
type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  // Source: https://github.com/diericx/climbing_notebook/blob/master/src/lib/components/forms/fields/Autocomplete.svelte
  import type { AutocompleteOption } from '@skeletonlabs/skeleton';
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';
  import Autocomplete from './skeleton/autocomplete.svelte';



  
  interface Props {
    form: SuperForm<T>;
    // export let form: SuperForm<ZodValidation<T>, unknown>;
    field: FormPathLeaves<z.infer<T>>;
    label?: string | undefined;
    options: AutocompleteOption[];
    searchValue?: string;
    pre?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    form,
    field,
    label = undefined,
    options,
    searchValue = $bindable(''),
    pre,
    ...rest
  }: Props = $props();

  const { path, value, errors } = formFieldProxy(form, field);

  let popupSettings: PopupSettings = {
    event: 'click',
    target: 'popupAutocomplete',
    placement: 'bottom',
  };

  function onSelection(event: any): void {
    searchValue = event.detail.label;
    value.set(event.detail.value);
    searchValue = '';
  }
</script>

<label>
  <span class="font-bold">{label || path }</span>
  <br />
  {#if $errors}
    <div class="invalid">{$errors}</div>
  {/if}
  {@render pre?.()}
  <input
    class="autocomplete w-full"
    type="search"
    bind:value={searchValue}
    onkeyup={bubble('keyup')}
    placeholder="Type to Search..."
    use:popup={popupSettings}
    {...rest}
  />
</label>

<div
  data-popup="popupAutocomplete"
  class="card w-full max-w-xs max-h-48 p-4 overflow-y-auto overflow-x-hidden z-50"
  tabindex="-1"
>
  <Autocomplete bind:input={searchValue} {options} on:selection={onSelection} />
</div>

<style lang="pcss">
  .invalid {
    color: orangered;
  }
</style>
