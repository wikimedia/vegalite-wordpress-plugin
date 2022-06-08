/**
 * Save function for Datavis block.
 */
import React from 'react';

import {
	useBlockProps,
	InspectorAdvancedControls,
	RichText,
} from '@wordpress/block-editor';
import { TextareaControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Editor UI component for the datavis block.
 *
 * @param attributes
 * @param setAttributes
 * @returns {React.ReactNode} Rendered editorial UI.
 * @constructor
 */
const SaveDatavisBlock = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();
	const {
		jsonOverride,
		title,
	} = attributes;

	return (
		<div { ...blockProps }>
			<RichText.Content
				className="datavis__title"
				tagName="h2"
				value={ title }
			/>
			{ ( jsonOverride.length !== 0 ) ? (
				<script type="text/javascript">
					{ window['datavis'+blockProps.id] = JSON.parse( jsonOverride ) }
				</script>
			) : '' }
		</div>
	);
};

export default SaveDatavisBlock;
