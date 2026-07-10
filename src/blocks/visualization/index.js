/**
 * Register the Vega Lite visualization block.
 */
import { registerBlockType } from '@wordpress/blocks';

import '../../store';
import '../../type-definitions';

import blockData from './block.json';
import EditVisualization from './EditVisualization';

import './style.scss';

registerBlockType( blockData.name, {
	/**
	 * Render the editor UI for this block.
	 *
	 * @returns {React.ReactNode} Editorial interface to display in block editor.
	 */
	edit: EditVisualization,

	/**
	 * Return null on save so rendering can be done in PHP.
	 *
	 * @returns {null} Empty so that server can complete rendering.
	 */
	save() {
		return null;
	},
} );
