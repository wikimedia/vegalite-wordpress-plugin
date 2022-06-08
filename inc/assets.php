<?php
/**
 * Handle enqueuing block assets.
 */

namespace Datavis_Block\Assets;

use Asset_Loader;

/**
 * Connect namespace functions to actions & hooks.
 */
function bootstrap() : void {
	if ( ! function_exists( 'Asset_Loader\\enqueue_asset' ) ) {
		trigger_error( 'Datavis Block expects humanmade/asset-loader to be installed and active' );
		return;
	}

	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_assets' );
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\enqueue_frontend_assets' );
}

function enqueue_build_asset( $asset, $options = [] ) : void {
	$plugin_path = trailingslashit( plugin_dir_path( dirname( __FILE__, 1 ) ) );

	$manifest = Asset_Loader\Manifest\get_active_manifest( [
		$plugin_path . 'build/development-asset-manifest.json',
		$plugin_path . 'build/production-asset-manifest.json',
	] );

	Asset_Loader\enqueue_asset( $manifest, $asset, $options );
}

/**
 * Enqueue the JS bundle in the block editor.
 */
function enqueue_assets() : void {
	enqueue_build_asset(
		'datavis-block-editor.js',
		[
			'dependencies' => [
				'wp-blocks',
				'wp-components',
				'wp-edit-post',
				'wp-element',
				'wp-i18n',
			],
			'handle'  => 'datavis-block-editor',
		]
	);
	enqueue_build_asset(
		'datavis-block-editor.css',
		[
			'dependencies' => [],
			'handle' => 'datavis-block-editor',
		]
	);
}

/**
 * Enqueue these assets in both the editor and the frontend.
 */
function enqueue_frontend_assets() : void {
	// Include Vega Lite. TODO: Move to webpack config.
	wp_enqueue_script( 'vega', 'https://cdn.jsdelivr.net/npm/vega@5.21.0' );
	wp_enqueue_script( 'vega-lite', 'https://cdn.jsdelivr.net/npm/vega-lite@5.2.0', [ 'vega' ] );
	wp_enqueue_script( 'vega-embed', 'https://cdn.jsdelivr.net/npm/vega-embed@6.20.2', [ 'vega-lite' ] );

	enqueue_build_asset(
		'datavis-block-frontend.js',
		[
			'dependencies' => [ 'vega-lite', 'vega-embed' ],
			'handle'       => 'datavis-block-frontend',
		]
	);
	enqueue_build_asset(
		'datavis-block-frontend.css',
		[
			'dependencies' => [],
			'handle' => 'datavis-block-frontend',
		]
	);
}
