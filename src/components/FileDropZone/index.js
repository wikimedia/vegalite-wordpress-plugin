import classNames from 'classnames';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import './file-drop-zone.scss';

/**
 * Render an editor for a specific CSV file.
 *
 * @param {object}          props             React component props.
 * @param {Function}        props.onDrop      Callback which will receive the dropped file.
 * @param {string}          props.message     Message displaying in drop zone on drag over.
 * @param {string}          [props.className] Optional additional CSS classes.
 * @param {React.ReactNode} [props.children]  React child content.
 * @returns {React.ReactNode} React drop zone interface.
 */
const FileDropZone = ( {
	className = '',
	onDrop,
	message = null,
	children = null,
} ) => {
	const dropRef = useRef( null );
	const [ isDragOver, setIsDragOver ] = useState( false );

	const onDragOver = useCallback( ( evt ) => {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
		evt.dataTransfer.setData( 'text/plain', evt.target.id );
		setIsDragOver( true );
	}, [] );

	const onDragEnd = useCallback( ( evt ) => setIsDragOver( false ), [] );

	// Support drag and drop CSV onto text field.
	const onFileDrop = useCallback( ( evt ) => {
		evt.stopPropagation();
		evt.preventDefault();
		const file = evt.dataTransfer.files[0];
		const reader = new FileReader();
		reader.addEventListener( 'loadend', ( event ) => {
			onDrop( {
				file: file.file,
				content: event.target.result,
			} );
		} );
		reader.readAsText( file );
		setIsDragOver( false );
	}, [ onDrop ] );

	useEffect( () => {
		if ( ! dropRef.current ) {
			return;
		}

		const currentRef = dropRef.current;
		currentRef.addEventListener( 'drop', onFileDrop );
		currentRef.addEventListener( 'dragenter', onDragOver );
		currentRef.addEventListener( 'dragend', onDragEnd );
		currentRef.addEventListener( 'dragleave', onDragEnd );

		/** Clean up event listeners on unmount. */
		return () => {
			currentRef.removeEventListener( 'drop', onFileDrop );
			currentRef.removeEventListener( 'dragenter', onDragOver );
			currentRef.removeEventListener( 'dragleave', onDragEnd );
			currentRef.removeEventListener( 'dragend', onDragEnd );
		};
	}, [ dropRef.current ] ); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className={ classNames( 'file-drop-zone', className, { 'file-drop-zone-active': isDragOver } ) }
			ref={ dropRef }
			data-message={ message }
		>
			{ children }
		</div>
	);
};

export default FileDropZone;
