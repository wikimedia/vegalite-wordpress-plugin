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
		trigger_error( 'Vega Lite WordPress Plugin expects humanmade/asset-loader to be installed and active' );
		return;
	}

	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_editor_assets' );
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\enqueue_vega' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_frontend_assets' );
}

/**
 * Register and enqueue the Vega Lite scripts. These assets are also installed
 * via NPM for code intellesense purposes, but they change rarely enough that
 * it is more efficient to keep them out of the bundle and load them as separate
 * individual JS files.
 *
 * @return void
 */
function enqueue_vega() : void {
	$plugin_assets_dir = plugin_dir_url( __DIR__ ) . 'assets/';
	wp_enqueue_script( 'vega', $plugin_assets_dir . 'vega.5.21.0.js' );
	wp_enqueue_script( 'vega-lite', $plugin_assets_dir . 'vega-lite.5.2.0.js', [ 'vega' ] );
	wp_enqueue_script( 'vega-embed', $plugin_assets_dir . 'vega-embed.6.20.2.js', [ 'vega-lite' ] );
}

/**
 * Helper function to wrap Asset_Loader in a function with arguments matching wp_enqueue_script.
 *
 * @param string   $handle       Script handle.
 * @param string   $asset        Name of script in asset manifest.
 * @param string[] $dependencies Array of script dependencies.
 */
function enqueue_build_asset( $handle, $asset, $dependencies = [] ) : void {
	$plugin_path = trailingslashit( plugin_dir_path( dirname( __FILE__, 1 ) ) );

	$manifest = Asset_Loader\Manifest\get_active_manifest( [
		$plugin_path . 'build/development-asset-manifest.json',
		$plugin_path . 'build/production-asset-manifest.json',
	] );

	Asset_Loader\enqueue_asset( $manifest, $asset, [
		'handle' => $handle,
		'dependencies' => $dependencies,
	] );
}

/**
 * Enqueue these assets in the block editor.
 */
function enqueue_editor_assets() : void {
	enqueue_build_asset(
		'datavis-block-editor',
		'datavis-block-editor.js',
		[
			'wp-blocks',
			'wp-components',
			'wp-edit-post',
			'wp-element',
			'wp-i18n',
			'vega-embed',
		]
	);
	enqueue_build_asset( 'datavis-block-editor', 'datavis-block-editor.css' );
}

/**
 * Enqueue these assets only on the frontend.
 */
function enqueue_frontend_assets() : void {
	enqueue_build_asset(
		'datavis-block-frontend',
		'datavis-block-frontend.js',
		[ 'vega-embed' ]
	);
	enqueue_build_asset(
		'datavis-block-frontend',
		'datavis-block-frontend.css'
	);
}
