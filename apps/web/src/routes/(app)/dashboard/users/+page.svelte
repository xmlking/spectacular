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
		<ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow dark:bg-gray-600"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Jane Cooper</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Paradigm Representative</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Cody Fisher</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Lead Security Associate</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Esther Howard</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Assurance Administrator</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Jenny Wilson</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Chief Accountability Analyst</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Kristin Watson</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Investor Data Orchestrator</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Cameron Williamson</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Product Infrastructure Executive</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Courtney Henry</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Investor Factors Associate</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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

			<li
				class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
			>
				<div class="flex flex-1 flex-col p-8">
					<img
						class="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-black"
						src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
						alt=""
					/>
					<h3 class="mt-6 text-sm font-medium text-gray-900">Theresa Webb</h3>
					<dl class="mt-1 flex flex-grow flex-col justify-between">
						<dt class="sr-only">Title</dt>
						<dd class="text-sm text-gray-500">Global Division Officer</dd>
						<dt class="sr-only">Role</dt>
						<dd class="mt-3">
							<span
								class="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
								>Admin</span
							>
						</dd>
					</dl>
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
