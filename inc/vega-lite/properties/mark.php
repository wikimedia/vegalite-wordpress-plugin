<?php
/**
 * Define the Mark property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Mark;

/**
 * Name of this property.
 */
const PROPERTY = 'mark';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return string
 */
function format( $value ) {
	$allowed_values = [
		'bar',
		'circle',
		'square',
		'tick',
		'line',
		'area',
		'point',
		'rule',
		'geoshape',
		'text',
	];
	// TODO: Implement mark definition object type.
	if ( in_array( $value, $allowed_values, true ) ) {
		return $value;
	}

	return $allowed_values[0];
}
