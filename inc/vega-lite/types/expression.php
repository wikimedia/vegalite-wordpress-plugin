<?php
/**
 * Define the Expression type.
 */

namespace Datavis_Block\Vega_Lite\Types\Expression;

/**
 * Name of this type.
 */
const TYPE = 'expression';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return string
 */
function format( $value ) {
	return sprintf( '{expr: "%1$s"}', strval( $value ) );
}
