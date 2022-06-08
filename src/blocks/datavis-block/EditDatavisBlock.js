/**
 * Edit function for Datavis block.
 */
import React from 'react';

import {
	useBlockProps,
	InspectorControls,
	InspectorAdvancedControls,
} from '@wordpress/block-editor';
import { TextControl, TextareaControl, PanelBody, ServerSideRender } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { setupDatavisBlocks } from '../../index';

/**
 * Editor UI component for the datavis block.
 *
 * @param attributes
 * @param setAttributes
 * @returns {React.ReactNode} Rendered editorial UI.
 * @constructor
 */
const EditDatavisBlock = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();
	const {
		jsonOverride,
		title,
	} = attributes;

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
						label={ __( 'Title', 'datavis' ) }
						value={ title }
						onChange={ ( title ) => setAttributes( { title } ) }
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
 * Hacky way to apply an update to the Datavis model.
 *
 * This is needed due to the lack of an action when the Server Side render is completed. So we create a interval
 * to check if the block element has been updated, if not it run the Datavis setup.
 *
 * @param blockId
 * @constructor
 */
const PreviewDatavis = ( blockId ) => {
	let dataVisLoaded = false;
	let dataVisLoadedInterval = setInterval(function() {
		const element = document.getElementById( blockId+'-datavis' );
		if ( ! element ) {
			return;
		}

		// To prevent multiple reloads, only run preview if the block element has loaded and the Datavis has not been loaded.
		const loaded = element.dataset.loaded ?? false;
		if ( element && ! loaded ) {
			dataVisLoaded = true;
			element.setAttribute( 'data-loaded', true );
		}
		if ( dataVisLoaded && !! loaded ) {
			setupDatavisBlocks();
			clearInterval( dataVisLoadedInterval );
		}
	}, 1000);
};

export default EditDatavisBlock;
