<script lang="ts">
import DotsHorizontal from 'svelte-radix/DotsHorizontal.svelte';
import { Button } from '@spectacular/ui/components/button';
import * as DropdownMenu from '@spectacular/ui/components/dropdown-menu';

let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<DotsHorizontal class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				Copy payment ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>View customer</DropdownMenu.Item>
		<DropdownMenu.Item>View payment details</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
