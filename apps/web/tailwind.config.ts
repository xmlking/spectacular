// import daisyui from 'daisyui';
import baseConfig from 'tailwind-config/tailwind.config';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
// @ts-expect-error 7016 TODO
import flowbite from 'flowbite/plugin';

export default {
	content: [...baseConfig.content, './src/**/*.{html,js,svelte,ts,mdx}', '../../packages/ui/src/**/*.{html,js,svelte,ts,mdx}'],
	presets: [baseConfig],
	// Make sure you add `daisyui` AFTER @tailwindcss/typography in plugins array
	// plugins: [flowbite({ charts: false, forms: false }), daisyui],

	plugins: [flowbite({ charts: false, forms: true })],

	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				primary: baseConfig.theme.extend.colors.primary,
				// gray: colors.gray,
				// blue: colors.sky,

				// From: https://kitwind.io/products/kometa/config
				'deep-purple': {
					50: '#ede7f6',
					100: '#d1c4e9',
					200: '#b39ddb',
					300: '#9575cd',
					400: '#7e57c2',
					500: '#673ab7',
					600: '#5e35b1',
					700: '#512da8',
					800: '#4527a0',
					900: '#311b92',
					'accent-100': '#b388ff',
					'accent-200': '#7c4dff',
					'accent-400': '#651fff',
					'accent-700': '#6200ea'
				},
				teal: {
					50: '#e0f2f1',
					100: '#b2dfdb',
					200: '#80cbc4',
					300: '#4db6ac',
					400: '#26a69a',
					500: '#009688',
					600: '#00897b',
					700: '#00796b',
					800: '#00695c',
					900: '#004d40',
					'accent-100': '#a7ffeb',
					'accent-200': '#64ffda',
					'accent-400': '#1de9b6',
					'accent-700': '#00bfa5'
				}
			},
			spacing: {
				7: '1.75rem',
				9: '2.25rem',
				28: '7rem',
				80: '20rem',
				96: '24rem'
			},
			height: {
				'1/2': '50%'
			},
			scale: {
				30: '.3'
			},
			boxShadow: {
				outline: '0 0 0 3px rgba(101, 31, 255, 0.4)'
			}
		}
	},
	variants: {
		scale: ['responsive', 'hover', 'focus', 'group-hover'],
		textColor: ['responsive', 'hover', 'focus', 'group-hover'],
		opacity: ['responsive', 'hover', 'focus', 'group-hover'],
		backgroundColor: ['responsive', 'hover', 'focus', 'group-hover']
	}

	// daisyUI config (optional)
	// daisyui: {
	// 	themes: ['light', 'dark']
	// }
} satisfies Config;
