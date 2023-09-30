module.exports = {
	// This tells ESLint to load the config from the package `eslint-config-custom`
	extends: ['custom'],
	// overwrite rules form `eslint-config-custom`
	rules: {
		'jsdoc/require-jsdoc': 'off'
	}
};
