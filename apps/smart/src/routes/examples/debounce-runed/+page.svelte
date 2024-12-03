<svelte:options runes={true} />
<script lang="ts">
import { Debounced } from 'runed';

let search = $state('');
const debounced = new Debounced(() => search, 500);
</script>

<h1> Svelte Action: debounced input demo with Runed</h1>
<div class="card">
	<input bind:value={search} />
	<p>You searched for: <b>{debounced.current}</b></p>
</div>
