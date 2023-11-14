<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let nextId = 1;
	let todos = [
		{
			id: 0,
			name: 'Do Something...'
		}
	];

	const addTodo = (todo: string) => {
		todos.push({
			id: nextId,
			name: todo
		});
		nextId += 1;
		todos = todos;
	};

	const removeTodo = (todoId: number) => {
		const idx = todos.findIndex((todo) => todo.id === todoId);
		todos.splice(idx, 1);
		todos = todos;
	};

	let nTodo = '';
</script>

<div>
	{#each todos as todo}
		<div
			class="variant-filled-surface my-2 flex w-[500px] flex-row items-center justify-between p-4"
			in:fly={{ y: 100, duration: 500 }}
			out:fade
		>
			<h3 class="text-md font-light">
				{todo.name}
			</h3>
			<button
				class="btn variant-filled-error"
				type="button"
				on:click={() => removeTodo(todo.id)}>Remove</button
			>
		</div>
	{/each}

	<div class="w-[500px]">
		<label for="nTodo" class="block pt-10 text-sm font-extralight">Add Todo</label>
		<input type="text" name="nTodo" bind:value={nTodo} class="variant-soft-surface w-full" />
	</div>
	<div class="flex flex-row gap-4 pt-4">
		<button type="button" on:click={() => addTodo(nTodo)} class="btn variant-filled-secondary"
			>Add Todo</button
		>
		<a href="/experiments/animations" class="btn bg-secondary-100 text-surface-900">Home</a>
		<a
			href="https://svelte.dev/docs/svelte-animate"
			target="_blank"
			class="btn bg-secondary-100 text-surface-900">Learn More</a
		>
	</div>
</div>
