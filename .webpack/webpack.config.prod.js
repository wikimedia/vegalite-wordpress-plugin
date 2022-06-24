const { externals, helpers, plugins, presets } = require( '@humanmade/webpack-helpers' );
const vegaExternals = require( './vega-externals' );

const { filePath } = helpers;

module.exports = presets.production( {
    name: 'datavis-block',
    externals: {
		...externals,
		...vegaExternals,
	},
    entry: {
        'datavis-block-editor': filePath( 'src/editor.js' ),
        'datavis-block-frontend': filePath( 'src/frontend.js' ),
    },
    plugins: [
        plugins.clean(),
    ],
	cache: {
		type: 'filesystem',
	},
} );
