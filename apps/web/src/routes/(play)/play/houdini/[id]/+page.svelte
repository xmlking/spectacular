<script lang="ts">
	import type { PageData } from './$houdini';
	export let data: PageData;
	let { GetPolicy2 } = data;
	$: ({ GetPolicy2 } = data);
</script>

<h1>Demo infer route params</h1>

<pre>
    data: {JSON.stringify($GetPolicy2.data, null, 2)}
</pre>
<pre>
    errors: {JSON.stringify($GetPolicy2.errors, null, 2)}
</pre>
<pre>
    fetching: {JSON.stringify($GetPolicy2.fetching, null, 2)}
</pre>
<pre>
    partial: {JSON.stringify($GetPolicy2.partial, null, 2)}
</pre>
<pre>
    variables: {JSON.stringify($GetPolicy2.variables, null, 2)}
</pre>
<pre>
    source: {JSON.stringify($GetPolicy2.source, null, 2)}
</pre>
