const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

// plugins
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const aspectRatio = require('@tailwindcss/aspect-ratio');
const containerQueries = require('@tailwindcss/container-queries');
const flowbite = require('flowbite/plugin');
const daisyui = require('daisyui');
// const tailwindUI = require('@tailwindcss/ui');

/** @type {import('tailwindcss').Config} */
const config = {
	// darkMode: 'class', // or 'media' or false
	darkMode: ['class', '[data-theme="dark"]'],

	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', ...defaultTheme.fontFamily.sans]
			},
			// https://tailwindui.com/documentation
			// fontFamily: {
			//  sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			// },
			// custom shades generator https://javisperez.github.io/tailwindcolorshades/?
			// http://colorcode.is/ - helpful color site
			// prettier-ignore
			colors: {
				// To change the primary color, simply uncomment the desired color object and modify the corresponding color values as needed.
				// flowbite-svelte
				// primary: {"50": "#FFF1EE","100": "#fff1ee","200": "#ffe4de","300": "#ffd5cc","400": "#ffbcad","500": "#fe795d","600": "#ef562f","700": "#eb4f27","800": "#d3330a","900": "#d3330a"},
				// optred
				// primary: {"50": "#fbf3f4","100": "#f7e8e8","200": "#ecc5c6","300": "#e0a2a4","400": "#c85d60","500": "#b1171c","600": "#9f1519","700": "#851115","800": "#6a0e11","900": "#570b0e"},
				// pink
				// primary: {"50":"#fdf2f8","100":"#fce7f3","200":"#fbcfe8","300":"#f9a8d4","400":"#f472b6","500":"#ec4899","600":"#db2777","700":"#be185d","800":"#9d174d","900":"#831843"},

				// fuchsia
				// primary: {"50":"#fdf4ff","100":"#fae8ff","200":"#f5d0fe","300":"#f0abfc","400":"#e879f9","500":"#d946ef","600":"#c026d3","700":"#a21caf","800":"#86198f","900":"#701a75"},

				// purple
				// primary: {"50":"#faf5ff","100":"#f3e8ff","200":"#e9d5ff","300":"#d8b4fe","400":"#c084fc","500":"#a855f7","600":"#9333ea","700":"#7e22ce","800":"#6b21a8","900":"#581c87"},

				// violet
				// primary: {"50":"#f5f3ff","100":"#ede9fe","200":"#ddd6fe","300":"#c4b5fd","400":"#a78bfa","500":"#8b5cf6","600":"#7c3aed","700":"#6d28d9","800":"#5b21b6","900":"#4c1d95"},

				// indigo
				// primary: {"50":"#eef2ff","100":"#e0e7ff","200":"#c7d2fe","300":"#a5b4fc","400":"#818cf8","500":"#6366f1","600":"#4f46e5","700":"#4338ca","800":"#3730a3","900":"#312e81"},

				// blue
				primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a"},

				// sky
				// primary: {"50":"#f0f9ff","100":"#e0f2fe","200":"#bae6fd","300":"#7dd3fc","400":"#38bdf8","500":"#0ea5e9","600":"#0284c7","700":"#0369a1","800":"#075985","900":"#0c4a6e"},

				// cyan
				// primary: {"50":"#ecfeff","100":"#cffafe","200":"#a5f3fc","300":"#67e8f9","400":"#22d3ee","500":"#06b6d4","600":"#0891b2","700":"#0e7490","800":"#155e75","900":"#164e63"},

				// teal
				// primary: {"50":"#f0fdfa","100":"#ccfbf1","200":"#99f6e4","300":"#5eead4","400":"#2dd4bf","500":"#14b8a6","600":"#0d9488","700":"#0f766e","800":"#115e59","900":"#134e4a"},

				// emerald
				// primary: {"50":"#ecfdf5","100":"#d1fae5","200":"#a7f3d0","300":"#6ee7b7","400":"#34d399","500":"#10b981","600":"#059669","700":"#047857","800":"#065f46","900":"#064e3b"},

				// green
				// primary: {"50":"#f0fdf4","100":"#dcfce7","200":"#bbf7d0","300":"#86efac","400":"#4ade80","500":"#22c55e","600":"#16a34a","700":"#15803d","800":"#166534","900":"#14532d"},

				// lime
				// primary: {"50":"#f7fee7","100":"#ecfccb","200":"#d9f99d","300":"#bef264","400":"#a3e635","500":"#84cc16","600":"#65a30d","700":"#4d7c0f","800":"#3f6212","900":"#365314"},

				// yellow
				// primary: {"50":"#fefce8","100":"#fef9c3","200":"#fef08a","300":"#fde047","400":"#facc15","500":"#eab308","600":"#ca8a04","700":"#a16207","800":"#854d0e","900":"#713f12"},

				// amber
				// primary: {"50":"#fffbeb","100":"#fef3c7","200":"#fde68a","300":"#fcd34d","400":"#fbbf24","500":"#f59e0b","600":"#d97706","700":"#b45309","800":"#92400e","900":"#78350f"},

				// orange
				// primary: {"50":"#fff7ed","100":"#ffedd5","200":"#fed7aa","300":"#fdba74","400":"#fb923c","500":"#f97316","600":"#ea580c","700":"#c2410c","800":"#9a3412","900":"#7c2d12"},

				// red
				// primary: {"50":"#fef2f2","100":"#fee2e2","200":"#fecaca","300":"#fca5a5","400":"#f87171","500":"#ef4444","600":"#dc2626","700":"#b91c1c","800":"#991b1b","900":"#7f1d1d"},

				// stone
				// primary: {"50":"#fafaf9","100":"#f5f5f4","200":"#e7e5e4","300":"#d6d3d1","400":"#a8a29e","500":"#78716c","600":"#57534e","700":"#44403c","800":"#292524","900":"#1c1917"},

				// neutral
				// primary: {"50":"#fafafa","100":"#f5f5f5","200":"#e5e5e5","300":"#d4d4d4","400":"#a3a3a3","500":"#737373","600":"#525252","700":"#404040","800":"#262626","900":"#171717"},

				// zinc
				// primary: {"50":"#fafafa","100":"#f4f4f5","200":"#e4e4e7","300":"#d4d4d8","400":"#a1a1aa","500":"#71717a","600":"#52525b","700":"#3f3f46","800":"#27272a","900":"#18181b"},

				// gray
				// primary: {"50":"#f9fafb","100":"#f3f4f6","200":"#e5e7eb","300":"#d1d5db","400":"#9ca3af","500":"#6b7280","600":"#4b5563","700":"#374151","800":"#1f2937","900":"#111827"},

				// slate
				// primary: {"50":"#f8fafc","100":"#f1f5f9","200":"#e2e8f0","300":"#cbd5e1","400":"#94a3b8","500":"#64748b","600":"#475569","700":"#334155","800":"#1e293b","900":"#0f172a"},

				optred: {
					50: '#fbf3f4',
					100: '#f7e8e8',
					200: '#ecc5c6',
					300: '#e0a2a4',
					400: '#c85d60',
					500: '#b1171c',
					600: '#9f1519',
					700: '#851115',
					800: '#6a0e11',
					900: '#570b0e'
				},
				red: {
					50: '#ffebee',
					100: '#ffcdd2',
					200: '#ef9a9a',
					300: '#e57373',
					400: '#ef5350',
					500: '#f44336',
					600: '#e53935',
					700: '#d32f2f',
					800: '#c62828',
					900: '#b71c1c',
					'accent-100': '#ff8a80',
					'accent-200': '#ff5252',
					'accent-400': '#ff1744',
					'accent-700': '#d50000'
				},
				purple: {
					50: '#f3e5f5',
					100: '#e1bee7',
					200: '#ce93d8',
					300: '#ba68c8',
					400: '#ab47bc',
					500: '#9c27b0',
					600: '#8e24aa',
					700: '#7b1fa2',
					800: '#6a1b9a',
					900: '#4a148c',
					'accent-100': '#ea80fc',
					'accent-200': '#e040fb',
					'accent-400': '#d500f9',
					'accent-700': '#aa00ff'
				},
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
				},
				indigo: {
					50: '#e8eaf6',
					100: '#c5cae9',
					200: '#9fa8da',
					300: '#7986cb',
					400: '#5c6bc0',
					500: '#3f51b5',
					600: '#3949ab',
					700: '#303f9f',
					800: '#283593',
					900: '#1a237e',
					'accent-100': '#8c9eff',
					'accent-200': '#536dfe',
					'accent-400': '#3d5afe',
					'accent-700': '#304ffe'
				},
				pink: {
					50: '#fce4ec',
					100: '#f8bbd0',
					200: '#f48fb1',
					300: '#f06292',
					400: '#ec407a',
					500: '#e91e63',
					600: '#d81b60',
					700: '#c2185b',
					800: '#ad1457',
					900: '#880e4f',
					'accent-100': '#ff80ab',
					'accent-200': '#ff4081',
					'accent-400': '#f50057',
					'accent-700': '#c51162'
				},
				blue: {
					50: '#e3f2fd',
					100: '#bbdefb',
					200: '#90caf9',
					300: '#64b5f6',
					400: '#42a5f5',
					500: '#2196f3',
					600: '#1e88e5',
					700: '#1976d2',
					800: '#1565c0',
					900: '#0d47a1',
					'accent-100': '#82b1ff',
					'accent-200': '#448aff',
					'accent-400': '#2979ff',
					'accent-700': '#2962ff'
				},
				'light-blue': {
					50: '#e1f5fe',
					100: '#b3e5fc',
					200: '#81d4fa',
					300: '#4fc3f7',
					400: '#29b6f6',
					500: '#03a9f4',
					600: '#039be5',
					700: '#0288d1',
					800: '#0277bd',
					900: '#01579b',
					'accent-100': '#80d8ff',
					'accent-200': '#40c4ff',
					'accent-400': '#00b0ff',
					'accent-700': '#0091ea'
				},
				cyan: {
					50: '#e0f7fa',
					100: '#b2ebf2',
					200: '#80deea',
					300: '#4dd0e1',
					400: '#26c6da',
					500: '#00bcd4',
					600: '#00acc1',
					700: '#0097a7',
					800: '#00838f',
					900: '#006064',
					'accent-100': '#84ffff',
					'accent-200': '#18ffff',
					'accent-400': '#00e5ff',
					'accent-700': '#00b8d4'
				},
				gray: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#eeeeee',
					300: '#e0e0e0',
					400: '#bdbdbd',
					500: '#9e9e9e',
					600: '#757575',
					700: '#616161',
					800: '#424242',
					900: '#212121'
				},
				'blue-gray': {
					50: '#eceff1',
					100: '#cfd8dc',
					200: '#b0bec5',
					300: '#90a4ae',
					400: '#78909c',
					500: '#607d8b',
					600: '#546e7a',
					700: '#455a64',
					800: '#37474f',
					900: '#263238'
				},
				green: {
					50: '#e8f5e9',
					100: '#c8e6c9',
					200: '#a5d6a7',
					300: '#81c784',
					400: '#66bb6a',
					500: '#4caf50',
					600: '#43a047',
					700: '#388e3c',
					800: '#2e7d32',
					900: '#1b5e20',
					'accent-100': '#b9f6ca',
					'accent-200': '#69f0ae',
					'accent-400': '#00e676',
					'accent-700': '#00c853'
				},
				'light-green': {
					50: '#f1f8e9',
					100: '#dcedc8',
					200: '#c5e1a5',
					300: '#aed581',
					400: '#9ccc65',
					500: '#8bc34a',
					600: '#7cb342',
					700: '#689f38',
					800: '#558b2f',
					900: '#33691e',
					'accent-100': '#ccff90',
					'accent-200': '#b2ff59',
					'accent-400': '#76ff03',
					'accent-700': '#64dd17'
				},
				lime: {
					50: '#f9fbe7',
					100: '#f0f4c3',
					200: '#e6ee9c',
					300: '#dce775',
					400: '#d4e157',
					500: '#cddc39',
					600: '#c0ca33',
					700: '#afb42b',
					800: '#9e9d24',
					900: '#827717',
					'accent-100': '#f4ff81',
					'accent-200': '#eeff41',
					'accent-400': '#c6ff00',
					'accent-700': '#aeea00'
				},
				amber: {
					50: '#fff8e1',
					100: '#ffecb3',
					200: '#ffe082',
					300: '#ffd54f',
					400: '#ffca28',
					500: '#ffc107',
					600: '#ffb300',
					700: '#ffa000',
					800: '#ff8f00',
					900: '#ff6f00',
					'accent-100': '#ffe57f',
					'accent-200': '#ffd740',
					'accent-400': '#ffc400',
					'accent-700': '#ffab00'
				},
				yellow: {
					50: '#fffde7',
					100: '#fff9c4',
					200: '#fff59d',
					300: '#fff176',
					400: '#ffee58',
					500: '#ffeb3b',
					600: '#fdd835',
					700: '#fbc02d',
					800: '#f9a825',
					900: '#f57f17',
					'accent-100': '#ffff8d',
					'accent-200': '#ffff00',
					'accent-400': '#ffea00',
					'accent-700': '#ffd600'
				},
				orange: {
					50: '#fff3e0',
					100: '#ffe0b2',
					200: '#ffcc80',
					300: '#ffb74d',
					400: '#ffa726',
					500: '#ff9800',
					600: '#fb8c00',
					700: '#f57c00',
					800: '#ef6c00',
					900: '#e65100',
					'accent-100': '#ffd180',
					'accent-200': '#ffab40',
					'accent-400': '#ff9100',
					'accent-700': '#ff6d00'
				},
				'deep-orange': {
					50: '#fbe9e7',
					100: '#ffccbc',
					200: '#ffab91',
					300: '#ff8a65',
					400: '#ff7043',
					500: '#ff5722',
					600: '#f4511e',
					700: '#e64a19',
					800: '#d84315',
					900: '#bf360c',
					'accent-100': '#ff9e80',
					'accent-200': '#ff6e40',
					'accent-400': '#ff3d00',
					'accent-700': '#dd2c00'
				},
				brown: {
					50: '#efebe9',
					100: '#d7ccc8',
					200: '#bcaaa4',
					300: '#a1887f',
					400: '#8d6e63',
					500: '#795548',
					600: '#6d4c41',
					700: '#5d4037',
					800: '#4e342e',
					900: '#3e2723'
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
	},

	// daisyUI config (optional)
	daisyui: {
		themes: ['light', 'dark']
	},

	// Make sure you require daisyui AFTER @tailwindcss/typography in plugins array
	plugins: [typography, aspectRatio, containerQueries, daisyui]
};

module.exports = config;
