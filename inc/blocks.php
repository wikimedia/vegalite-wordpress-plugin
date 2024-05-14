<?php
/**
 * Register blocks on the PHP side.
 */

namespace Vegalite_Plugin\Blocks;

/**
 * Connect namespace functions to actions & hooks.
 */
function bootstrap() : void {
	add_action( 'init', __NAMESPACE__ . '\\register_blocks' );
	add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\\allow_datavis_block_types', 11, 2 );
}

/**
 * Find the min-width and max-width values for a block based on its parent
 * responsive container's provided context, if it has one.
 *
 * @param string $chart_id    ID of the chart being rendered.
 * @param array  $breakpoints Dictionary of pixel breakpoint min-widths keyed by chart ID.
 * @return array Array with 'min-width' and 'max-width' properties whenever relevant.
 */
function compute_breakpoint( string $chart_id, array $breakpoints ) : array {
	if ( empty( $breakpoints ) ) {
		return [];
	}

	$min_width = (int) ( $breakpoints[ $chart_id ] ?? 0 );
	$widths = array_values( $breakpoints );
	sort( $widths, SORT_NUMERIC );
	foreach ( $widths as $breakpoint_min_width ) {
		if ( $breakpoint_min_width > $min_width ) {
			$max_width = $breakpoint_min_width - 1;
			if ( $min_width === 0 ) {
				return [
					'max_width' => $max_width,
				];
			}
			return [
				'min_width' => $min_width,
				'max_width' => $max_width,
			];
		}
	}

	return [
		'min_width' => $min_width,
	];
}

/**
 * Register blocks from their built block.json files.
 */
function register_blocks() : void {
	$block_dirs = glob( dirname( __DIR__ ) . '/build/blocks/*/block.json' );

	foreach ( $block_dirs as $block_dir ) {
		register_block_type_from_metadata( $block_dir );
	}
}

/**
 * Filter the allowed blocks to ensure all our datavis blocks are included.
 *
 * @param bool|string[]            $allowed_block_types  Array of block type slugs, or boolean to enable/disable all.
 * @param \WP_Block_Editor_Context $block_editor_context The current block editor context.
 *
 * @return bool|string[] Filtered allowed blocks list.
 */
function allow_datavis_block_types( $allowed_block_types, $block_editor_context ) {
	if ( is_bool( $allowed_block_types ) ) {
		return $allowed_block_types;
	}
	return array_merge( $allowed_block_types, [
		'vegalite-plugin/visualization',
		'vegalite-plugin/responsive-container',
	] );
}


/**
 * Render a data-attribute with a specified value, IF that value is present.
 *
 * @param string $attribute_name Name of attribute, e.g. data-max-width.
 * @param any    $value          Value of attribute.
 */
function maybe_render_attribute( string $attribute_name, $value ) : void {
	if ( ! empty( $value ) ) {
		echo sprintf( '%s="%s"', $attribute_name, $value );
	}
}
