<script lang="ts" generics="T">
import type { QueryResult } from '$houdini';
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell, GraphQLErrors, NotFound, SomethingWentWrong } from '$lib/ui/components';
import SuperDebug from 'sveltekit-superforms';

export let entityName: string;
export let result: QueryResult<T>;
export let debug = false;

// Variables
const loadingState = getLoadingState();

// Functions
// biome-ignore lint/style/noNonNullAssertion: <ok>
const bang = <T>(x: T) => x!;

// Reactivity
$: ({ data, errors, fetching } = result);
$: loadingState.setFormLoading(fetching);
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
  <slot data={bang(data)} />
{/if}
