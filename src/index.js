/**
 * Front-end functionality for datavis blocks.
 */

/**
 * Debounce function.
 *
 * @param {Function} callback Callback to use.
 * @param {number} wait Time to wait.
 * @returns {Function} A callback.
 */
export const debounce = ( callback, wait ) => {
	let timeoutId = null;
	return ( ...args ) => {
		window.clearTimeout( timeoutId );
		timeoutId = window.setTimeout( () => {
			callback.apply( null, args );
		}, wait );
	};
};

/**
 * A collection of all datavis blocks on the page.
 *
 * @type {Element[]}
 * @private
 */
let _instances = [];

/**
 * Entry function to initialize all datavis blocks to render the blocks datavis model.
 */
export function setupDatavisBlocks() {
	// Get all datavis block ids.
	_instances = [ ...document.querySelectorAll( '[data-datavis]' ) ];
	_instances.map( initializeDatavisBlock );
}

/**
 * Callback to initialize a datavis block to render its model.
 *
 * @param {Element} element Datavis block element.
 */
function initializeDatavisBlock( element ) {
	const config = element.dataset.config,
		datavis = element.dataset.datavis;

	if ( typeof vegaEmbed === 'undefined' ) {
		return;
	}

	if ( ! config || ! datavis ) {
		return;
	}

	const jsonElement = document.getElementById( config );
	if ( ! jsonElement ) {
		return;
	}

	/* eslint-disable-next-line no-undef */
	vegaEmbed( '#'+element.dataset.datavis, JSON.parse( jsonElement.textContent ) );
}

/**
 * Kick things off after load.
 */
window.onload = function() {
	setupDatavisBlocks();
};
