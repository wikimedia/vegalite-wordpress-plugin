<?php
/**
 * Define the Width property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Width;

/**
 * Name of this property.
 */
const PROPERTY = 'width';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return string
 */
function format( $value ) {
	return strval( $value );
}
