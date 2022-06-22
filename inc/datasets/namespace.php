<?php
/**
 * Handle registration and management of dataset feature support.
 */

namespace Datavis_Block\Datasets;

const FEATURE_NAME = 'datasets';

/**
 * Connect namespace functions to actions and hooks.
 */
function bootstrap() : void {
	add_action( 'init', __NAMESPACE__ . '\\register_dataset_post_type_support' );
}

function register_dataset_post_type_support() : void {
	/**
	 * Allow dataset support to be extended to additional post types beyond the defaults.
	 *
	 * @hook datasets/post_types
	 * @param array $post_types Array of names for post types which support datasets.
	 */
	$supported_post_types = apply_filters( 'datasets/post_types', [ 'post', 'page' ] );

	foreach ( $supported_post_types as $post_type ) {
		add_post_type_support( $post_type, FEATURE_NAME );
	}
}

/**
 * Get list of post types which support the datasets feature.
 *
 * @return string[] Supported post type array.
 */
function get_supported_post_types() : array {
	return array_filter(
		get_post_types(),
		function( $post_type ) : bool {
			return post_type_supports( $post_type, FEATURE_NAME );
		}
	);
}
