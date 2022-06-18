import { JsonEditor } from 'jsoneditor-react';
import React, { useEffect, useRef } from 'react';

import 'jsoneditor-react/es/editor.min.css';

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

	useEffect(
		() => {
			const editor = jsonEditorRef?.current?.jsonEditor;
			if ( editor && value ) {
				editor.update( value );
			}
		},
		[ jsonEditorRef, value ]
	);

	return (
		<JsonEditor
			ref={ jsonEditorRef }
			value={ value }
			onChange={ onChange }
		/>
	);
};

export default ControlledJsonEditor;
