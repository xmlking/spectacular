<script lang="ts">
import Preview from '$lib/components/preview.svelte';
import { GripHorizontal, GripVertical } from 'lucide-svelte';
import { Pane, PaneGroup, PaneResizer } from 'paneforge';
</script>

<svelte:head>
	<title>Paneforge</title>
	<meta name="description" content="Showcase Paneforge" />
</svelte:head>

<Preview>
	<PaneGroup direction="horizontal">
		<Pane defaultSize={50}>
			<div class="bg-muted flex h-[400px] items-center justify-center rounded-lg p-6">
				<span class="font-semibold">One</span>
			</div>
		</Pane>
		<PaneResizer class="bg-background relative flex w-2 items-center justify-center">
			<div class="bg-brand z-10 flex h-7 w-5 items-center justify-center rounded-sm border">
				<GripVertical class="size-4 text-black" weight="bold" />
			</div>
		</PaneResizer>
		<Pane defaultSize={50}>
			<PaneGroup direction="vertical">
				<Pane defaultSize={50}>
					<div class="bg-muted flex h-full items-center justify-center rounded-lg p-6">
						<span class="font-semibold">Two</span>
					</div>
				</Pane>
				<PaneResizer class="bg-background relative flex h-2 items-center justify-center">
					<div
						class="bg-brand z-10 flex h-5 w-7 items-center justify-center rounded-sm border"
					>
						<GripHorizontal class="size-4 text-black" weight="bold" />
					</div>
				</PaneResizer>
				<Pane defaultSize={50}>
					<div class="bg-muted flex h-full items-center justify-center rounded-lg p-6">
						<span class="font-semibold">Three</span>
					</div>
				</Pane>
			</PaneGroup>
		</Pane>
	</PaneGroup>
</Preview>
