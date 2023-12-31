<script lang="ts">
	export let street: string;
	export let city: string;
	export let state: string;
	export let zip: string;
</script>

<div class="ml-3 overflow-hidden">
	<p class="text-sm font-medium text-slate-900">{street}</p>
	<p class="truncate text-sm text-slate-500">{city}, {state} {zip}</p>
</div>
