<?php
/**
 * Define the specification for a Vega Lite model.
 *
 * Based on the v5 specification. https://vega.github.io/vega-lite/docs/spec.html
 */

namespace Datavis_Block\Vega_Lite\Specification;

use Datavis_Block\Vega_Lite\Properties;

/**
 * Create JSON of specification.
 *
 * @param array $specification
 *
 * @return string
 */
function build_json( array $specification ) {
	$properties = [
		// Properties for top-level specification (e.g., standalone single view specifications).
		'$schema'                      => $specification[ '$schema' ] ?? 'https://vega.github.io/schema/vega-lite/v5.json',
		Properties\Background\PROPERTY => Properties\Background\format( $specification[ Properties\Background\PROPERTY ] ?? '' ),
		Properties\Padding\PROPERTY    => Properties\Padding\format( $specification[ Properties\Padding\PROPERTY ] ?? '' ),
		Properties\Autosize\PROPERTY   => Properties\Autosize\format( $specification[ Properties\Autosize\PROPERTY ] ?? '' ),
		Properties\Config\PROPERTY      => Properties\Config\format( $specification[ Properties\Config\PROPERTY ] ?? '' ),

		// Properties for any specifications.
		Properties\Name\PROPERTY        => Properties\Name\format( $specification[ Properties\Name\PROPERTY ] ?? '' ),
		Properties\Description\PROPERTY => Properties\Description\format( $specification[ Properties\Description\PROPERTY ] ?? '' ),
		Properties\Title\PROPERTY       => Properties\Title\format( $specification[ Properties\Title\PROPERTY  ] ?? '' ),
		Properties\Data\PROPERTY        => Properties\Data\format( $specification[ Properties\Data\PROPERTY ] ?? '' ),
		Properties\Transform\PROPERTY   => Properties\Transform\format( $specification[ Properties\Transform\PROPERTY ] ?? '' ),
		Properties\Params\PROPERTY      => Properties\Params\format( $specification[ Properties\Params\PROPERTY ] ?? '' ),
	];

	// Only implement single view specification, for now.
	$single_view = [
		Properties\Mark\PROPERTY       => Properties\Mark\format( $specification[ Properties\Mark\PROPERTY ] ?? '' ),
		Properties\Encoding\PROPERTY   => Properties\Encoding\format( $specification[ Properties\Encoding\PROPERTY ] ?? '' ),
		Properties\Width\PROPERTY      => Properties\Width\format( $specification[ Properties\Width\PROPERTY ] ?? '' ),
		Properties\Height\PROPERTY     => Properties\Height\format( $specification[ Properties\Height\PROPERTY ] ?? '' ),
		Properties\View\PROPERTY       => Properties\View\format( $specification[ Properties\View\PROPERTY ] ?? '' ),
		Properties\Projection\PROPERTY => Properties\Projection\format( $specification[ Properties\Projection\PROPERTY ] ?? '' ),
	];

	$json = wp_json_encode( array_filter( array_merge( $properties, $single_view ) ) );

	return is_string( $json ) ? $json : '';
}
