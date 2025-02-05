<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import type { PageData } from './$houdini';

export let data: PageData;

// Reactivity
let { NotificationsData } = data;
$: ({ NotificationsData } = data);
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
      let:data={{ notifications }}
    >
      <pre class="pre">{JSON.stringify(notifications, null, 2)}</pre>
    </MaybeError>
  </section>
</div>
