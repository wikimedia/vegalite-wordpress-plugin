/**
 * Number of bytes to convert per String.fromCharCode call when encoding.
 *
 * @type {number}
 */
const CHUNK_SIZE = 0x8000;

/**
 * Serialize a Vega-Lite specification for storage in a block attribute.
 *
 * Attributes are stored as JSON within block content HTML, so they pass through
 * WP's normal content filters and internal operators like > get encoded in a
 * way that breaks parsing on next editor load.
 *
 * Serializing with Base64 keeps the spec within a safe character set.
 *
 * @param {object} spec Vega-Lite specification.
 * @returns {string} Base64-encoded specification.
 */
export const encodeSpec = ( spec ) => {
	const bytes = new TextEncoder().encode( JSON.stringify( spec ) );

	// Convert in chunks: spreading a large byte array into String.fromCharCode
	// overflows the call stack, and specs with inline datasets get large.
	let binary = '';
	for ( let i = 0; i < bytes.length; i += CHUNK_SIZE ) {
		binary += String.fromCharCode.apply( null, bytes.subarray( i, i + CHUNK_SIZE ) );
	}

	return window.btoa( binary );
};

/**
 * Restore a Vega-Lite specification from a stored block attribute value.
 *
 * @param {?string} encoded Base64-encoded specification.
 * @returns {?object} Vega-Lite specification, or null if it could not be read.
 */
export const decodeSpec = ( encoded ) => {
	if ( ! encoded ) {
		return null;
	}

	try {
		const bytes = Uint8Array.from(
			window.atob( encoded ),
			( character ) => character.charCodeAt( 0 )
		);
		return JSON.parse( new TextDecoder().decode( bytes ) );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.error( 'Could not decode chart specification.', error );
		return null;
	}
};

/**
 * Helper to figure out which available dataset has been set by URL in a spec.
 *
 * Returns the option to manage data inline, if not present.
 *
 * @param {Dataset[]} datasets      Datasets list.
 * @param {object}    json          Vega spec.
 * @param {?object}   defaultOption Value to return if no matching dataset is found.
 * @returns {Dataset|object} Selected dataset, or first option in list.
 */
export const getSelectedDatasetFromSpec = ( datasets, json, defaultOption = null ) => {
	if ( json?.data?.url ) {
		const activeDataset = datasets.find( ( { url } ) => url === json.data.url );
		if ( activeDataset ) {
			return activeDataset;
		}
	}
	return defaultOption;
};
