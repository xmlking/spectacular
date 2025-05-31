<script lang="ts">
import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
import * as Breadcrumb from '@repo/ui/components/ui/breadcrumb/index.js';
import { Separator } from '@repo/ui/components/ui/separator/index.js';
import * as Sidebar from '@repo/ui/components/ui/sidebar/index.js';
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
