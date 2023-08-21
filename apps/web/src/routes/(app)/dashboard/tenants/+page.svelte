<script lang="ts">
	import { Button, Input, Navbar, NavBrand, TableSearch } from 'flowbite-svelte';
	import { MagnifyingGlassCircle, Users } from 'svelte-heros-v2';

	let itemEx = [
		['Apple MacBook Pro 17"', 'Sliver', 'Laptop', '$2999', '<a href="/">Edit</a>'],
		['Microsoft Surface Pro', 'White', 'Laptop PC', '$1999', '<a href="/">Edit</a>'],
		['Magic Mouse 2', 'Black', 'Accessories', '$99', '<a href="/">Edit</a>']
	];
	let headerEx = [' Product name', 'Color', 'Category', 'Price', 'Edit'];

	// Table
	let divClass = '';
</script>

<svelte:head>
	<title>Users</title>
	<meta name="description" content="Users" />
</svelte:head>

<Navbar let:hidden let:toggle border={true} rounded={true}>
	<NavBrand>
		<Users />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			Users
		</span>
	</NavBrand>
	<div>
		<div class="relative hidden md:block">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<MagnifyingGlassCircle />
			</div>
			<Input id="search-navbar" class="pl-10" placeholder="Search Users..." />
		</div>
	</div>
	<Button>Add User</Button>
</Navbar>

<TableSearch menuItems={itemEx} header={headerEx} {divClass} placeholder="Search by user name" />

<!--<Table header={headerEx} {divClass} >-->
<!--	<TableDefaultRow items={itemEx} rowState="hover" html />-->
<!--</Table>-->

<div class="bg-gray-100 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
				<div class="flex w-full items-center justify-between space-x-6 p-6">
					<div class="flex-1 truncate">
						<div class="flex items-center space-x-3">
							<h3 class="truncate text-sm font-medium text-gray-900">Jane Cooper</h3>
							<span
								class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
								>Admin</span
							>
						</div>
						<p class="mt-1 truncate text-sm text-gray-500"
							>Regional Paradigm Technician</p
						>
					</div>
					<img
						class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
						src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200">
						<div class="flex w-0 flex-1">
							<a
								href={'#'}
								class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									/>
									<path
										d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
									/>
								</svg>
								<span class="ml-3">Email</span>
							</a>
						</div>
						<div class="-ml-px flex w-0 flex-1">
							<a
								href={'#'}
								class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<span class="ml-3">Call</span>
							</a>
						</div>
					</div>
				</div>
			</li>

			<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
				<div class="flex w-full items-center justify-between space-x-6 p-6">
					<div class="flex-1 truncate">
						<div class="flex items-center space-x-3">
							<h3 class="truncate text-sm font-medium text-gray-900">Cody Fisher</h3>
							<span
								class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
								>Admin</span
							>
						</div>
						<p class="mt-1 truncate text-sm text-gray-500">Product Directives Officer</p
						>
					</div>
					<img
						class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
						src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200">
						<div class="flex w-0 flex-1">
							<a
								href={'#'}
								class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									/>
									<path
										d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
									/>
								</svg>
								<span class="ml-3">Email</span>
							</a>
						</div>
						<div class="-ml-px flex w-0 flex-1">
							<a
								href={'#'}
								class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<span class="ml-3">Call</span>
							</a>
						</div>
					</div>
				</div>
			</li>

			<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
				<div class="flex w-full items-center justify-between space-x-6 p-6">
					<div class="flex-1 truncate">
						<div class="flex items-center space-x-3">
							<h3 class="truncate text-sm font-medium text-gray-900">Esther Howard</h3
							>
							<span
								class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
								>Admin</span
							>
						</div>
						<p class="mt-1 truncate text-sm text-gray-500">Forward Response Developer</p
						>
					</div>
					<img
						class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
						src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200">
						<div class="flex w-0 flex-1">
							<a
								href={'#'}
								class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									/>
									<path
										d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
									/>
								</svg>
								<span class="ml-3">Email</span>
							</a>
						</div>
						<div class="-ml-px flex w-0 flex-1">
							<a
								href={'#'}
								class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<span class="ml-3">Call</span>
							</a>
						</div>
					</div>
				</div>
			</li>

			<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
				<div class="flex w-full items-center justify-between space-x-6 p-6">
					<div class="flex-1 truncate">
						<div class="flex items-center space-x-3">
							<h3 class="truncate text-sm font-medium text-gray-900">Jenny Wilson</h3>
							<span
								class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
								>Admin</span
							>
						</div>
						<p class="mt-1 truncate text-sm text-gray-500">Central Security Manager</p>
					</div>
					<img
						class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
						src="https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200">
						<div class="flex w-0 flex-1">
							<a
								href={'#'}
								class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									/>
									<path
										d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
									/>
								</svg>
								<span class="ml-3">Email</span>
							</a>
						</div>
						<div class="-ml-px flex w-0 flex-1">
							<a
								href={'#'}
								class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<span class="ml-3">Call</span>
							</a>
						</div>
					</div>
				</div>
			</li>

			<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
				<div class="flex w-full items-center justify-between space-x-6 p-6">
					<div class="flex-1 truncate">
						<div class="flex items-center space-x-3">
							<h3 class="truncate text-sm font-medium text-gray-900"
								>Kristin Watson</h3
							>
							<span
								class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
								>Admin</span
							>
						</div>
						<p class="mt-1 truncate text-sm text-gray-500"
							>Lead Implementation Liaison</p
						>
					</div>
					<img
						class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
						src="https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200">
						<div class="flex w-0 flex-1">
							<a
								href={'#'}
								class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									/>
									<path
										d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
									/>
								</svg>
								<span class="ml-3">Email</span>
							</a>
						</div>
						<div class="-ml-px flex w-0 flex-1">
							<a
								href={'#'}
								class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<span class="ml-3">Call</span>
							</a>
						</div>
					</div>
				</div>
			</li>

			<li class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
				<div class="flex w-full items-center justify-between space-x-6 p-6">
					<div class="flex-1 truncate">
						<div class="flex items-center space-x-3">
							<h3 class="truncate text-sm font-medium text-gray-900"
								>Cameron Williamson</h3
							>
							<span
								class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
								>Admin</span
							>
						</div>
						<p class="mt-1 truncate text-sm text-gray-500"
							>Internal Applications Engineer</p
						>
					</div>
					<img
						class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
						src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
				</div>
				<div>
					<div class="-mt-px flex divide-x divide-gray-200">
						<div class="flex w-0 flex-1">
							<a
								href={'#'}
								class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									/>
									<path
										d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
									/>
								</svg>
								<span class="ml-3">Email</span>
							</a>
						</div>
						<div class="-ml-px flex w-0 flex-1">
							<a
								href={'#'}
								class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
							>
								<svg
									class="h-5 w-5 text-gray-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									/>
								</svg>
								<span class="ml-3">Call</span>
							</a>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>
