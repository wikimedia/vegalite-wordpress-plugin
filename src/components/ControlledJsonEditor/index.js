import React, { useState, useMemo, useEffect, useCallback } from 'react';

import { TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './jsoneditor.css';

/**
 * Wrap a textarea with logic to pass valid JSON back up to the parent.
 *
 * If JSON errors are detected, show a notice below the text area and permit
 * continued editing so the user may address the error.
 *
 * Reset textarea content if the JSON spec changes externally to this control.
 *
 * @param {object}   props          React component props.
 * @param {object}   props.value    Value to use in the JSON editor textarea.
 * @param {Function} props.onChange Callback.
 * @returns {Element} JSONEditor component where the reference is tracked.
 */
export const ControlledJsonEditor = ( { value, onChange } ) => {
	const stringifiedJson = useMemo( () => JSON.stringify( value, null, 2 ), [ value ] );
	const [ localValue, setLocalValue ] = useState( stringifiedJson );
	const [ jsonError, setJsonError ] = useState( null );

	useEffect( () => {
		// Update local reference when parent string changes so that UI
		// controlled changes get reflected in the JSON spec text.
		setLocalValue( stringifiedJson );
	}, [ setLocalValue, stringifiedJson ] );

	const localOnChange = useCallback( ( updatedJson ) => {
		setLocalValue( updatedJson );

		let objectValue;
		try {
			objectValue = JSON.parse( updatedJson );
			setJsonError( null );

			if ( updatedJson !== stringifiedJson ) {
				// Only pass valid and changed JSON values back upwards.
				onChange( objectValue );
			}
		} catch ( e ) {
			setJsonError( e.message );
		}
	}, [ setJsonError, stringifiedJson, onChange ] );

	return (
		<>
			<TextareaControl
				className="json-editor"
				label={ __( 'JSON chart specification', 'vegalite-plugin' ) }
				help={ jsonError }
				value={ localValue }
				onChange={ localOnChange }
				height={ 400 }
			/>
		</>
	);
};

export default ControlledJsonEditor;
