<!--
@component InputChipWrapper - handle null values.
proxy InputChip  component
FIXME: This component is redundant after Svelte 5
-->
<script lang="ts">
import { InputChip } from '@skeletonlabs/skeleton';

// TODO: after svelte 5, use [Function bindings](https://svelte.dev/docs/svelte/bind#Function-bindings)
export let name: string;
export let value: string[] | undefined;

$: _value = value ?? [];

function handleChange() {
  value = _value;
}
</script>


<InputChip
  {name}
  {...$$restProps}
  bind:value={_value}
  on:add={handleChange}
  on:remove={handleChange}
/>
