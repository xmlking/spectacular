<script lang="ts">
	export let data;
</script>

{#await data.greeting.promise}
	loading...
{:then value}
	<pre>{JSON.stringify(value, null, 2)}</pre>
{:catch error}
	ERROR : {error}
{/await}
