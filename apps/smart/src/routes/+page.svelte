<script lang="ts">
import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
import * as Breadcrumb from '@spectacular/ui/components/breadcrumb';
import { Separator } from '@spectacular/ui/components/separator';
import * as Sidebar from '@spectacular/ui/components/sidebar';
</script>

<svelte:head>
    <title>Smart | Dashboard</title>
</svelte:head>

<div class="grid auto-rows-min gap-4 md:grid-cols-3">
  <div class="aspect-video bg-muted/50 rounded-xl"></div>
  <div class="aspect-video bg-muted/50 rounded-xl"></div>
  <div class="aspect-video bg-muted/50 rounded-xl"></div>
</div>
<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
