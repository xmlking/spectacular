<script lang="ts">
import * as Icon from '@repo/ui/components/icons/index.js';
import * as Breadcrumb from '@repo/ui/components/ui/breadcrumb/index.js';
import { buttonVariants } from '@repo/ui/components/ui/button/index.js';
import { Separator } from '@repo/ui/components/ui/separator/index.js';
import * as Sidebar from '@repo/ui/components/ui/sidebar/index.js';
import { cn } from '@repo/ui/utils.js';
import { localizeHref } from '$i18n/runtime';
import CommandMenu from '$lib/components/layout/command-menu.svelte';
import ModeToggle from '$lib/components/layout/mode-toggle.svelte';
import { siteConfig } from '$lib/config/site.js';
</script>

<header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
  <div class="flex items-center gap-2 px-4">
    <Sidebar.Trigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item class="hidden md:block">
          <Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator class="hidden md:block" />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  </div>

  <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end  mr-2">
    <div class="w-full flex-1 md:w-auto md:flex-none">
      <CommandMenu />
    </div>
    <nav class="flex items-center">
      <a href={localizeHref(siteConfig.links.github)} target="_blank" rel="noopener noreferrer">
        <div
          class={cn(
            buttonVariants({
              size: "sm",
              variant: "ghost",
            }),
            "h-8 w-8 px-0"
          )}
        >
          <Icon.GitHub class="size-4" />
          <span class="sr-only">GitHub</span>
        </div>
      </a>
      <a href={localizeHref(siteConfig.links.twitter)} target="_blank" rel="noreferrer">
        <div
          class={cn(
            buttonVariants({
              size: "sm",
              variant: "ghost",
            }),
            "h-8 w-8 px-0"
          )}
        >
          <Icon.Twitter class="size-3 fill-current" />
          <span class="sr-only">X (formerly known as Twitter)</span>
        </div>
      </a>
      <ModeToggle />
    </nav>
</div>

</header>
