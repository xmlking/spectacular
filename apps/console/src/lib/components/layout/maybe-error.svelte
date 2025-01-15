<script lang="ts" generics="T">
import { getLoadingState } from '$lib/stores/loading';
import { DebugShell, NotFound, SomethingWentWrong, GraphQLErrors } from '@spectacular/skeleton/components';
import SuperDebug from 'sveltekit-superforms';
import { type QueryResult } from '$houdini';

export let entityName: string;
export let result: QueryResult<T>;
export let debug: boolean = false;

// Variables
const loadingState = getLoadingState();

// Functions
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
