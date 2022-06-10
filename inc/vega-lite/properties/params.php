<?php
/**
 * Define the Params property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Params;

use Datavis_Block\Vega_Lite\Types\Parameter;

/**
 * Transform of this property.
 */
const PROPERTY = 'params';

/**
 * Apply a format to the value.
 *
 * @param mixed $value Value to format.
 *
 * @return array
 */
function format( $value ) {
	$parameters = [];

	foreach( $value as $parameter ) {
		$parameters[] = Parameter\format( $value );
	}

	return $value;
}
