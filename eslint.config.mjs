import wordpress from '@wordpress/eslint-plugin';
import globals from 'globals';

/**
 * Suppress import resolution warnings for WP and custom externals (see
 * webpack.config.js), which intentionally don't appear in package.json.
 */
const externals = [
	'@wordpress/api-fetch',
	'@wordpress/block-editor',
	'@wordpress/blocks',
	'@wordpress/components',
	'@wordpress/data',
	'@wordpress/i18n',
	'react',
	'vega',
	'vega-lite',
	'vega-embed',
];

export default [
	{
		ignores: [ 'build/**', 'vendor/**', 'assets/vega*.js', '**/*.min.js' ],
	},

	// WP standard with ESLint owning formatting, not including prettier.
	...wordpress.configs[ 'recommended-with-formatting' ],

	{
		languageOptions: {
			// Replaces `env: { browser: true }` from the previous config.
			globals: { ...globals.browser },
		},
		settings: {
			'import/core-modules': externals,
			// Flag malformed types and tags without enforcing WP's entire jsdoc rulset.
			jsdoc: {
				preferredTypes: {
					object: 'object',
				},
				tagNamePreference: {
					returns: 'returns',
					yields: 'yields',
				},
			},
		},
		rules: {
			'computed-property-spacing': 'off',
			'comma-dangle': [ 'error', {
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'never',
			} ],
			// WP's `definedTypes` allowlist doesn't cover our custom type definitions.
			'jsdoc/no-undefined-types': 'off',
			'jsdoc/check-line-alignment': 'off',
		},
	},

	{
		// Build and lint tooling is consumed from @wordpress/scripts' own dependency
		// tree, we don't list those in package.json on their own.
		files: [ 'eslint.config.mjs', 'webpack.config.js' ],
		rules: {
			'import/no-extraneous-dependencies': 'off',
		},
	},

	{
		files: [
			'**/*.test.js',
			'**/*.spec.js',
			'**/__tests__/**/*.js',
			'jest.setup.js',
		],
		languageOptions: {
			globals: {
				...globals.jest,
				...globals.node,
			},
		},
	},
];
