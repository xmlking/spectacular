<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { GraphQLErrors } from '$lib/components';
	import { ErrorMessage } from '$lib/components/form';
	import type { PageData } from './$houdini';

	export let data: PageData;
	$: ({ ListPolicies2, formErrors, fieldErrors } = data);
</script>

<button class="btn" on:click={() => ListPolicies2.loadNextPage()}>load more</button>
<button
	class="btn-accent btn"
	on:click={() => ListPolicies2.fetch({ policy: CachePolicy.NetworkOnly })}>refetch</button
>

<ErrorMessage error={fieldErrors?.limit?.[0]} />
<ErrorMessage error={fieldErrors?.offset?.[0]} />
<ErrorMessage error={fieldErrors?.orderBy?.[0]} />
<ErrorMessage error={fieldErrors?.displayNme?.[0]} />

{#if $ListPolicies2.fetching}
	Loading...
{:else if $ListPolicies2.errors}
	<GraphQLErrors errors={$ListPolicies2.errors} />
{:else}
	<details>
		<summary>raw data with @cache(policy: CacheAndNetwork)</summary>
		<pre>
    	{JSON.stringify($ListPolicies2.data, null, 2)}
  	</pre>
	</details>
{/if}

<div>
	created_at: {$ListPolicies2.data?.policies?.[0].created_at} // if created_at is date type, use .toISOString()
	.toLocaleString()
</div>

<pre>
    errors: {JSON.stringify($ListPolicies2.errors, null, 2)}
</pre>
<pre>
    fetching: {JSON.stringify($ListPolicies2.fetching, null, 2)}
</pre>
<pre>
    partial: {JSON.stringify($ListPolicies2.partial, null, 2)}
</pre>
<pre>
    variables: {JSON.stringify($ListPolicies2.variables, null, 2)}
</pre>
<pre>
    source: {JSON.stringify($ListPolicies2.source, null, 2)}
</pre>
