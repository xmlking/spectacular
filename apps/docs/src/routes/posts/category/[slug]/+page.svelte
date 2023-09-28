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
	const mdPageDescription = 'Here the description for the Category slug page.';

	const categorySlugPage: SEOWebPage = {
		url:   canonicalPageUrl($page.url.pathname, website.baseURL),
		title: capitalizeFirstLetter(mdName),
		description: mdPageDescription,
		image: getFavicon(website)
	};

	$: ({ slug, metadata } = data);
	$: itemsCounter = metadata.items.length;
</script>

<PageMetaTags data={ categorySlugPage } />
<JsonLdWebPage data={ categorySlugPage } />
<JsonLdBreadcrumbs url={$page.url.href} />

<div class="page-wrapper">
	<Breadcrumbs url={$page.url.href} />
	<div class="page-wrapper__content">
		{#if metadata}
			<h2>{slug}&nbsp;<span>[ Total: {itemsCounter} ]</span></h2>
			<ul>
				{#each metadata.items as item}
					<li><a data-sveltekit-preload-data="hover" href="{base}/posts/{item.slug}">{item.title}</a></li>
				{/each}
			</ul>
		{:else}
			<h2 class="message message--warning">
				Please, check all your content files ensuring the YAML frontmatter contains "<i>Category</i>".
			</h2>
		{/if}
	</div>
</div>
