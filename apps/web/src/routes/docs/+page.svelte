<script lang="ts">
	export let data;
	const categoryUrl = (category: string) => {
		return `/docs?category=${category}`;
	};

	const postUrl = (slug: string) => {
		return `/docs/${slug}`;
	};
	let searchParam: null | string = null;
	$: filteredPosts = data.posts.filter((post) => {
		if (searchParam === null) return true;
		return post.title.toLowerCase().includes(searchParam.toLowerCase());
	});
</script>

<div class="container mx-auto mt-12 flex h-full w-full flex-col space-y-8">
	<input
		class="input !border-warning-500 !border-opacity-50"
		type="search"
		name="autocomplete-search"
		bind:value={searchParam}
		placeholder="Search..."
	/>
	<section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredPosts as post}
			<a class="unstyled" href={postUrl(post.slug)}>
				<article class="card card-hover flex flex-col overflow-hidden">
					{#if post.headerImage !== undefined}
						<a class="unstyled" href={postUrl(post.slug)}>
							<img class="aspect-[21/9] w-full" src={post.headerImage} alt="" />
						</a>
					{:else}
						<header>
							<img class="aspect-[21/9] w-full" src="/default.jpg" alt="" />
						</header>
					{/if}
					<div class="space-y-4 p-4">
						<div class="flex justify-start">
							{#each post.categories as category}
								<a class="unstyled" href={categoryUrl(category)}>
									<div
										class="border-warning-400 rounded-md border border-solid p-1 px-2 hover:border-double"
									>
										<h4 class="text-warning-500 text-sm">{category}</h4>
									</div>
								</a>
							{/each}
						</div>
						<h1 class="text-secondary-700 text-center text-xl">{post.title}</h1>
						<p>{post.description}</p>
						<p>{post.date}</p>
					</div>
				</article>
			</a>
		{/each}
	</section>
</div>
