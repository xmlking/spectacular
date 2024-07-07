<script lang="ts">
import { page } from '$app/stores';
import { AlertTriangle } from 'lucide-svelte';
import { fade } from 'svelte/transition';
export let errors: { message: string }[] | undefined;
</script>

<!-- Houdini GraphQL Errors -->
{#if errors && errors.length}
  <aside class="alert mt-6 variant-filled-warning" class:variant-filled-error={$page.status >= 400} transition:fade|local={{ duration: 200 }}>
    <div class="alert-message">
      <ul class="list">
        {#each errors as error}
          <li>
            <span><AlertTriangle /></span>
            <span class="flex-auto">{error}</span>
          </li>
        {/each}
      </ul>
    </div>
  </aside>
{/if}
