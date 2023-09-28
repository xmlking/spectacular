<script lang="ts">
	import type { PageData } from './$types';
	import type { SEOWebPage } from '@sveltinio/seo/types';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { website } from '$config/website.js';
	import { PageMetaTags, JsonLdWebPage, JsonLdBreadcrumbs } from '@sveltinio/seo';
	import { Breadcrumbs } from '@sveltinio/widgets';
	import { canonicalPageUrl, getFavicon, capitalizeFirstLetter } from '$lib/utils/strings.js';

	export let data: PageData;

	const mdName = 'category';
	const mdPageDescription = 'Here the description for the Category index page.';

	const categoryIndexPage: SEOWebPage = {
		url:   canonicalPageUrl($page.url.pathname, website.baseURL),
		title: capitalizeFirstLetter(mdName),
		description: mdPageDescription,
		image: getFavicon(website)
	};

	$: ({ metadata } = data);
</script>

<PageMetaTags data={ categoryIndexPage } />
<JsonLdWebPage data={ categoryIndexPage } />
<JsonLdBreadcrumbs url={$page.url.href} />

<div class="page-wrapper">
	<Breadcrumbs url={$page.url.href} />
	<div class="page-wrapper__content">
		<h1>Grouped by Category</h1>
		{#if metadata.length != 0}
			{#each metadata as category }
			<h2>
				<a data-sveltekit-preload-data="hover" href="{base}/posts/category/{ category.name}">{ category.name}</a>
			</h2>
			<ul>
				{#each category.items as item}
					<li>
						<a data-sveltekit-preload-data="hover" href="{base}/posts/{item.slug}">{item.title}</a>
					</li>
				{/each}
			</ul>
			{/each}
		{:else}
			<h2 class="message message--warning">
			Please, check all your content ensuring the YAML frontmatter contains "<i>category</i>".
			</h2>
		{/if}
	</div>
</div>
