import React, { useCallback, useState } from 'react';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, Icon, PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { dispatch, useSelect } from '@wordpress/data';
import { __, _n, sprintf } from '@wordpress/i18n';

/**
 * Export registration information for Responsive Container block.
 */
import blockData from './block.json';

import './edit-responsive-container.scss';

export const name = blockData.name;

const BLOCK_TEMPLATE = [
	[ 'vegalite-plugin/visualization', {} ],
];

/**
 * Determine the display text for a breakpoint based on the other available
 * visualizations and their configured sizes.
 *
 * TODO: Neither this nor the overall block logic handles two variants with
 * the same specified minimum size.
 *
 * @param {number[]} breakpoints Array of breakpoint min-width values (in px).
 * @param {number}   index       Index of currently-active block's breakpoint.
 * @returns {string} Rendered label for the specified breakpoint.
 */
const getBreakpointDescription = ( breakpoints, index ) => {
	if ( breakpoints.length === 1 ) {
		return __( 'Default visualization', 'vegalite-plugin' );
	}

	const sortedBreakpoints = breakpoints.sort( ( a, b ) => {
		return +a < +b ? -1 : 1;
	} );
	const sortedIndex = sortedBreakpoints.indexOf( breakpoints[ index ] );

	const lowerBound = sortedBreakpoints[ sortedIndex ];
	const upperBound = sortedBreakpoints[ sortedIndex + 1 ] || null;

	if ( lowerBound && upperBound ) {
		return sprintf(
			__( 'Display between %1$dpx and %2$dpx', 'vegalite-plugin' ),
			lowerBound,
			upperBound
		);
	}
	if ( lowerBound ) {
		return sprintf( __( 'Display above %dpx', 'vegalite-plugin' ), lowerBound );
	}
	if ( upperBound ) {
		return sprintf( __( 'Display below %dpx', 'vegalite-plugin' ), upperBound );
	}
	return __( 'Default visualization', 'vegalite-plugin' );
};

/**
 * Editorial UI for the responsive blocks.
 *
 * @param {object}   props               React component props.
 * @param {object}   props.attributes    The attributes for the selected block.
 * @param {Function} props.setAttributes The attributes setter for the selected block.
 * @param {boolean}  props.isSelected    Whether the block is selected in the editor.
 * @param {string}   props.clientId      Editor client ID for the container block.
 * @returns {React.ReactNode} Rendered editorial UI.
 */
const EditResponsiveVisualizationContainer = ( { attributes, setAttributes, isSelected, clientId, ...rest } ) => {
	const blockProps = useBlockProps( {
		className: 'responsive-visualization-container',
	} );
	const { innerBlocks, isChildSelected } = useSelect( ( select ) => ( {
		innerBlocks: select( 'core/block-editor' ).getBlocks( clientId ),
		isChildSelected: select( 'core/block-editor' ).hasSelectedInnerBlock( clientId ),
	} ) );
	const { breakpoints } = attributes;
	const [ activePanel, setActivePanel ] = useState( 0 );

	const updateBreakpoint = useCallback( ( blockIndex, newMinWidth ) => {
		const sortedCharts = innerBlocks
			.map( ( block, idx ) => ( {
				active: idx === activePanel,
				breakpoint: ( idx === blockIndex ) ? newMinWidth : breakpoints[ idx ],
				block,
			} ) )
			.sort( ( a, b ) => {
				return a.breakpoint < b.breakpoint ? -1 : 1;
			} );

		const reorderedInnerBlocks = sortedCharts.map( ( { block } ) => block );
		const reorderedBreakpoints = sortedCharts.map( ( { breakpoint } ) => breakpoint );

		setAttributes( { breakpoints: reorderedBreakpoints } );

		const blockOrderChanged = reorderedInnerBlocks.reduce(
			( mismatch, block, idx ) => {
				return mismatch || ( innerBlocks[ idx ].clientId !== block.clientId );
			},
			false
		);

		if ( blockOrderChanged ) {
			const { replaceInnerBlocks } = dispatch( 'core/block-editor' );
			replaceInnerBlocks( clientId, reorderedInnerBlocks );
			setActivePanel( sortedCharts.findIndex( ( { active } ) => active ) );
		}
	}, [ innerBlocks, breakpoints, activePanel, clientId, setAttributes, setActivePanel ] );

	const addSizeVariant = useCallback( () => {
		const { insertBlock } = dispatch( 'core/block-editor' );
		insertBlock(
			createBlock( 'vegalite-plugin/visualization', innerBlocks[ innerBlocks.length - 1 ].attributes ),
			innerBlocks.length,
			clientId
		);
		setAttributes( {
			breakpoints: [ ...breakpoints, ( +breakpoints[ breakpoints.length - 1 ] + 320 ) ],
		} );
	}, [ clientId, innerBlocks, breakpoints, setAttributes ] );

	const removeSizeVariant = useCallback( ( blockIdToRemove ) => {
		const { removeBlock } = dispatch( 'core/block-editor' );
		const indexOfBlock = innerBlocks.findIndex( ( { clientId } ) => clientId === blockIdToRemove );
		console.log( { blockIdToRemove, indexOfBlock, innerBlocks, breakpoints } ); // eslint-disable-line
		removeBlock( blockIdToRemove );
		setAttributes( {
			breakpoints: breakpoints.filter( ( breakpoint, idx ) => idx === indexOfBlock ),
		} );
		setActivePanel( indexOfBlock > 0 ? indexOfBlock - 1 : 0 );
	}, [ innerBlocks, breakpoints, setActivePanel, setAttributes ] );

	return (
		<div { ...blockProps }>
			<PanelRow>
				<span>
					<Icon icon="smartphone" />
					<Icon icon="tablet" />
					<Icon icon="desktop" />
					{ ' ' }
					{
						sprintf(
							// Translators: %s - Number of responsive chart variations.
							_n( '%s chart variation', '%d chart variations', innerBlocks.length, 'vegalite-plugin' ),
							innerBlocks.length
						)
					}
				</span>
			</PanelRow>
			{ ( isSelected || isChildSelected ) ? (
				<>
					{ innerBlocks.map( ( block, idx ) => {
						return (
							<PanelBody
								opened={ activePanel === idx }
								title={ getBreakpointDescription( breakpoints, idx ) }
								onToggle={ () => setActivePanel( idx ) }
							>
								{ activePanel === idx ? (
									<>
										<PanelRow>
											<TextControl
												label={ __( 'Minimum width (px)', 'vegalite-plugin' ) }
												value={ +breakpoints[idx] }
												type="number"
												onChange={ ( minWidth ) => updateBreakpoint( idx, +minWidth ) }
											/>
											<Button
												className="is-tertiary is-destructive"
												icon="trash"
												onClick={ () => removeSizeVariant( block.clientId ) }
											>
												{ __( 'Delete variant', 'vegalite-plugin' ) }
											</Button>
										</PanelRow>
										<PanelRow>
											<style type="text/css">
												{ `[data-block="${ block.clientId }"] {
													display: block !important;
												}` }
											</style>
										</PanelRow>
									</>
								) : null }
							</PanelBody>
						);
					} ) }
					<InnerBlocks
						allowedBlocks={ [ 'vegalite-plugin/visualization' ] }
						template={ BLOCK_TEMPLATE }
						renderAppender={ false }
					/>
					<PanelRow>
						<Button
							className="is-tertiary responsive-visualization-container-add-new"
							icon="plus"
							onClick={ addSizeVariant }
						>
							{ __( 'Add visualization size variant', 'vegalite-plugin' ) }
						</Button>
					</PanelRow>
				</>
			) : (
				<>
					<InnerBlocks
						allowedBlocks={ [ 'vegalite-plugin/visualization' ] }
						template={ BLOCK_TEMPLATE }
						renderAppender={ false }
					/>
					<style type="text/css">
						{ `[data-block="${ innerBlocks[0]?.clientId }"] {
							display: block !important;
						}` }
					</style>
				</>
			) }
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
