<?php
/**
 * Define the Text type.
 */

namespace Datavis_Block\Vega_Lite\Types\Text;

/**
 * Name of this type.
 */
const TYPE = 'text';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return string|array
 */
function format( $value ) {
	if ( is_array( $value ) ) {
		return array_map( 'strval', $value );
	}

	return strval( $value );
}
