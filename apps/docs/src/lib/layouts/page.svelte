<script lang="ts">
	import { OpenGraphType, TwitterCardType } from '@sveltinio/seo/types';
	import { PageMetaTags, JsonLdWebPage, JsonLdBreadcrumbs } from '@sveltinio/seo';
	import { canonicalPageUrl, getFavicon } from '$lib/utils/strings.js';
	import { page } from '$app/stores';
	import { website } from '$config/website.js';

	/* All values defined in frontmatter are available as props.*/
	export let title;
	export let headline;
	export let keywords;

	const mdPage = {
		url: canonicalPageUrl($page.url.pathname, website.baseURL),
		title: title,
		description: headline,
		keywords: keywords || website.keywords,
		image: getFavicon(website),
		opengraph: {
			type: OpenGraphType.Article
		},
		twitter: {
			type: TwitterCardType.Summary
		}
	};
</script>

<PageMetaTags data={mdPage} />
<JsonLdWebPage data={mdPage} />
<JsonLdBreadcrumbs url={$page.url.href} />

<!-- Page markup-->
<section class="page">
	<div class="content">
		<div class="markdown-body">
			<!-- the mdsvex content will be slotted in here -->
			<slot />
		</div>
	</div>
</section>
