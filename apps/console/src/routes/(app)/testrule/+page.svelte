<script lang="ts">
  import { loading } from '$lib/graphql/loading.js';

  export let data

  $: ({ MyQuery } = data)
</script>
{#if $MyQuery.fetching}
loading...
{:else}
    <pre>
      {JSON.stringify($MyQuery.data,null,2) }
    </pre>
{/if}
