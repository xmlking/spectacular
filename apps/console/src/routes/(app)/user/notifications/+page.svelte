<script lang="ts">
import MaybeError from '$lib/components/layout/maybe-error.svelte';
import type { PageData } from './$houdini';

export let data: PageData;

// Reactivity
let { UserNotificationsData } = data;
$: ({ UserNotificationsData } = data);
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
      let:data={{ user }}
    >
      <pre class="pre">{JSON.stringify(user, null, 2)}</pre>
    </MaybeError>
  </section>
</div>
