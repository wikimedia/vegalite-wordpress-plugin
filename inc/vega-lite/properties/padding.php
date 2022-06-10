<?php
/**
 * Define the Padding property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Padding;

use Datavis_Block\Vega_Lite\Helpers;
use Datavis_Block\Vega_Lite\Types\Expression;

/**
 * Name of this property.
 */
const PROPERTY = 'padding';

/**
 * Apply a format to the value depending on the type specified.
 *
 * @param mixed $value Value to format.
 *
 * @return string
 */
function format( $value ) : string {
	$value = Helpers\parse_value( $value );

	// Expression.
	if ( $value['type'] === Expression\TYPE ) {
		return Expression\format( $value );
	}

	// Object.
	if ( is_array( $value['value'] ) ) {
		return wp_json_encode( $value['value'] );
	}

	return strval( $value['value'] );
}
