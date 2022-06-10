<?php
/**
 * Helper functions.
 */

namespace Datavis_Block\Vega_Lite\Helpers;

function parse_value( $value ) {
	return [
		'type'  => $value['type'] ?? null,
		'value' => $value['value'] ?? '',
	];
}
