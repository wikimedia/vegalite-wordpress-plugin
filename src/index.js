/**
 * A collection of all datavis blocks on the page.
 *
 * @type {Element[]}
 * @private
 */
let _instances = [];

function setupDatavisBlock() {
	// Get all datavis block ids.
	_instances = [ ...document.querySelectorAll( '[data-datavis]' ) ];
	_instances.map( initializeDatavisBlocks );
}

function initializeDatavisBlocks( element ) {
	vegaEmbed( '#'+element.dataset.datavis, JSON.parse(window[element.dataset.datavis]) );
}

window.onload = function() {
	setupDatavisBlock();
};
