const { externals, helpers, plugins, presets } = require( '@humanmade/webpack-helpers' );

const { filePath } = helpers;

const vegaExternals = {
	vega: 'vega',
	'vega-lite': 'vegaLite',
	'vega-embed': 'vegaEmbed',
};

module.exports = presets.production( {
    name: 'datavis-block',
    externals: {
		...externals,
		...vegaExternals,
	},
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
