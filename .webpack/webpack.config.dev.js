const { externals, helpers, presets } = require( '@humanmade/webpack-helpers' );

const { choosePort, cleanOnExit, filePath } = helpers;

cleanOnExit( [
	filePath( 'build', 'development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( ( port ) => {
	return presets.development( {
        name: 'datavis-block',
		devServer: {
			client: {
				webSocketURL: `ws://localhost:${ port }/ws`,
				overlay: false,
			},
			port,
		},
        externals,
        entry: {
            'datavis-block-editor': filePath( 'src/editor.js' ),
            'datavis-block-frontend': filePath( 'src/index.js' ),
        },
	} );
} );
