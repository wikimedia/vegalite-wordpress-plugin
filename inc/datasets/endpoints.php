<?php
/**
 * Define our custom CSV endpoint.
 */

namespace Datavis_Block\Datasets\Endpoints;

use Datavis_Block\Datasets;
use Datavis_Block\Datasets\Metadata;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

use const Datavis_Block\Datasets\Metadata\META_KEY;

function bootstrap() : void {
	add_action( 'rest_api_init', __NAMESPACE__ . '\\register_dataset_routes' );
	add_action( 'rest_pre_serve_request', __NAMESPACE__ . '\\deliver_dataset_as_csv', 10, 4 );
}

/**
 * Register dataset sub-routes for all post types which support datasets.
 *
 * @return void
 */
function register_dataset_routes() : void {
	foreach ( Datasets\get_supported_post_types() as $post_type ) {
		// REST route lookup logic adapted from rest_get_route_for_post_type_items.
		$post_type = get_post_type_object( $post_type );
		if ( empty( $post_type ) || ! $post_type->show_in_rest ) {
			continue;
		}

		$namespace = ! empty( $post_type->rest_namespace ) ? $post_type->rest_namespace : 'wp/v2';
		$rest_base = ! empty( $post_type->rest_base ) ? $post_type->rest_base : $post_type->name;

		register_rest_route(
			$namespace,
			$rest_base . '/(?P<post_id>[\\d]+)/datasets',
			[
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __NAMESPACE__ . '\\get_datasets',
				'permission_callback' => '__return_true',
			]
		);

		register_rest_route(
			$namespace,
			$rest_base . '/(?P<post_id>[\\d]+)/datasets/(?P<id>[a-z0-9-_.]+)',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => __NAMESPACE__ . '\\get_dataset_item',
					'permission_callback' => '__return_true',
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => __NAMESPACE__ . '\\update_dataset_item',
					'permission_callback' => '__return_true', // TODO: Only permit editing if can edit $post_id.
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => __NAMESPACE__ . '\\delete_dataset_item',
					'permission_callback' => '__return_true', // TODO: Only permit deletion if can edit $post_id.
				],
			]
		);
	}
}

/**
 * Get the post, if the ID is valid.
 *
 * Adapted from WP_REST_Posts_Controller.
 *
 * @param int $id Supplied ID.
 * @return WP_Post|WP_Error Post object if ID is valid, WP_Error otherwise.
 */
function get_post( $post_id ) {
	$error = new WP_Error(
		'rest_post_invalid_id',
		__( 'Invalid post ID.' ),
		[ 'status' => 404 ]
	);

	if ( (int) $post_id <= 0 ) {
		return $error;
	}

	$post = \get_post( (int) $post_id );
	if ( empty( $post ) || empty( $post->ID ) ) {
		return $error;
	}

	return $post;
}

/**
 * Serve a list of available datasets.
 *
 * @param WP_REST_Request $request Full details about the request.
 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
 */
function get_datasets( WP_REST_Request $request ) {
	$post_id = $request['post_id'];

	$valid_check = get_post( $post_id );
	if ( is_wp_error( $valid_check ) ) {
		return $valid_check;
	}

	$datasets = Metadata\get_datasets( $post_id );

	if ( empty( $datasets ) ) {
		return rest_ensure_response( [] );
	}

	return rest_ensure_response(
		array_map(
			function( $dataset ) use ( $request ) : array {
				// Return a no-content version of the dataset.
				return [
					'id'  => $dataset['id'],
					'url' => get_rest_url( null, trailingslashit( $request->get_route() ) . $dataset['id'] ),
				];
			},
			$datasets
		)
	);
}

function get_dataset_item( WP_REST_Request $request ) {
	$error = new WP_Error(
		'rest_dataset_invalid_id',
		__( 'Invalid dataset ID.' ),
		[ 'status' => 404 ]
	);

	$post_id = $request['post_id'];

	$valid_check = get_post( $post_id );
	if ( is_wp_error( $valid_check ) ) {
		return $valid_check;
	}

	$dataset = Metadata\get_dataset( $post_id, $request['id'] );

	if ( empty( $dataset ) ) {
		return $error;
	}

	return rest_ensure_response( $dataset );
}

/**
 * Take over delivery of REST response to serve datasets as CSV content.
 *
 * @param bool             $served  Whether the request has already been served.
 * @param WP_HTTP_Response $result  Result to send to the client. Usually a `WP_REST_Response`.
 * @param WP_REST_Request  $request Request used to generate the response.
 * @param WP_REST_Server   $server  Server instance.
 * @return true
 */
function deliver_dataset_as_csv( $served, $result, $request, $server ) {
	if ( strpos( $request->get_route(), '/datasets/' ) === false || $request->get_method() !== 'GET' ) {
		return $served;
	}

	$probably_csv = implode( ',', array_keys( $result->get_data() ) ) === 'id,content';
	$csv_content  = $result->get_data()['content'] ?? null;

	if ( ! $probably_csv || empty( $csv_content ) ) {
		return $served;
	}

	if ( ! headers_sent() ) {
		$server->send_header( 'Content-Type', 'text/csv; charset=' . get_option( 'blog_charset' ) );
	}

	echo $csv_content;

	return true;
}
