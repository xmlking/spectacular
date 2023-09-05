module.exports = {
	// root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:jsdoc/recommended-typescript-error',
		// 'plugin:jsdoc/recommended-error',
		// 'plugin:svelte/recommended',
		'plugin:svelte/prettier',
		'plugin:import/recommended',
		'turbo',
		'prettier'
	],
	plugins: ['@typescript-eslint', 'unused-imports', 'jsdoc'],
	ignorePatterns: ['*.cjs'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'off'
			}
		}
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2022: true,
		node: true
	},

	rules: {
		'svelte/no-at-html-tags': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}
		],
		'@typescript-eslint/explicit-function-return-type': 'error',
		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}
		],
		'unused-imports/no-unused-imports': 'error',
		'import/no-unresolved': 'off', // It's hard to solve...
		'import/order': [
			'error',
			{
				pathGroups: [
					{
						pattern: '$*/**',
						group: 'parent',
						position: 'before'
					},
					{
						pattern: '$houdini',
						group: 'parent',
						position: 'before'
					}
				]
			}
		],
		'jsdoc/require-jsdoc': [
			'error',
			{
				require: {
					MethodDefinition: true
				}
			}
		],
		'jsdoc/require-hyphen-before-param-description': 1,
		// It's hard to solve...
		'jsdoc/valid-types': 0,
		'jsdoc/no-undefined-types': 0,
		'jsdoc/check-tag-names': 0
	}

	// "globals": {
	// 	'__APP_VERSION__': true,
	// 	'__GIT_TAG__': true,
	// 	'__GIT_DATE__': true,
	// }
};
