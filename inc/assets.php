<?php
/**
 * Handle registering the standalone Vega scripts.
 *
 * Block build assets are registered automatically from each block's
 * block.json metadata; see inc/blocks.php.
 */

namespace Vegalite_Plugin\Assets;

/**
 * Connect namespace functions to actions & hooks.
 */
function bootstrap() : void {
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\register_vega' );
}

/**
 * Register and enqueue the Vega Lite scripts. These assets are also installed
 * via NPM for code intellesense purposes, but they change rarely enough that
 * it is more efficient to keep them out of the bundle and load them as separate
 * individual JS files.
 *
 * @return void
 */
function register_vega() : void {
	$plugin_assets_dir = plugin_dir_url( __DIR__ ) . 'assets/';
	wp_register_script( 'vega', $plugin_assets_dir . 'vega.6.2.0.js', [], '6.2.0' );
	wp_register_script( 'vega-lite', $plugin_assets_dir . 'vega-lite.6.4.3.js', [ 'vega' ], '6.4.3' );
	wp_register_script( 'vega-embed', $plugin_assets_dir . 'vega-embed.7.1.0.js', [ 'vega-lite' ], '7.1.0' );
}
