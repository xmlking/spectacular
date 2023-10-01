<script lang="ts">
	import type { SEOWebPage } from '@sveltinio/seo/types';
	import { OpenGraphType, TwitterCardType } from '@sveltinio/seo/types';
	import { PageMetaTags, JsonLdWebPage, JsonLdBreadcrumbs } from '@sveltinio/seo';
	import { canonicalPageUrl, capitalizeFirstLetter, getFavicon } from '$lib/utils/strings.js';
	import { page } from '$app/stores';
	import { website } from '$config/website.js';

	const title = 'contact';

	const pageDescription = `Here the description for the Contact page.`;
	// page keywords as comma separeted values
	const pageKeywords: Array<string> = [];

	const contactPage: SEOWebPage = {
		url: canonicalPageUrl($page.url.pathname, website.baseURL),
		title: capitalizeFirstLetter(title),
		description: pageDescription,
		keywords: pageKeywords || website.keywords,
		image: getFavicon(website),
		opengraph: {
			type: OpenGraphType.Article
		},
		twitter: {
			type: TwitterCardType.Summary
		}
	};
</script>

<PageMetaTags data={ contactPage } />
<JsonLdWebPage data={ contactPage } />
<JsonLdBreadcrumbs url={$page.url.href} />

<!-- Page markup-->
<section class="page">
	<div class="content">
		<div class="centered">
			<h1>This is the Contact page</h1>
		</div>
	</div>
</section>

<style>
	.centered {
		position: fixed;
		top: 30%;
		left: 40%;
		margin-top: -50px;
		margin-left: -100px;
	}

	.centered h1 {
		font-size: 3rem;
		line-height: 1;
	}
</style>
