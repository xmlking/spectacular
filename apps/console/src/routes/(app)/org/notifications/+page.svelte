<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import type { PageData } from './$houdini';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

// Reactivity
// let { NotificationsData } = $state(data);
let { NotificationsData } = $derived(data);
</script>

<svelte:head>
  <title>Datablocks | Notifications</title>
  <meta name="description" content="Notifications" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Notifications</h1>
    <p>Notifications</p>
  </section>

  <section class="space-y-4">
    <MaybeError
      debug={true}
      entityName="Memberships"
      result={$NotificationsData}

    >
      {#snippet children({ data: { notifications } })}
            <pre class="pre">{JSON.stringify(notifications, null, 2)}</pre>
                {/snippet}
        </MaybeError>
  </section>
</div>
