<?php
/**
 * Define the Color type.
 */

namespace Datavis_Block\Vega_Lite\Types\Color;

/**
 * Name of this type.
 */
const TYPE = 'color';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return string
 */
function format( $value ) {
	$default = 'white';

	return empty( $value ) ? $default : strval( $value );
}
