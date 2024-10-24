<script lang="ts">
import Delegation from './components/delegation.svelte';
import Update from './components/user-details.svelte';
	let { data } = $props();
</script>

<Update data={data} />
<Delegation data={data} />
