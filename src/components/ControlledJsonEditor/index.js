import { JsonEditor } from 'jsoneditor-react';
import React, { useEffect, useRef, useState } from 'react';

import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import vegaLiteSchema from '../../schema/vega-lite.v5.json';

import 'jsoneditor-react/es/editor.min.css';
import './jsoneditor.css';

/**
 * Create a JSONEditor where the reference is tracked in order to update the editor component value outside of the editor.
 *
 * @param {object}   props          React component props.
 * @param {object}   props.value    Value to use in the JSON Editor.
 * @param {Function} props.onChange Callback.
 * @returns {Element} JSONEditor component where the reference is tracked.
 */
export const ControlledJsonEditor = ( { value, onChange } ) => {
	const jsonEditorRef = useRef();

	const [ isCodeMode, setCodeMode ] = useState( false );

	useEffect(
		() => {
			const editor = jsonEditorRef?.current?.jsonEditor;
			if ( editor && value ) {
				editor.update( value );
			}
		},
		[ jsonEditorRef, value ]
	);

	useEffect(
		() => {
			const editor = jsonEditorRef?.current?.jsonEditor;
			if ( editor ) {
				editor.setMode( isCodeMode ? 'text' : 'tree' );
			}
		},
		[ jsonEditorRef, isCodeMode ]
	);

	return (
		<>
			<ToggleControl
				label={ __( 'Edit raw JSON' ) }
				checked={ isCodeMode }
				onChange={ () => setCodeMode( ! isCodeMode ) }
			/>
			<JsonEditor
				ref={ jsonEditorRef }
				value={ value }
				onChange={ onChange }
				schema={ vegaLiteSchema }
			/>
		</>
	);
};

export default ControlledJsonEditor;
