<?php
/**
 * Register blocks on the PHP side.
 */

namespace Datavis_Block\Blocks;

use Datavis_Block\Vega_Lite\Specification;

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
	register_block_type(
		'datavis-block/datavis-block',
		[
			'render_callback' => __NAMESPACE__ . '\\render_callback',
			'attributes' => [
				'blockId' => [
					'type'    => 'string',
					'default' => '',
				],
				'json' => [
						'type'    => 'object',
						'default' => [],
				]
			],
		]
	);
}

/**
 * Render function for block.
 *
 * @param array $attributes
 *
 * @return string
 */
function render_callback( array $attributes ) : string {
	$json      = $attributes['json'] ?? false;
	$block_id  = $attributes['blockId'] ?? false;

	if ( empty( $block_id ) ) {
		return '';
	}

	$datavis = sprintf( '%1$s-datavis', $block_id );
	$config   = sprintf( '%1$s-config', $block_id );

	// Do not continue if we do not have a json string.
	if ( empty( $json ) ) {
		return '';
	}

	ob_start();
	?>
	<div
			class="datavis-block"
			data-datavis="<?php echo esc_attr( $datavis ); ?>"
			data-config="<?php echo esc_attr( $config ); ?>"
	>
		<script id="<?php echo esc_attr( $config ); ?>" type="application/json"><?php echo wp_kses_post( wp_json_encode( $json ) ); ?></script>
		<div id="<?php echo esc_attr( $datavis ); ?>"></div>
	</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
}
