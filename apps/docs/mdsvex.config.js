import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import relativeImages from 'mdsvex-relative-images';
import emoji from 'remark-emoji';
import readingTime from 'remark-reading-time';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import headings from '@sveltinio/remark-headings';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mdsvexConfig = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],
	smartypants: {
		dashes: 'oldschool'
	},
	layout: {
		// blog: './src/lib/layouts/blog.svelte',
		// projects: './src/lib/layouts/projects.svelte',
		page: './themes/sveltin_theme/components/md-layout.svelte',
		_: './src/lib/layouts/blank.svelte' // fallback
	},
	remarkPlugins: [
		headings,
		emoji,
		// adds a `readingTime` frontmatter attribute
		readingTime(),
		relativeImages
	],
	rehypePlugins: [
		rehypeSlug,
		[rehypeAutoLinkHeadings, { behavior: 'wrap' }],
		[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
	]
});

export default mdsvexConfig;
