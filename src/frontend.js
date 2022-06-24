/**
 * Front-end functionality for datavis blocks.
 */
import vegaEmbed from 'vega-embed';

import './styles.scss';

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
function setupDatavisBlocks() {
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
	const config = element.dataset.config;
	const datavis = element.dataset.datavis;

	if ( ! config || ! datavis ) {
		return;
	}

	const jsonElement = document.getElementById( config );
	if ( ! jsonElement ) {
		return;
	}

	if ( typeof vegaEmbed === 'function' ) {
		vegaEmbed( document.getElementById( element.dataset.datavis ), JSON.parse( jsonElement.textContent ) );
	}
}

// Kick things off after load.
window.addEventListener( 'load', setupDatavisBlocks );
