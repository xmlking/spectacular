<script lang="ts">
	export let formErrors: string[] | undefined;
	export let fieldErrors: Record<string, string[] | undefined> | undefined;
</script>

{#if formErrors}
	<p class="font-bold">FormErrors</p>
	<ul>
		{#each formErrors as error}
			<p><span class="text-ellipsis">{error}</span></p>
		{/each}
	</ul>
{/if}

{#if fieldErrors}
	<p class="font-bold">FieldErrors</p>
	<ul>
		{#each Object.entries(fieldErrors) as [fieldName, errors]}
			<li
				><p
					><span class="font-bold">{fieldName}:</span>
					<span class="text-ellipsis">{errors}</span></p
				></li
			>
		{/each}
	</ul>
{/if}
