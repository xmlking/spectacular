<script lang="ts">
	import type { SEOWebPage } from '@sveltinio/seo/types';
	import { OpenGraphType, TwitterCardType } from '@sveltinio/seo/types';
	import { PageMetaTags, JsonLdWebPage } from '@sveltinio/seo';
	import { website } from '$config/website';
	import { getFavicon } from '$lib/utils/strings';

	const homePage: SEOWebPage = {
		url: website.baseURL,
		title: website.title,
		description: website.description,
		keywords: website.keywords ? website.keywords : new Array<string>(),
		image: getFavicon(website),
		opengraph: {
			type: OpenGraphType.Website
		},
		twitter: {
			type: TwitterCardType.Large
		}
	};
</script>

<!-- SEO Section -->
<PageMetaTags data={homePage} />
<JsonLdWebPage data={homePage} />
<!-- End of SEO Section -->
