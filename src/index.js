/**
 * A collection of all datavis blocks on the page.
 *
 * @type {Element[]}
 * @private
 */
let _instances = [];

export function setupDatavisBlocks() {
	// Get all datavis block ids.
	_instances = [ ...document.querySelectorAll( '[data-datavis]' ) ];
	_instances.map( initializeDatavisBlock );
}

function initializeDatavisBlock( element ) {
	const json = document.getElementById( element.dataset.config ).textContent;
	vegaEmbed( '#'+element.dataset.datavis, JSON.parse( json ) );
}

window.onload = function() {
	setupDatavisBlocks();
};
