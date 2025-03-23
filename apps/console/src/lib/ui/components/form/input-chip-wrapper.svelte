<!--
@component InputChipWrapper - handle null values.
proxy InputChip  component
FIXME: This component is redundant after Svelte 5
-->
<script lang="ts">
import { InputChip } from '@skeletonlabs/skeleton';


  interface Props {
    // TODO: after svelte 5, use [Function bindings](https://svelte.dev/docs/svelte/bind#Function-bindings)
    name: string;
    value: string[] | null | undefined;
    [key: string]: any
  }

  let { name, value = $bindable(), ...rest }: Props = $props();

let _value = $derived(value ?? []);

function handleChange() {
  value = _value;
}
</script>


<InputChip
  {name}
  {...rest}
  bind:value={_value}
  on:add={handleChange}
  on:remove={handleChange}
/>
