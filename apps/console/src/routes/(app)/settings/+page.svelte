<script lang="ts">
import Settings from '$lib/components/smart/settings.svelte';
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="User Settings" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Setting</h1>
    <p>Here you can change user settings</p>
  </section>

  <div class="page-section">
    <h3 class="h2">AI Settings</h3>
    <p>Update AI model settings</p>
    <Settings />
  </div>
</div>

