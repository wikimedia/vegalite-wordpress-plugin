<?php
/**
 * Render the visualization block. $attributes will be a defined global.
 */

$json     = $attributes['json'] ?? false;
$chart_id = $attributes['chartId'] ?? uniqid( 'chart-' );

$breakpoints = Vegalite_Plugin\Blocks\compute_breakpoint( $chart_id, $block->context['vegalite-plugin/breakpoints'] ?? [] );

// Do not continue if we do not have a json string.
if ( empty( $json ) ) {
	return '';
}

$datavis = sprintf( '%1$s-datavis', $chart_id );
$config  = sprintf( '%1$s-config', $chart_id );

// If we know the target dimensions, set those on the container to minimize CLS.
$inline_style = [];
if ( isset( $json['width'] ) && is_numeric( $json['width'] ) ) {
	$inline_style[] = sprintf( 'width:%dpx', $json['width'] );
}
if ( isset( $json['height'] ) && is_numeric( $json['height'] ) ) {
	$inline_style[] = sprintf( 'height:%dpx', $json['height'] );
}
$inline_style = implode( ';', $inline_style );

ob_start();
?>
<div
	class="visualization-block"
	data-datavis="<?php echo esc_attr( $datavis ); ?>"
	data-config="<?php echo esc_attr( $config ); ?>"
	<?php Vegalite_Plugin\Blocks\maybe_render_attribute( 'data-min-width', $breakpoints['min_width'] ?? 0 ); ?>
	<?php Vegalite_Plugin\Blocks\maybe_render_attribute( 'data-max-width', $breakpoints['max_width'] ?? 0 ); ?>
>
	<script id="<?php echo esc_attr( $config ); ?>" type="application/json"><?php echo wp_kses_post( wp_json_encode( $json ) ); ?></script>
	<div id="<?php echo esc_attr( $datavis ); ?>" <?php Vegalite_Plugin\Blocks\maybe_render_attribute( 'style', $inline_style ); ?>></div>
</div>
<?php
return (string) ob_get_clean();
