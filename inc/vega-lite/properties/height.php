<?php
/**
 * Define the Height property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Height;

/**
 * Name of this property.
 */
const PROPERTY = 'height';

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
