<svelte:options runes={true} />
<script lang="ts">
import { debounced_input } from '@repo/ui/attachments/index.js';
import { Input } from '@repo/ui/components/ui/input/index.js';

let debouncedValue = $state('');
</script>

<h1> Svelte Action: debounced input demo</h1>
<div class="card">
  <Input
  {@attach debounced_input({ ondebounced: (v: string) => { debouncedValue = v}, delay: 200, eventTypeToDebounce: 'keydown' })}
  />
  <!-- {@debug debouncedValue} -->
  <p>Debounced value: {debouncedValue}</p>
</div>
