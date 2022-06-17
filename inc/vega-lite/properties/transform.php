<?php
/**
 * Define the Transform property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Transform;

use Datavis_Block\Vega_Lite\Types\Transform;

/**
 * Transform of this property.
 */
const PROPERTY = 'transform';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return array
 */
function format( $value ) {
	$transforms = [];

	foreach( $value as $transform ) {
		$transforms[] = Transform\format( $value );
	}

	return $value;
}
