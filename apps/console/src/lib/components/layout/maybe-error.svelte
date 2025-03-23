<script lang="ts" generics="T">
  import { run } from 'svelte/legacy';

import type { QueryResult } from '$houdini';
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell, GraphQLErrors, NotFound, SomethingWentWrong } from '$lib/ui/components';
import SuperDebug from 'sveltekit-superforms';

  interface Props {
    entityName: string;
    result: QueryResult<T>;
    debug?: boolean;
    children?: import('svelte').Snippet<[any]>;
  }

  let {
    entityName,
    result,
    debug = false,
    children
  }: Props = $props();

// Variables
const loadingState = getLoadingState();

// Functions
const bang = <T>(x: T) => x!;

// Reactivity
let { data, errors, fetching } = $derived(result);
run(() => {
    loadingState.setFormLoading(fetching);
  });
</script>

{#if debug}
  <DebugShell label="QueryResult">
    <SuperDebug label="QueryResult" data={result} />
  </DebugShell>
{/if}
{#if errors && errors?.length > 0}
  <GraphQLErrors {errors} />
{:else if data === undefined}
  <SomethingWentWrong />
{:else if data === null}
  <NotFound {entityName} />
{:else}
  {@render children?.({ data: bang(data), })}
{/if}
