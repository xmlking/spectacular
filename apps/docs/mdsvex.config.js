import { resolve, join, dirname } from 'node:path';
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
		default: resolve(join(__dirname, './themes/sveltin_theme/components/md-layout.svelte')),
		fancy: resolve(join(__dirname, './themes/sveltin_theme/components/md-layout.svelte')),
		fallback: resolve(join(__dirname, './themes/sveltin_theme/components/md-layout.svelte')),
		// blog: resolve(join(__dirname, './src/routes/blog/layout.svelte')),
		// projects: resolve(join(__dirname, './src/routes/projects/layout.svelte')),
		page: resolve(join(__dirname, './themes/sveltin_theme/components/md-layout.svelte'))
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
