<svelte:options runes={true} />
<script lang="ts">
import { debounce } from '$lib/actions';
let debouncedValue = $state('');
</script>

<h1> Svelte Action: debounced input demo</h1>
<div class="card">
  <input
  use:debounce={{delay: 200, eventTypeToDebounce: 'keydown'}}
  ondebounced={ (e) => debouncedValue = e.currentTarget.value}
  />
  <!-- {@debug debouncedValue} -->
  <p>Debounced value: {debouncedValue}</p>
</div>
