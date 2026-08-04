/**
 * Register the Vega Lite visualization block.
 */
import { registerBlockType } from '@wordpress/blocks';

import '../../store';
import '../../type-definitions';

import { encodeSpec } from '../../util/spec';

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

	deprecated: [
		{
			// Specs before 0.7 were stored as a plain object. Update on editor load
			// into an encoded format that can't be mangled by WP's string sanitizer.
			attributes: {
				chartId: {
					type: 'string',
				},
				json: {
					type: 'object',
				},
			},

			/**
			 * Flag any block which still carries an unencoded spec.
			 *
			 * This block's save() returns null, so it can never be invalid;
			 * opting in here is the only thing which triggers the migration.
			 *
			 * @param {object} attributes Attributes parsed from post content.
			 * @returns {boolean} Whether this block needs migrating.
			 */
			isEligible( attributes ) {
				return !! attributes.json;
			},

			/**
			 * Replace the plain object spec with its encoded equivalent.
			 *
			 * @param {object} attributes      Attributes parsed from post content.
			 * @param {object} attributes.json Vega Lite specification.
			 * @returns {object} Migrated block attributes.
			 */
			migrate( { json, ...attributes } ) {
				return {
					...attributes,
					chartSpec: encodeSpec( json ),
				};
			},

			/**
			 * Return null on save so rendering can be done in PHP.
			 *
			 * @returns {null} Empty so that server can complete rendering.
			 */
			save() {
				return null;
			},
		},
	],
} );
