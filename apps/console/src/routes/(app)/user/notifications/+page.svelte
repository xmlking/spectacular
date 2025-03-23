<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import type { PageData } from './$houdini';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

// Reactivity
// let { UserNotificationsData } = $state(data);
let { UserNotificationsData } = $derived(data);
</script>

<svelte:head>
  <title>Datablocks | User Notifications</title>
  <meta name="description" content="User Notifications" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">User Notifications</h1>
    <p>User Notifications</p>
  </section>

  <section class="space-y-4">
    <MaybeError
      debug={true}
      entityName="Memberships"
      result={$UserNotificationsData}

    >
      {#snippet children({ data: { user } })}
            <pre class="pre">{JSON.stringify(user, null, 2)}</pre>
                {/snippet}
        </MaybeError>
  </section>
</div>
