<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { resize } from '@svelte-put/resize';
	import { Badge, Card, Hr, Input } from 'flowbite-svelte';
	import { afterUpdate, beforeUpdate } from 'svelte';
	import * as eliza from './elizabot';

	let div: HTMLElement;
	let autoscroll: boolean;

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	let comments: { author: string; text: string; placeholder?: boolean }[] = [
		{ author: 'eliza', text: 'How do you do. Please tell me your problem.' }
	];

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const text = (event.target as HTMLButtonElement).value;
			if (!text) return;

			comments = comments.concat({
				author: 'user',
				text
			});

			(event.target as HTMLButtonElement).value = '';

			const reply = eliza.answer(text);

			setTimeout(() => {
				comments = comments.concat({
					author: 'eliza',
					text: '...',
					placeholder: true
				});

				setTimeout(() => {
					comments = comments
						.filter((comment) => !comment.placeholder)
						.concat({
							author: 'eliza',
							text: reply
						});
				}, 500 + Math.random() * 500);
			}, 200 + Math.random() * 200);
		}
	}
</script>

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Eliza Chat" />
</svelte:head>

<div
	class="max-w-sm"
	use:resize
	use:draggable={{ axis: 'both', bounds: 'parent', handle: '.handle' }}
>
	<Card padding="lg" class="chat h-96">
		<div class="flex justify-between"
			><h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Eliza Chat</h3><Badge
				large={true}
				color="pink">Drag Me</Badge
			></div
		>
		<Hr class="my-8" height="h-px" />
		<div class="scrollable" bind:this={div}>
			{#each comments as comment}
				<article class={comment.author}>
					<span>{comment.text}</span>
				</article>
			{/each}
		</div>
		<Input
			on:keydown={handleKeydown}
			type="text"
			placeholder="Type here"
			color="green"
			size="lg"
		/>
	</Card>
</div>

<style>
	.handle {
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: grab;
	}

	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-width: 320px;
	}

	.scrollable {
		flex: 1 1 auto;
		/* border-top: 1px solid #eee; */
		margin: 0 0 0.5em 0;
		overflow-y: auto;
	}

	article {
		margin: 0.5em 0;
	}

	.user {
		text-align: right;
	}

	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.eliza span {
		background-color: #eee;
		border-radius: 1em 1em 1em 0;
	}

	.user span {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
	}
</style>
