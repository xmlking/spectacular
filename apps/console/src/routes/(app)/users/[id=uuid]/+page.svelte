<script lang="ts">
import Delegation from './components/delegation.svelte';
import Update from './components/user-details.svelte';
export let data;
</script>

<Update data={data} />
<Delegation data={data} />
