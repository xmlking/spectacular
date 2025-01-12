<!--
@component InputChipWrapper - handle null values.
proxy InputChip  component
-->
<script lang="ts">
import { InputChip } from '@skeletonlabs/skeleton';

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
