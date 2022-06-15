<?php
/**
 * Define the Name property. Name of the visualization for later reference.
 */

namespace Datavis_Block\Vega_Lite\Properties\Name;

/**
 * Name of this property.
 */
const PROPERTY = 'name';

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
