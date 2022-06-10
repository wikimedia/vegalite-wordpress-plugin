<?php
/**
 * Define the Autosize property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Autosize;

/**
 * Name of this property.
 */
const PROPERTY = 'autosize';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return string
 */
function format( $value ) {
	$default_value  = 'pad';
	$allowed_values = [
		'pad',
		'fit',
		'none',
	];

	if ( in_array( $value, $allowed_values, true ) ) {
		return $value;
	}

	return $default_value;
}
