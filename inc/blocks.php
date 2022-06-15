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
				'data' => [
						'type'    => 'string',
						'default' => '',
				],
				'description' => [
						'type'    => 'string',
						'default' => '',
				],
				'jsonOverride' => [
						'type'    => 'string',
						'default' => '',
				],
				'mark' => [
						'type'    => 'string',
						'default' => '',
				],
				'name' => [
						'type'    => 'string',
						'default' => '',
				],
				'title' => [
					'type'    => 'string',
					'default' => '',
				],
				'x' => [
						'type'    => 'string',
						'default' => '',
				],
				'y' => [
						'type'    => 'string',
						'default' => '',
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
	$json_override = $attributes['jsonOverride'] ?? false;
	$block_id      = $attributes['blockId'] ?? false;

	if ( empty( $block_id ) ) {
		return '';
	}

	$datavis = sprintf( '%1$s-datavis', $block_id );
	$config   = sprintf( '%1$s-config', $block_id );

	if ( empty( $json_override ) ) {
		$json_string = Specification\build_json( $attributes );
	} else {
		// Clean up input.
		$json_override = preg_replace( '/\r?\n/', '', $json_override );
		$json_string   = $json_override;
	}

	// Do not continue if we do not have a json string.
	if ( empty( $json_string ) ) {
		return '';
	}

	ob_start();
	?>
	<div
			class="datavis-block"
			data-datavis="<?php echo esc_attr( $datavis ); ?>"
			data-config="<?php echo esc_attr( $config ); ?>"
	>
		<script id="<?php echo esc_attr( $config ); ?>" type="application/json"><?php echo wp_kses_post( $json_string ); ?></script>
		<div id="<?php echo esc_attr( $datavis ); ?>"></div>
	</div>
	<?php
	$output = ob_get_contents();
	ob_end_clean();
	return $output;
}
