import { escapeSvelte, defineMDSveXConfig as defineConfig } from 'mdsvex';
import relativeImages from 'mdsvex-relative-images';
import emoji from 'remark-emoji';
import readingTime from 'remark-reading-time';
import rehypeAutoLinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';
import headings from '@sveltinio/remark-headings';
import { getHighlighter } from 'shiki';
import mermaid from 'mermaid';
mermaid.initialize({ mermaid: { theme: { light: 'neutral', dark: 'dark' } } });
import remarkMermaid from 'remark-mermaidjs';

const mdsvexConfig = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],
	smartypants: {
		dashes: 'oldschool'
	},
	layout: {
		// blog: './src/lib/layouts/blog.svelte',
		// projects: './src/lib/layouts/projects.svelte',
		page: './src/lib/layouts/page.svelte',
		_: './src/lib/layouts/blank.svelte' // fallback
	},
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter({ theme: 'poimandres' });
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang }));
			return `{@html \`${html}\`}`;
		}
	},
	remarkPlugins: [headings, emoji, readingTime(), relativeImages, remarkMermaid],
	rehypePlugins: [
		rehypeSlug,
		[rehypeAutoLinkHeadings, { behavior: 'wrap' }],
		[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
	]
});

export default mdsvexConfig;
