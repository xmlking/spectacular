<script lang="ts">
	import { browser } from '$app/environment';
	import { ContextMenu, SplitPanel } from '$lib/components';
	import { writable } from 'svelte/store';

	let width = browser ? window.innerWidth : 1000;
	let selected_view = 0;

	$: mobile = writable(false);
	$: $mobile = width < 768;
</script>

<svelte:head>
	<title>Panel</title>
	<meta name="description" content="Panel demo" />
</svelte:head>

<ContextMenu />

<div class="container" style="--toggle-height: {$mobile ? '4.6rem' : '0px'}">
	<SplitPanel
		type="horizontal"
		min={$mobile ? '0px' : '360px'}
		max={$mobile ? '100%' : '50%'}
		pos={$mobile ? (selected_view === 0 ? '100%' : '0%') : '33%'}
	>
		<section slot="a" class="content" />
		<section slot="b" class:hidden={$mobile && selected_view === 0}>
			<SplitPanel
				type="vertical"
				min={$mobile ? '0px' : '100px'}
				max={$mobile ? '100%' : '50%'}
				pos={$mobile ? (selected_view === 1 ? '100%' : '0%') : '50%'}
			>
				<section slot="a">
					<SplitPanel type="horizontal" min="80px" max="300px" pos="200px">
						<section class="navigator" slot="a" />
						<section class="editor-container" slot="b" />
					</SplitPanel>
				</section>
				<section slot="b" class="preview">
					<div class="content" />
				</section>
			</SplitPanel>
		</section>
	</SplitPanel>
</div>

<style>
	.container {
		height: calc(100% - var(--toggle-height));
		max-height: 100%;
	}
	.content {
		display: flex;
		flex-direction: column;
		min-height: 0;
		height: 100%;
		max-height: 100%;
		background: var(--sk-back-2);
		--menu-width: 5.4rem;
	}
	.navigator {
		position: relative;
		background: var(--sk-back-2);
		display: flex;
		flex-direction: column;
	}
	.navigator button {
		position: relative;
		background: var(--sk-theme-2);
		padding: 0.5rem;
		width: 100%;
		height: 4rem;
		border-right: 1px solid var(--sk-back-4);
		color: white;
		opacity: 1;
	}
	.navigator button:disabled {
		opacity: 0.5;
	}
	.navigator button:not(:disabled) {
		background: var(--sk-theme-1);
	}
	.navigator button.completed {
		background: var(--sk-theme-2);
	}
	.preview {
		display: flex;
		flex-direction: column;
	}
	.content {
		position: relative;
	}
	iframe {
		width: 100%;
		height: 100%;
		flex: 1;
		resize: none;
		box-sizing: border-box;
		border: none;
		background: var(--sk-back-2);
	}
	.editor-container {
		position: relative;
		background-color: var(--sk-back-3);
	}
	.hidden {
		display: none;
	}
</style>
