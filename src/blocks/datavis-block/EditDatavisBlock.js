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

export default EditDatavisBlock;
