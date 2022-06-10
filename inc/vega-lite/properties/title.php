<?php
/**
 * Define the Title property.
 */

namespace Datavis_Block\Vega_Lite\Properties\Title;

use Datavis_Block\Vega_Lite\Types\Text;
use Datavis_Block\Vega_Lite\Types\Title_Params;

/**
 * Name of this property.
 */
const PROPERTY = 'title';

/**
 * Apply a format to the value depending on the type specified.
 *
 * @param mixed $value Value to format.
 *
 * @return array|string
 */
function format( $value ) {
	$type = $value['type'] ?? null;

	if ( $type === Title_Params\TYPE ) {
		return Title_Params\format( $value );
	}

	return Text\format( $value );
}
