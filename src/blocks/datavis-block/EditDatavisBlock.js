/**
 * Edit function for Datavis block.
 */
import React from 'react';

import {
	useBlockProps,
	InspectorControls,
	InspectorAdvancedControls,
} from '@wordpress/block-editor';
import {
	TextControl,
	TextareaControl,
	PanelBody,
	SelectControl,
	ServerSideRender,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { setupDatavisBlocks } from '../../index';

/**
 * Editor UI component for the datavis block.
 *
 * @param {object} props Props
 * @param {object} props.attributes The attributes for the selected block.
 * @param {Function} props.setAttributes The attributes setter for the selected block.
 * @returns {React.ReactNode} Rendered editorial UI.
 * @class
 */
const EditDatavisBlock = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();
	const {
		data,
		description,
		jsonOverride,
		mark,
		name,
		title,
		x,
		y,
	} = attributes;

	const markOptions = [
		{
			label: __( 'Area', 'datavis' ),
			value: 'area',
		},
		{
			label: __( 'Bar', 'datavis' ),
			value: 'bar',
		},
		{
			label: __( 'Circle', 'datavis' ),
			value: 'circle',
		},
		{
			label: __( 'Line', 'datavis' ),
			value: 'line',
		},
		{
			label: __( 'Point', 'datavis' ),
			value: 'point',
		},
		{
			label: __( 'Rect', 'datavis' ),
			value: 'rect',
		},
		{
			label: __( 'Rule', 'datavis' ),
			value: 'rule',
		},
		{
			label: __( 'Square', 'datavis' ),
			value: 'square',
		},
		{
			label: __( 'Text', 'datavis' ),
			value: 'text',
		},
		{
			label: __( 'Tick', 'datavis' ),
			value: 'tick',
		},
	];

	const blockId = blockProps.id;
	setAttributes( { blockId } );

	PreviewDatavis( blockId );

	return (
		<div { ...blockProps }>
			<h2>{ __( 'Datavis Block', 'datavis' ) }</h2>
			<ServerSideRender
				block="datavis-block/datavis-block"
				attributes={ attributes }
			/>
			<InspectorControls>
				<PanelBody
					initialOpen
					title={ __( 'General' ) }
				>
					<TextControl
						label={ __( 'Name', 'datavis' ) }
						value={ name }
						onChange={ ( name ) => setAttributes( { name } ) }
						help={ __( 'Name of the visualization for later reference.', 'datavis' ) }
					/>
					<TextControl
						label={ __( 'Title', 'datavis' ) }
						value={ title }
						onChange={ ( title ) => setAttributes( { title } ) }
						help={ __( 'Title for the plot.', 'datavis' ) }
					/>
					<TextControl
						label={ __( 'Description', 'datavis' ) }
						value={ description }
						onChange={ ( description ) => setAttributes( { description } ) }
						help={ __( 'Description of this mark for commenting purpose.', 'datavis' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Data' ) }>
					<TextareaControl
						label={ __( 'Data', 'datavis' ) }
						help={ __( 'CSV Formatted Data.', 'datavis' ) }
						value={ data }
						onChange={ ( text ) => setAttributes( { data: text } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Mark' ) }>
					<SelectControl
						label={ __( 'Mark', 'datavis' ) }
						value={ mark ? mark : markOptions[0] }
						options={ markOptions }
						onChange={ ( mark ) => setAttributes( { mark } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Encoding' ) }>
					<TextControl
						label={ __( 'X', 'datavis' ) }
						value={ x }
						onChange={ ( x ) => setAttributes( { x } ) }
						help={ __( 'X coordinates of the marks', 'datavis' ) }
					/>
					<TextControl
						label={ __( 'Y', 'datavis' ) }
						value={ y }
						onChange={ ( y ) => setAttributes( { y } ) }
						help={ __( 'Y coordinates of the marks', 'datavis' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextareaControl
					label={ __( 'JSON Override', 'datavis' ) }
					help={ __( 'Override all settings to display a custom Vega Model.', 'datavis' ) }
					value={ jsonOverride }
					onChange={ ( text ) => setAttributes( { jsonOverride: text } ) }
				/>
			</InspectorAdvancedControls>
		</div>
	);
};

/**
 * Hacky way to get the Datavis model to render after updates have been made to the block.
 *
 * This is needed due to the lack of an action when the Server Side render is completed. So we create a interval
 * to check if the block element has been updated, if not it run the Datavis setup.
 *
 * @param {string} blockId Block id.
 * @class
 */
const PreviewDatavis = ( blockId ) => {
	let dataVisLoaded = false,
		killCounter = 0;
	let dataVisLoadedInterval = setInterval( function() {
		const element = document.getElementById( blockId+'-datavis' );
		if ( ! element ) {
			return;
		}
		// To prevent multiple reloads, only run preview if the block element has loaded and the Datavis has not been loaded.
		let loadedElement = element.dataset.loaded ?? false,
			loaded = ( loadedElement === 'true' );

		if ( element && ! loaded ) {
			// Element is present but the dataviz configuration has not yet rendered from the server.
			dataVisLoaded = true;
			element.setAttribute( 'data-loaded', true );
		}
		// Element exists and the dataviz configuration has rendered from the server so kick off the processing of the dataviz configuration.
		if ( dataVisLoaded && loaded ) {
			setupDatavisBlocks();
			clearInterval( dataVisLoadedInterval );
		}
		// If after a period of time kill the interval to not fall into an infinite loop.
		if ( killCounter > 10 ) {
			clearInterval( dataVisLoadedInterval );
		}
		killCounter += 1;
	}, 1000 );
};

export default EditDatavisBlock;
