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

	// Clean up input.
	$json_override = preg_replace( '/\r?\n/', '', $json_override );

	if ( empty( $block_id ) ) {
		return '';
	}

	// Replace `-` with `_`.
	$block_id = str_replace( '-', '_', $block_id );

	ob_start();

	?>
	<div class="datavis-block" data-datavis="<?php echo esc_attr( $block_id ); ?>">
		<?php if ( $title ) : ?>
			<h2><?php echo esc_html( $title ); ?></h2>
		<?php endif; ?>
		<?php if ( $json_override ) : ?>
			<script type="text/javascript">
				window[ '<?php echo esc_js( $block_id ); ?>' ] = <?php echo wp_kses_post( $json_override ); ?>;
			</script>
		<?php endif; ?>
		<div id="<?php echo esc_attr( $block_id ) ?>"></div>
	</div>
	<?php

	$output = ob_get_contents();
	ob_end_clean();
	return $output;
}
