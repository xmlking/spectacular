<script lang="ts">
import CreateOrganizationForm from '$lib/components/organizations/create-organizations-form.svelte';
import { Logger } from '@spectacular/utils';

const log = new Logger('admin:organizations:create:page');
</script>

<svelte:head>
  <title>Organizations</title>
  <meta name="description" content="Create Organization" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Organizations</h1>
    <p>Create Organization</p>
  </section>
  <CreateOrganizationForm />
</div>
