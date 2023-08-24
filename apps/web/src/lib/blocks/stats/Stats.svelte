<script lang="ts">
	import { IconOutline } from 'svelte-heros-v2';
</script>

<div class="max-w-7xl">
	<h3 class="text-lg font-medium leading-6 text-gray-900"> Last 30 days </h3>
	<dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
		<div class="flex flex-col overflow-hidden rounded-lg bg-white shadow">
			<div class="flex-grow px-4 py-5 sm:p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0 rounded-md bg-indigo-500 p-3">
						<svg
							class="h-6 w-6 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dt class="truncate text-sm font-medium text-gray-500">
							Total Subscribers
						</dt>
						<dd class="flex items-baseline">
							<div class="text-2xl font-semibold text-gray-900"> 8,892 </div>

							<div
								class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
							>
								<svg
									class="h-5 w-5 flex-shrink-0 self-center text-green-500"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="sr-only"> Increased by </span>
								122
							</div>
						</dd>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a href={'#'} class="font-medium text-indigo-600 hover:text-indigo-500">
						View all<span class="sr-only"> Total Subscribers stats</span></a
					>
				</div>
			</div>
		</div>

		<div class="flex flex-col overflow-hidden rounded-lg bg-white shadow">
			<div class="flex-grow px-4 py-5 sm:p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0 rounded-md bg-indigo-500 p-3">
						<IconOutline name="shield-exclamation-outline" color="#ffffff" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dt class="truncate text-sm font-medium text-gray-500">
							Avg. Block Rate
						</dt>
						<dd class="flex items-baseline">
							<di class="text-2xl font-semibold text-gray-900"> 38.12% </di>

							<div
								class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
							>
								<svg
									class="h-5 w-5 flex-shrink-0 self-center text-green-500"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="sr-only"> Increased by </span>
								5.4%
							</div>
						</dd>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a href={'#'} class="font-medium text-indigo-600 hover:text-indigo-500">
						View all<span class="sr-only"> Avg. Open Rate stats</span></a
					>
				</div>
			</div>
		</div>

		<div class="flex flex-col overflow-hidden rounded-lg bg-white shadow">
			<div class="flex-grow px-4 py-5 sm:p-6">
				<div class="flex items-center">
					<div class="flex-shrink-0 rounded-md bg-indigo-500 p-3">
						<svg
							class="h-6 w-6 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dt class="truncate text-sm font-medium text-gray-500">
							Total Threat Blocked
						</dt>
						<dd class="flex items-baseline">
							<div class="text-2xl font-semibold text-gray-900"> 87,343 </div>

							<div
								class="ml-2 flex items-baseline text-sm font-semibold text-red-600"
							>
								<svg
									class="h-5 w-5 flex-shrink-0 self-center text-red-500"
									fill="currentColor"
									viewBox="0 0 20 20"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								<span class="sr-only"> Decreased by </span>
								3,873
							</div>
						</dd>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-4 sm:px-6">
				<div class="text-sm">
					<a href={'#'} class="font-medium text-indigo-600 hover:text-indigo-500">
						View all<span class="sr-only"> Avg. Click Rate stats</span></a
					>
				</div>
			</div>
		</div>
	</dl>
</div>
