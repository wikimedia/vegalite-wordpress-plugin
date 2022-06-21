const { externals, helpers, plugins, presets } = require( '@humanmade/webpack-helpers' );

const { filePath } = helpers;

module.exports = presets.production( {
    name: 'datavis-block',
    externals,
    entry: {
        'datavis-block-editor': filePath( 'src/editor.js' ),
        'datavis-block-frontend': filePath( 'src/index.js' ),
    },
    plugins: [
        plugins.clean(),
    ],
	cache: {
		type: 'filesystem',
	},
} );
