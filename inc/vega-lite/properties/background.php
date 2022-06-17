<?php
/**
 * Define the Background property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Background;

use Datavis_Block\Vega_Lite\Helpers;
use Datavis_Block\Vega_Lite\Types\Color;
use Datavis_Block\Vega_Lite\Types\Expression;

/**
 * Name of this property.
 */
const PROPERTY = 'background';

/**
 * Apply a format to the value depending on the type specified.
 *
 * @param mixed $value Value to format.
 *
 * @return array|string
 */
function format( $value ) {
	$value = Helpers\parse_value( $value );

	if ( Expression\TYPE === $value['type'] ) {
		return Expression\format( $value['value'] );
	}

	return Color\format( $value['value'] );
}
