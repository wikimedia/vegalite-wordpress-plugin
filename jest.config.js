const path = require( 'path' );

module.exports = {
	preset: '@wordpress/jest-preset-default',

	// Stand on top of the Babel config wp-scripts would use to generate Jest config.
	transform: {
		'\\.[jt]sx?$': path.join(
			path.dirname( require.resolve( '@wordpress/scripts/package.json' ) ),
			'config/babel-transform'
		),
	},

	// Merged with, not replacing, the preset's own setupFiles.
	setupFiles: [ '<rootDir>/jest.setup.js' ],
};
