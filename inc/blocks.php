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
}

/**
 * Register our block with the PHP framework.
 */
function register_blocks() : void {
	$blocks_folder = dirname( __FILE__, 2 ) . '/src/blocks';

	register_block_type_from_metadata( $blocks_folder . '/responsive-container' );
	register_block_type_from_metadata(
		$blocks_folder . '/visualization',
		[
			'render_callback' => __NAMESPACE__ . '\\render_visualization_block',
		]
	);
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
 * Render a data-attribute with a specified value, IF that value is present.
 *
 * @param string $attribute_name Name of data-attribute, e.g. max-width.
 * @param any    $value          Value of attribute.
 */
function maybe_render_data_attribute( string $attribute_name, $value ) : void {
	if ( ! empty( $value ) ) {
		echo sprintf( 'data-%s="%s"', $attribute_name, $value );
	}
}

/**
 * Render function for block.
 *
 * @param array     $attributes Block attributes.
 * @param string    $content    Block content.
 * @param \WP_Block $block      Block instance.
 *
 * @return string
 */
function render_visualization_block( array $attributes, $content, $block ) : string {
	$json     = $attributes['json'] ?? false;
	$chart_id = $attributes['chartId'] ?? uniqid( 'chart-' );

	$breakpoints = compute_breakpoint( $chart_id, $block->context['vegalite-plugin/breakpoints'] ?? [] );

	// Do not continue if we do not have a json string.
	if ( empty( $json ) ) {
		return '';
	}

	$datavis = sprintf( '%1$s-datavis', $chart_id );
	$config  = sprintf( '%1$s-config', $chart_id );

	ob_start();
	?>
	<div
		class="visualization-block"
		data-datavis="<?php echo esc_attr( $datavis ); ?>"
		data-config="<?php echo esc_attr( $config ); ?>"
		<?php maybe_render_data_attribute( 'min-width', $breakpoints['min_width'] ?? 0 ); ?>
		<?php maybe_render_data_attribute( 'max-width', $breakpoints['max_width'] ?? 0 ); ?>
	>
		<script id="<?php echo esc_attr( $config ); ?>" type="application/json"><?php echo wp_kses_post( wp_json_encode( $json ) ); ?></script>
		<div id="<?php echo esc_attr( $datavis ); ?>"></div>
	</div>
	<?php
	return (string) ob_get_clean();
}
