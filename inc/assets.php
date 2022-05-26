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
	enqueue_build_asset(
		'datavis-block-frontend.js',
		[
			'dependencies' => [],
			'handle'  => 'datavis-block-frontend',
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
