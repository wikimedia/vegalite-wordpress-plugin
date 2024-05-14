import { registerBlockType } from '@wordpress/blocks';

// Initialize store
import '../../store';
import '../../styles.scss';
import '../../type-definitions';

import metadata from './block.json';
import EditVisualization from './EditVisualization';

import './index.css';

const blockSettings = {
	...metadata,

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
}
registerBlockType( metadata.name, blockSettings );

console.log( 'Registered', blockSettings );
