module.exports = {
	extends: ['@spectacular/eslint-config/all'],
	rules: {
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^\\$\\$(Props|Events|Slots|Generic)$"
			}
		],
		// '@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-var-requires': 'off'
	}
};
