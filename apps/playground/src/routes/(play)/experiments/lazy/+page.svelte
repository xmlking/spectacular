<script lang="ts">
export let data;
</script>

<h2>Quick</h2>
<pre>{JSON.stringify(data.quick, null, 2)}</pre>
<h2>Lazy</h2>
{#await data.greeting.promise}
	loading...
{:then value}
	<pre>{JSON.stringify(value, null, 2)}</pre>
{:catch error}
	ERROR : {error}
{/await}
