<?php
/**
 * Register blocks on the PHP side.
 */

namespace Datavis_Block\Blocks;

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
					'type' => 'string',
					'default' => '',
				],
				'title' => [
					'type' => 'string',
					'default' => '',
				],
				'jsonOverride' => [
					'type' => 'string',
					'default' => '',
				]
			],
		]
	);
}

function render_callback( $attributes ) {
	$title         = $attributes['title'] ?? false;
	$json_override = $attributes['jsonOverride'] ?? false;
	$block_id      = $attributes['blockId'] ?? false;

	if ( empty( $block_id ) ) {
		return '';
	}

	$datavis = sprintf( '%1$s-datavis', $block_id );
	$config   = sprintf( '%1$s-config', $block_id );

	// Clean up input.
	$json_override = preg_replace( '/\r?\n/', '', $json_override );

	ob_start();

	?>
	<div
			class="datavis-block"
			data-datavis="<?php echo esc_attr( $datavis ); ?>"
			data-config="<?php echo esc_attr( $config ); ?>"
	>
		<?php if ( $title ) : ?>
			<h2><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>
		<script id="<?php echo esc_attr( $config ); ?>" type="application/json"><?php echo wp_kses_post( $json_override ); ?></script>
		<div id="<?php echo esc_attr( $datavis ); ?>"></div>
	</div>
	<?php

	$output = ob_get_contents();
	ob_end_clean();
	return $output;
}
