<script lang="ts">
import { Logger } from '@repo/utils';
import CreateOrganizationForm from '$lib/components/organizations/create-organizations-form.svelte';

const log = new Logger('user:organizations:create:page');
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
