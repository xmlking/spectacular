<script lang="ts">
import { addTodo, deleteTodo, getTodos, toggleTodo } from './todos.remote';

// this behaves like a regular function but uses RPC
const todos = getTodos();
</script>

<main>
	<h1>Todo App</h1>

	<!-- using enhance to customize how the form is progressively enhanced -->
	<form
		{...addTodo.enhance(async ({ form, submit, data }) => {
			// get form data
			const text = data.get('text')!.toString().trim()

			// optimistic UI update
      await submit().updates(getTodos().withOverride( todos => [...todos, { id: '0', text, done: false }]))
    })}
	>
		<input type="text" name="text" placeholder="Add todo" autocomplete="off" />
		<button type="submit">Add</button>
		{#if addTodo.error}
			<p class="error">{addTodo.error.message}</p>
		{/if}
	</form>

	<ul>
		<!-- async svelte ❤️ -->
		{#each await todos as todo}
			<!-- useful when you have multiple forms that use the same remote form action for reuse -->
			{@const remove = deleteTodo.for(todo.id)}

			<li>
				<label>
					<input
						type="checkbox"
						checked={todo.done}
						onchange={async () => {
              await toggleTodo(todo.id).updates(getTodos().withOverride( todos => todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t))))
						}}
					/>
					<span class={{ done: todo.done }}>{todo.text}</span>
				</label>

				<!-- using enhance to customize how the form is progressively enhanced -->
				<form
					{...remove.enhance(async ({ submit }) => {
						// optimistic UI update
            await submit().updates(getTodos().withOverride( todos => todos.filter((t) => t.id !== todo.id)))
					})}
				>
					<!-- this seems to have bugs 🐛  -->
					{#if remove.error}
						<span class="error">{remove.error.message}</span>
					{/if}
					<button name="id" value={todo.id}>Delete</button>
				</form>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: #fafafa;
	}
	form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	input[type='text'] {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid #bbb;
		border-radius: 4px;
	}
	button {
		padding: 0.5rem 1rem;
		border: none;
		background: #007acc;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		background: #005fa3;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}
	.pending {
		opacity: 0.5;
		pointer-events: none;
	}
	.done {
		text-decoration: line-through;
		color: #888;
	}
  .error {
		color: red;
	}
	label {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
