<script lang="ts">
	// TODO https://github.com/carincon93/sipro-spa/blob/main/resources/js/Shared/Tags.svelte
	import { flip } from 'svelte/animate';

	export let delimiter = ',';
	export let tags = [] as string[];
	export let colour = (tag: string) => {
		if (tag.length <= 0) {
			return 0;
		}
		let h = 0;
		let i = 0;
		while (i < tag.length) {
			h = ((h << 5) - h + tag.charCodeAt(i++)) | 0;
		}
		return 'hsl(' + h / 360 + ', 100%, 80%)';
	};

	let current = '';

	function parseInput() {
		const tagSet = new Set(tags);
		current.split(delimiter).forEach((t) => {
			const clean = t && t.trim();
			clean && clean !== '' && tagSet.add(t);
		});
		current = '';
		sync(tagSet);
	}

	function handleInput({ key, code }) {
		(key === delimiter || code === 'Enter') && parseInput();
	}

	function removeTag(tag: string) {
		const tagSet = new Set(tags);
		tagSet.delete(tag);
		sync(tagSet);
	}

	function sync(tagSet: Set<string>) {
		tags = [...tagSet];
	}
</script>

<div class="tag-input">
	<ul class="tag-list">
		{#each [...tags.values()] as tag (tag)}
			<li
				class="tag"
				animate:flip={{ duration: 200 }}
				style="background-color: {colour(tag)};"
			>
				<span>{tag}</span>
				<button class="remove-button" on:click={() => removeTag(tag)}>⨯</button></li
			>
		{/each}
		<li class="input">
			<input
				class="tag-entry"
				type="text"
				{...$$restProps}
				on:keyup={handleInput}
				on:blur={parseInput}
				bind:value={current}
			/>
			<input type="hidden" {...$$restProps} hidden value={tags} />
		</li>
	</ul>
</div>

<style lang="postcss">
	.tag-input {
		display: flex;
		border: 1px solid grey;
		flex-wrap: wrap;
	}

	.tag-entry {
		border: 0;
		outline: 0;
		display: flex;
		margin: 0;
		padding: 3px 0;
		width: 100%;
	}

	.tag-entry:focus {
		outline: 0;
	}

	.tag-list {
		list-style-type: none;
		display: flex;
		padding: 0;
		margin: 0;
		flex-wrap: wrap;
		flex: 1;
	}

	.tag {
		border-radius: 5px;
		padding: 6px;
		margin: 3px;
		flex-direction: row;
		display: flex;
		align-items: center;
		white-space: nowrap;
	}

	.input {
		background: transparent;
		margin: 0;
		padding: 0;
		width: 100%;
		flex: 1;
		border: 0;
	}

	.tag span {
		line-height: inherit;
	}

	.remove-button {
		border: 0;
		outline: 0;
		background-color: transparent;
		padding: 0;
		margin: 0;
		font-weight: bold;
		margin: 0 3px;
		color: inherit;
	}

	.remove-button:hover {
		transition: color 0.2s ease-in-out;
		color: white;
	}
</style>
