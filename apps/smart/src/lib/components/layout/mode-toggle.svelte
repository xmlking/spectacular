<script lang="ts">
import { buttonVariants } from '@repo/ui/components/ui/button/index.js';
import * as DropdownMenu from '@repo/ui/components/ui/dropdown-menu/index.js';
import { cn } from '@repo/ui/utils.js';
import { resetMode, setMode } from 'mode-watcher';
import Moon from 'svelte-radix/Moon.svelte';
import Sun from 'svelte-radix/Sun.svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={cn(buttonVariants({ variant: "ghost", class: "w-9 px-0" }))}>
		<Sun
			class="dark:-roate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
