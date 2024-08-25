<script lang="ts">
import { page } from '$app/stores';
import { Logger } from '@spectacular/utils';
import type { GraphQLError } from 'graphql';
import { AlertTriangle } from 'lucide-svelte';
import { fade } from 'svelte/transition';

const log = new Logger('graphql:error:client');
export let errors: readonly Partial<GraphQLError>[] | undefined | null;
log.error({ errors });
</script>

<!-- Houdini GraphQL Errors -->
{#if errors && errors.length}
  <aside class="alert my-2 variant-filled-warning" class:variant-filled-error={$page.status >= 400} transition:fade|local={{ duration: 200 }}>
    <div class="alert-message">
      <ul class="list">
        {#each errors as error}
          <li>
            <span><AlertTriangle /></span>
             <span class="uppercase font-bold">{error.extensions?.code}:</span><span class="flex-auto">{error.message}</span>
          </li>
        {/each}
      </ul>
    </div>
  </aside>
{/if}
