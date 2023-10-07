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
			class="p-4 flex flex-row items-center w-[500px] justify-between variant-filled-surface my-2"
			in:fly={{ y: 100, duration: 500 }}
			out:fade
		>
			<h3 class="font-light text-md">
				{todo.name}
			</h3>
			<button class="btn variant-filled-error" type="button" on:click={() => removeTodo(todo.id)}
				>Remove</button
			>
		</div>
	{/each}

	<div class="w-[500px]">
		<label for="nTodo" class="block font-extralight text-sm pt-10">Add Todo</label>
		<input type="text" name="nTodo" bind:value={nTodo} class="w-full variant-soft-surface" />
	</div>
	<div class="pt-4 flex flex-row gap-4">
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
