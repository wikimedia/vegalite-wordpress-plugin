import React from 'react';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * Export registration information for Responsive Container block.
 */
import blockData from './block.json';

export const name = blockData.name;

const BLOCK_TEMPLATE = [
	[ 'vegalite-plugin/visualization', {} ],
];

/**
 * Editorial UI for the responsive blocks.
 *
 * @param {object}   props               React component props.
 * @param {object}   props.attributes    The attributes for the selected block.
 * @param {Function} props.setAttributes The attributes setter for the selected block.
 * @param {boolean}  props.isSelected    Whether the block is selected in the editor.
 * @returns {React.ReactNode} Rendered editorial UI.
 */
const EditResponsiveVisualizationContainer = ( props ) => {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ [ 'vegalite-plugin/visualization' ] }
				template={ BLOCK_TEMPLATE }
			/>
		</div>
	);
};

/**
 * Render the responsive visualization container for saving in post content.
 *
 * @param {object}   props               React component props.
 * @param {object}   props.attributes    The attributes for the selected block.
 * @returns {React.ReactNode} Rendered editorial UI.
 */
const SaveResponsiveVisualizationContainer = ( props ) => {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
};

export const settings = {
	// Apply the block settings from the JSON configuration file.
	...blockData,

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'vegalite-plugin/visualization' ],
				transform: ( attributes ) => {
					return createBlock(
						blockData.name,
						{},
						// Recreate the existing visualization as an inner block.
						[ createBlock( 'vegalite-plugin/visualization', attributes ) ]
					);
				},
			},
		],
	},

	edit: EditResponsiveVisualizationContainer,

	save: SaveResponsiveVisualizationContainer,
};
