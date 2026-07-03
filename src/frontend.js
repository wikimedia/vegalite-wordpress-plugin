/**
 * Front-end functionality for vega-lite blocks.
 */
import vegaEmbed from 'vega-embed';

import './styles.scss';

window.vegaLitePlugin = window.vegaLitePlugin || {};
window.vegaLitePlugin.visualizations = new Map();

/**
 * A collection of all vega-lite blocks on the page.
 *
 * @type {Element[]}
 * @private
 */
let _instances = [];

/**
 * Entry function to initialize all vega-lite blocks to render the blocks datavis model.
 */
function setupDatavisBlocks() {
	// Get all vega-lite block ids on the page.
	_instances = [ ...document.querySelectorAll( '[data-datavis]' ) ];
	renderAllBlocks();
}

/**
 * Render charts, called on load and periodically as page dimensions change.
 */
function renderAllBlocks() {
	_instances.map( initializeDatavisBlock );
}

/**
 * Callback to initialize a vega-lite block to render its model.
 *
 * @param {Element} element Vega-Lite block element.
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

	// Handle responsive breakpoint values if present.
	const minWidth = element.dataset.minWidth;
	const maxWidth = element.dataset.maxWidth;
	const { width } = element.getBoundingClientRect();
	const doNotRender = ! ! ( ( minWidth && width < minWidth ) || ( maxWidth && maxWidth <= width ) );
	element.classList.toggle( 'chart-hidden', doNotRender );
	if ( doNotRender ) {
		return;
	}

	const embedOptions = element.dataset.embedOptions
		? JSON.parse( element.dataset.embedOptions )
		: {};

	// Render if possible and necessary.
	if ( typeof vegaEmbed === 'function' && ! jsonElement.classList.contains( 'vega-embed' ) ) {
		const spec = JSON.parse( jsonElement.textContent );
		vegaEmbed(
			document.getElementById( element.dataset.datavis ),
			spec,
			{
				actions: false,
				...embedOptions,
			}
		).then( ( { view } ) => {
			const visNode = document.getElementById( element.dataset.datavis );

			// Add initialized visualization to Map, keyed by parent DOM node.
			window.vegaLitePlugin.visualizations.set( visNode, {
				id: element.dataset.datavis,
				view,
				spec,
			} );

			// Notify the page that this chart is ready. External code can
			// listen for this event instead of polling the visualizations Map.
			element.dispatchEvent(
				new CustomEvent( 'vegalite:ready', {
					bubbles: true,
					detail: { id: element.dataset.datavis, view, spec },
				} )
			);

			// Forward Vega click events as DOM events so external code can
			// respond to segment clicks without coupling to the Vega View API.
			view.addEventListener( 'click', ( _event, item ) => {
				if ( ! item?.datum ) {
					return;
				}
				element.dispatchEvent(
					new CustomEvent( 'vegalite:click', {
						bubbles: true,
						detail: { id: element.dataset.datavis, datum: item.datum },
					} )
				);
			} );
		} );
	}
}

// Kick things off after load.
window.addEventListener( 'load', setupDatavisBlocks );

// Listen to window.resize events and re-render graphs with a (debounced)
// callback to update which responsive variants are shown.
let timeout = false;
window.addEventListener( 'resize', function() {
	// clear the timeout
	clearTimeout( timeout );
	// start timing for event "completion"
	timeout = setTimeout( renderAllBlocks, 200 );
} );
