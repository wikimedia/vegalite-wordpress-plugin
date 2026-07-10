/**
 * Extend the wp-scripts default config to externalize vega packages, which are
 * loaded from the separately-registered preminified scripts in assets/.
 *
 * DependencyExtractionWebpackPlugin externalizes the imports, but also tracks
 * the matching script handles as dependencies that will show in *.asset.php.
 */
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const vegaGlobals = {
	vega: 'vega',
	'vega-lite': 'vegaLite',
	'vega-embed': 'vegaEmbed',
};

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			requestToExternal( request ) {
				return vegaGlobals[ request ];
			},
			requestToHandle( request ) {
				if ( vegaGlobals[ request ] ) {
					return request;
				}
			},
		} ),
	],
};
