// Navigation Sitemap

import type { Menu } from './types';

export const menuNavLinks: Menu = {
	'/docs': [
		{
			title: 'Docs',
			list: [
				{ href: '/guides', label: 'Introduction', keywords: 'svelte, sirens, license, release' },
				{ href: '/guides/sumo-test', label: 'Get Started', keywords: 'start, install, cli, tailwind, themes, stylesheets' },
				{ href: '/guides', label: 'Quickstart', keywords: 'start, setup, tutorial, guide' }
			]
		},
		{
			title: 'Essentials',
			list: [
				{ href: '/posts', label: 'Themes', keywords: 'theme, customize, fonts, gradient, background' },
				{ href: '/posts', label: 'Colors', keywords: 'theme, colors, swatches' },
				{ href: '/posts', label: 'Styling', keywords: 'styles, styling, props, classes, class, css' },
				{ href: '/posts', label: 'Design Tokens', keywords: 'theme, color, pairing, css, utility' },
				{ href: '/posts', label: 'Variants', keywords: 'variant, variants, presets, backgrounds, classes' },
				{
					href: '/posts',
					label: 'Transitions',
					keywords: 'transition, transitions, blur, fade, fly, slide, scale, draw, crossfade, prefers, reduced, motion',
					badge: 'New'
				}
			]
		},
		{
			title: 'Resources',
			list: [
				{ href: '/posts', label: 'Theme Generator', keywords: 'create, custom, style, css, design' },
				{ href: '/posts', label: 'PurgeCSS', keywords: 'purgecss, vite, tree, shaking, bundle, optimize', badge: 'New' },
				{ href: '/posts', label: 'Contributing', keywords: 'branch, pr' }
			]
		}
	],
	'/elements': [
		{
			title: 'Globals',
			list: [
				{ href: '/posts', label: 'Core', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' },
				{
					href: '/posts',
					label: 'Typography',
					keywords: 'headings, paragraph, anchor, blockquote, pre, code, keyboard, ins, del'
				},
				{
					href: '/posts',
					label: 'Forms',
					keywords: 'plugin, label, input, select, checkbox, radio, date, color, picker, slider, range, file'
				}
			]
		},
		{
			title: 'Elements',
			list: [
				{ href: '/posts', label: 'Alerts', keywords: 'message, notification' },
				{ href: '/posts', label: 'Badges', keywords: 'sup, sub, overlay, favorite, icon' },
				{ href: '/posts', label: 'Breadcrumbs', keywords: 'nav, navigation, separator, hierarchy' },
				{ href: '/posts', label: 'Buttons', keywords: 'click, anchor, icon, preload' },
				{ href: '/posts', label: 'Cards', keywords: 'header, footer, background, cell, region' },
				{ href: '/posts', label: 'Chips', keywords: 'action, select, selection, filter, filtering, interactive' },
				{
					href: '/posts',
					label: 'Lists',
					keywords: 'unordered, ordered, description, nav, navigation, ul, ol, li, dd, dt'
				},
				{ href: '/posts', label: 'Logo Clouds', keywords: 'logo, brand, branding, links' },
				{
					href: '/posts',
					label: 'Placeholders',
					keywords: 'skeleton, spacer, text, image, avatar, animate, animate'
				},
				{ href: '/posts', label: 'Tables', keywords: 'data, entry' }
			]
		},
		{
			title: 'Blocks',
			list: [
				{ href: '/posts', label: 'Chat', keywords: 'message, conversation, prompt, ai' },
				{ href: '/posts', label: 'Gradient Headings', keywords: 'header, h1, h2, h3' },
				{ href: '/posts', label: 'Image Layouts', keywords: 'image, layout, blocks, masonry, grid' },
				{ href: '/posts', label: 'Scroll Containers', keywords: 'carousel, scroll, snap, container' }
			]
		}
	],
	'/svelte': [
		{
			title: 'Actions',
			list: [
				{ href: '/posts', label: 'Clipboard', keywords: 'copy, contenteditable, html, input' },
				{ href: '/posts', label: 'Filters', keywords: 'svg, filtering, image, images, effect' },
				{ href: '/posts', label: 'Focus Trap', keywords: 'form, modal, a11y, accessibility, keyboard, interaction' }
			]
		},
		{
			title: 'Components',
			list: [
				{ href: '/posts', label: 'Accordions', keywords: 'collapse' },
				{ href: '/posts', label: 'App Bar', keywords: 'header, top, bar, title' },
				{ href: '/posts', label: 'App Rail', keywords: 'nav, navigation, tile, sidebar' },
				{ href: '/posts', label: 'App Shell', keywords: 'layout, header, footer, sidebar, page, content' },
				{ href: '/posts', label: 'Autocomplete', keywords: 'input, filter, fuzzy, auto, complete, suggest' },
				{ href: '/posts', label: 'Avatars', keywords: 'image, initial, filter' },
				{ href: '/posts', label: 'Conic Gradients', keywords: 'chart, graph, circle, pie, spinner, legend' },
				{ href: '/posts', label: 'File Buttons', keywords: 'upload, form, input, file, media' },
				{ href: '/posts', label: 'File Dropzone', keywords: 'upload, form, input, file, media, drag, drop' },
				{ href: '/posts', label: 'Input Chips', keywords: 'multi, multiple, select, tags, form, validation' },
				{ href: '/posts', label: 'Listboxes', keywords: 'list, select, multi, multiple' },
				{ href: '/posts', label: 'Paginators', keywords: 'nav, navigation, table, data, list' },
				{
					href: '/posts',
					label: 'Progress Bars',
					keywords: 'meter, track, indeterminate, determinate, min, max'
				},
				{
					href: '/posts',
					label: 'Progress Radials',
					keywords: 'meter, track, indeterminate, determinate, spin'
				},
				{ href: '/posts', label: 'Ratings', keywords: 'rating, rate, ratings, bar, star' },
				{ href: '/posts', label: 'Radio Groups', keywords: 'input, form, select, selection' },
				{ href: '/posts', label: 'Range Sliders', keywords: 'value, min, max, step,, tick, input, form' },
				{ href: '/posts', label: 'Slide Toggles', keywords: 'check, checkbox, toggle, input, form' },
				{ href: '/posts', label: 'Steppers', keywords: 'intro, onboard, onboarding, form, progress' },
				{ href: '/posts', label: 'Tabs', keywords: 'select, selection, panel' },
				{ href: '/posts', label: 'Tables', keywords: 'data, entry' },
				{ href: '/posts', label: 'Tree Views', keywords: 'tree, view, node', badge: 'Beta' }
			]
		}
	],
	'/utilities': [
		{
			title: 'Utilities',
			list: [
				{ href: '/posts', label: 'Picture', keywords: 'highlight, syntax, code' },
				{ href: '/posts', label: 'Movies', keywords: 'overlay, slide, panel, sidebar' },
				{ href: '/posts', label: 'Settings', keywords: 'light, dark, toggle, prefer, color, scheme' },
				{
					href: '/posts',
					label: 'Transitions',
					keywords: 'svelte, writable, get, cache, persist'
				},
				{
					href: '/posts',
					label: 'Modals',
					keywords: 'overlay, dialog, notification, alert, confirm, prompt, multiple, form, list, embed, video'
				},
				{ href: '/posts', label: 'Lazy', keywords: 'menu, tooltip, overlay, dropdown, combobox, drop, down, select' },
				{
					href: '/posts',
					label: 'Particles',
					keywords: 'overlay, Particles, snackbar, bar, action, alert, notification'
				},
				{
					href: '/posts',
					label: 'Outclick',
					keywords: 'outclick, click, half-click',
					badge: 'Beta'
				}
				// DELISTED UNTIL FURTHER NOTICE
				// { href: '/utilities/data-tables', label: 'Data Tables', keywords: 'search, sort, page, pagination, async', badge: 'Experimental' }
			]
		}
	]
};
