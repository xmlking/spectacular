// Navigation Sitemap

export type List = Array<{ href: string; label: string; keywords: string; badge?: string }>;
export const menuNavLinks: Record<string, Array<{ title: string; list: List }>> = {
    '/docs': [
        {
            title: 'Docs',
            list: [
                { href: '/docs/introduction', label: 'Introduction', keywords: 'svelte, sirens, license, release' },
                { href: '/docs/get-started', label: 'Get Started', keywords: 'start, install, cli, tailwind, themes, stylesheets' },
                { href: '/docs/quickstart', label: 'Quickstart', keywords: 'start, setup, tutorial, guide' },
            ],
        },
        {
            title: 'Essentials',
            list: [
                { href: '/docs/themes', label: 'Themes', keywords: 'theme, customize, fonts, gradient, background' },
                { href: '/docs/colors', label: 'Colors', keywords: 'theme, colors, swatches' },
                { href: '/docs/styling', label: 'Styling', keywords: 'styles, styling, props, classes, class, css' },
                { href: '/docs/tokens', label: 'Design Tokens', keywords: 'theme, color, pairing, css, utility' },
                { href: '/docs/variants', label: 'Variants', keywords: 'variant, variants, presets, backgrounds, classes' },
                {
                    href: '/docs/transitions',
                    label: 'Transitions',
                    keywords: 'transition, transitions, blur, fade, fly, slide, scale, draw, crossfade, prefers, reduced, motion',
                    badge: 'New',
                },
            ],
        },
        {
            title: 'Resources',
            list: [
                { href: '/docs/generator', label: 'Theme Generator', keywords: 'create, custom, style, css, design' },
                { href: '/docs/purgecss', label: 'PurgeCSS', keywords: 'purgecss, vite, tree, shaking, bundle, optimize', badge: 'New' },
                { href: '/docs/contributing', label: 'Contributing', keywords: 'branch, pr' },
                { href: '/dashboard/reports', label: 'Reports', keywords: 'reports, graph' },
                { href: '/dashboard/customers', label: 'Customers', keywords: 'customers, users' },
            ],
        },
    ],
    '/elements': [
        {
            title: 'Globals',
            list: [
                { href: '/elements/core', label: 'Core', keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider' },
                {
                    href: '/elements/typography',
                    label: 'Typography',
                    keywords: 'headings, paragraph, anchor, blockquote, pre, code, keyboard, ins, del',
                },
                {
                    href: '/elements/forms',
                    label: 'Forms',
                    keywords: 'plugin, label, input, select, checkbox, radio, date, color, picker, slider, range, file',
                },
            ],
        },
        {
            title: 'Elements',
            list: [
                { href: '/elements/alerts', label: 'Alerts', keywords: 'message, notification' },
                { href: '/elements/badges', label: 'Badges', keywords: 'sup, sub, overlay, favorite, icon' },
                { href: '/elements/breadcrumbs', label: 'Breadcrumbs', keywords: 'nav, navigation, separator, hierarchy' },
                { href: '/elements/buttons', label: 'Buttons', keywords: 'click, anchor, icon, preload' },
                { href: '/elements/cards', label: 'Cards', keywords: 'header, footer, background, cell, region' },
                { href: '/elements/chips', label: 'Chips', keywords: 'action, select, selection, filter, filtering, interactive' },
                {
                    href: '/elements/lists',
                    label: 'Lists',
                    keywords: 'unordered, ordered, description, nav, navigation, ul, ol, li, dd, dt',
                },
                { href: '/elements/logo-clouds', label: 'Logo Clouds', keywords: 'logo, brand, branding, links' },
                {
                    href: '/elements/placeholders',
                    label: 'Placeholders',
                    keywords: 'skeleton, spacer, text, image, avatar, animate, animate',
                },
                { href: '/elements/tables', label: 'Tables', keywords: 'data, entry' },
            ],
        },
        {
            title: 'Blocks',
            list: [
                { href: '/elements/chat', label: 'Chat', keywords: 'message, conversation, prompt, ai' },
                { href: '/elements/gradient-headings', label: 'Gradient Headings', keywords: 'header, h1, h2, h3' },
                { href: '/elements/image-layouts', label: 'Image Layouts', keywords: 'image, layout, blocks, masonry, grid' },
                { href: '/elements/scroll-containers', label: 'Scroll Containers', keywords: 'carousel, scroll, snap, container' },
            ],
        },
    ],
    '/svelte': [
        {
            title: 'Actions',
            list: [
                { href: '/actions/clipboard', label: 'Clipboard', keywords: 'copy, contenteditable, html, input' },
                { href: '/actions/filters', label: 'Filters', keywords: 'svg, filtering, image, images, effect' },
                { href: '/actions/focus-trap', label: 'Focus Trap', keywords: 'form, modal, a11y, accessibility, keyboard, interaction' },
            ],
        },
        {
            title: 'Components',
            list: [
                { href: '/components/accordions', label: 'Accordions', keywords: 'collapse' },
                { href: '/components/app-bar', label: 'App Bar', keywords: 'header, top, bar, title' },
                { href: '/components/app-rail', label: 'App Rail', keywords: 'nav, navigation, tile, sidebar' },
                { href: '/components/app-shell', label: 'App Shell', keywords: 'layout, header, footer, sidebar, page, content' },
                { href: '/components/autocomplete', label: 'Autocomplete', keywords: 'input, filter, fuzzy, auto, complete, suggest' },
                { href: '/components/avatars', label: 'Avatars', keywords: 'image, initial, filter' },
                { href: '/components/conic-gradients', label: 'Conic Gradients', keywords: 'chart, graph, circle, pie, spinner, legend' },
                { href: '/components/file-buttons', label: 'File Buttons', keywords: 'upload, form, input, file, media' },
                { href: '/components/file-dropzone', label: 'File Dropzone', keywords: 'upload, form, input, file, media, drag, drop' },
                { href: '/components/input-chips', label: 'Input Chips', keywords: 'multi, multiple, select, tags, form, validation' },
                { href: '/components/listboxes', label: 'Listboxes', keywords: 'list, select, multi, multiple' },
                { href: '/components/paginators', label: 'Paginators', keywords: 'nav, navigation, table, data, list' },
                {
                    href: '/components/progress-bars',
                    label: 'Progress Bars',
                    keywords: 'meter, track, indeterminate, determinate, min, max',
                },
                {
                    href: '/components/progress-radials',
                    label: 'Progress Radials',
                    keywords: 'meter, track, indeterminate, determinate, spin',
                },
                { href: '/components/ratings', label: 'Ratings', keywords: 'rating, rate, ratings, bar, star' },
                { href: '/components/radio-groups', label: 'Radio Groups', keywords: 'input, form, select, selection' },
                { href: '/components/range-sliders', label: 'Range Sliders', keywords: 'value, min, max, step,, tick, input, form' },
                { href: '/components/slide-toggles', label: 'Slide Toggles', keywords: 'check, checkbox, toggle, input, form' },
                { href: '/components/steppers', label: 'Steppers', keywords: 'intro, onboard, onboarding, form, progress' },
                { href: '/components/tabs', label: 'Tabs', keywords: 'select, selection, panel' },
                { href: '/components/tables', label: 'Tables', keywords: 'data, entry' },
                { href: '/components/tree-views', label: 'Tree Views', keywords: 'tree, view, node', badge: 'Beta' },
            ],
        },
    ],
    '/experiments': [
        {
            title: 'Experiments',
            list: [
                { href: '/experiments/picture', label: 'Picture', keywords: 'highlight, syntax, code' },
                { href: '/experiments/movies', label: 'Movies', keywords: 'overlay, slide, panel, sidebar' },
                { href: '/experiments/settings', label: 'Settings', keywords: 'light, dark, toggle, prefer, color, scheme' },
                {
                    href: '/experiments/transitions',
                    label: 'Transitions',
                    keywords: 'svelte, writable, get, cache, persist',
                },
                {
                    href: '/experiments/animations',
                    label: 'Animations',
                    keywords: 'overlay, dialog, animations, notification, alert, confirm, prompt, multiple, form, list, embed, video',
                },
                { href: '/experiments/lazy', label: 'Lazy', keywords: 'menu, tooltip, overlay, dropdown, combobox, drop, down, select' },
                {
                    href: '/experiments/particles',
                    label: 'Particles',
                    keywords: 'overlay, Particles, snackbar, bar, action, alert, notification',
                },
                {
                    href: '/experiments/outclick',
                    label: 'Outclick',
                    keywords: 'outclick, click, half-click',
                    badge: 'Beta',
                },
                { href: '/experiments/paneforge', label: 'Paneforge', keywords: 'paneforge, pane, code', badge: 'New' },
                // DELISTED UNTIL FURTHER NOTICE
                // { href: '/experiments/data-tables', label: 'Data Tables', keywords: 'search, sort, page, pagination, async', badge: 'Experimental' }
            ],
        },
    ],
};
