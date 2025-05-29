<svelte:options runes={true} />
<script lang="ts">
import { Input } from '@repo/ui/components/input';
import { Debounced } from 'runed';

let search = $state('');
const debounced = new Debounced(() => search, 500);
</script>

<h1> Svelte Action: debounced input demo with Runed</h1>
<div class="card">
  <Input bind:value={search} />
	<p>You searched for: <b>{debounced.current}</b></p>
</div>
