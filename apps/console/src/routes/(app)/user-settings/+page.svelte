<script lang="ts">
import * as Smart from '@spectacular/smart';
import FeatureFlags from './components/feature-flags.svelte';
</script>

<svelte:head>
  <title>Datablocks | Settings</title>
  <meta name="description" content="User Settings" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">User Settings</h1>
    <p>Here you can change user settings</p>
  </section>

  <div class="page-section">
    <h3 class="h2">AI Settings</h3>
    <p>Update AI model settings</p>
    <Smart.Settings />
  </div>
  <div class="page-section">
    <h3 class="h2">Feature Flags</h3>
    <p>Update Feature Flags</p>
    <FeatureFlags />
  </div>
</div>
