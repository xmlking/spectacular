<!--
@component
Display a data table using the `svelte-headless-table` library.
See: https://svelte-headless-table.bryanmylee.com

The expected `tableViewModel` prop is the result of calling `table.createViewModel()`.
See: https://svelte-headless-table.bryanmylee.com/docs/api/create-view-model

#### Usage:
```tsx
  <DataTable {tableViewModel} hasSearch={true|false} hasPagination={true|false} />
```

// TODO https://github.com/tradingstrategy-ai/frontend/blob/master/src/lib/components/datatable/DataTable.svelte
-->
<script lang="ts">
	import { Button, ButtonGroup, ChevronDown, ChevronUp, Select } from 'flowbite-svelte';
	import type { TableViewModel } from 'svelte-headless-table';
	import { Render, Subscribe } from 'svelte-headless-table';

	export let tableViewModel: TableViewModel<any, any>;
	export let hasSearch = true;
	export let hasPagination = true;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = tableViewModel;
	const { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;
	const { filterValue } = pluginStates.tableFilter;

	let rows = [
		{ value: 5, name: '5' },
		{ value: 10, name: '10' },
		{ value: 20, name: '20' },
		{ value: 50, name: '50' },
		{ value: 100, name: '100' }
	];
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	{#if hasSearch}
		<div class="flex items-center justify-between p-4">
			<!-- search text -->
			<div class="p-4">
				<label for="table-search" class="sr-only">Search</label>
				<div class="relative mt-1">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
					>
						<svg
							class="h-5 w-5 text-gray-500 dark:text-gray-400"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"
							/></svg
						>
					</div>
					<input
						bind:value={$filterValue}
						type="text"
						id="table-search"
						class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Search rows..."
					/>
				</div>
			</div>
		</div>
	{/if}
	<table {...$tableAttrs} class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
		<thead
			class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
		>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe attrs={headerRow.attrs()} let:attrs>
					<tr {...attrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe
								attrs={cell.attrs()}
								let:attrs
								props={cell.props()}
								let:props
							>
								<!-- < {...attrs} on:click={props.sort.toggle} class="px-6 py-3" use:props.resize> -->
								<th {...attrs} on:click={props.sort.toggle} class="px-6 py-3">
									<div class="flex items-center">
										<Render of={cell.render()} />
										{#if props.sort.order === 'asc'}
											<ChevronDown size="16" variation="solid" class="ml-1" />
										{:else if props.sort.order === 'desc'}
											<ChevronUp size="16" variation="solid" class="ml-1" />
										{/if}
										{#if props.resize && !props.resize.disabled}
											<div class="resizer" use:props.resize.drag />
										{/if}
									</div>
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe attrs={row.attrs()} let:attrs>
					<tr
						{...attrs}
						class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
					>
						{#each row.cells as cell (cell.id)}
							<Subscribe
								attrs={cell.attrs()}
								let:attrs
								props={cell.props()}
								let:props
							>
								<!-- class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white" -->
								<td
									{...attrs}
									class="px-6 py-4 font-medium text-gray-900 dark:text-white"
									class:matches={props.tableFilter.matches}
								>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
	{#if hasPagination}
		<nav class="flex items-center justify-between p-4" aria-label="Table navigation">
			<span class="flex items-center text-sm text-gray-700 dark:text-gray-400">
				<span class="pr-2">Rows ({$pageSize}): </span>
				<Select items={rows} bind:value={$pageSize} size="sm" class="w-1/6 p-1 text-xs" />
				<span class="pl-4">
					Showing <span class="font-semibold text-gray-900 dark:text-white"
						>{$pageIndex + 1}</span
					>
					out of
					<span class="font-semibold text-gray-900 dark:text-white">{$pageCount}</span> Pages
				</span>
			</span>
			<ButtonGroup>
				<Button on:click={() => $pageIndex--} disabled={!$hasPreviousPage}>Prev</Button>
				<Button on:click={() => $pageIndex++} disabled={!$hasNextPage}>Next</Button>
			</ButtonGroup>
		</nav>
	{/if}
</div>

<style>
	th {
		position: relative;
	}
	.resizer {
		position: absolute;
		top: 0;
		bottom: 0;
		right: -4px;
		width: 8px;
		background: lightgray;
		cursor: col-resize;
		z-index: 1;
	}
</style>
