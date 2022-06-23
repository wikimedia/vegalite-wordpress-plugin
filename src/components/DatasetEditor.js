/* eslint-disable no-console */
import React, { useCallback, useEffect, useState, useMemo } from 'react';

// eslint-disable-next-line
import { TextControl, Button, SelectControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { getDataset, getDatasets, updateDataset } from '../util/datasets';

const INLINE = 'inline';

const defaultDatasets = [];

/** No-op function for use as argument default. */
const noop = () => {};

/**
 * Render an editor for a specific CSV file.
 *
 * @param {object}   props          React component props.
 * @param {string}   props.filename Filename of CSV being edited.
 * @param {number}   props.postId   ID of post being edited.
 * @param {Function} props.onSave   Callback to run when CSV changes.
 * @returns {React.ReactNode} Rendered react UI.
 */
const CSVEditor = ( { filename, postId, onSave = noop } ) => {
	const [ dataset, setDataset ] = useState( '' );

	useEffect( () => {
		if ( filename !== INLINE && ( ! dataset || ! dataset.content ) ) {
			getDataset( postId, filename ).then( ( datasetResponse ) => {
				if ( datasetResponse.content ) {
					setDataset( datasetResponse );
				}
			} );
		}
	}, [ dataset, postId, filename, setDataset ] );

	const onChange = useCallback( ( content ) => {
		if ( content === dataset.content ) {
			return;
		}
		setDataset( {
			...dataset,
			content,
		} );
	}, [ dataset, setDataset ] );

	const onSaveButton = useCallback( () => {
		if ( dataset.content && dataset.filename ) {
			updateDataset( {
				filename,
				content: dataset,
			}, { id: postId } ).then( onSave );
		}
	}, [ dataset, postId, filename, onSave ] );

	return (
		<>
			<TextareaControl
				label={ __( 'Data', 'datavis' ) }
				help={ __( 'Edit dataset as CSV', 'datavis' ) }
				value={ dataset.content }
				onChange={ onChange }
			/>
			<Button onClick={ onSaveButton }>Save</Button>
		</>
	);
};

/**
 * Render the Data Editor form.
 *
 * @param {object} props               React component props.
 * @param {object} props.json          Vega spec being edited.
 * @param {object} props.setAttributes Block editor setAttributes method.
 * @returns {React.ReactNode} Rendered form.
 */
const DatasetEditor = ( { json, setAttributes } ) => {
	const [ datasets, setDatasets ] = useState( defaultDatasets );
	const [ selectedDataset, setSelectedDataset ] = useState( INLINE );

	const { postId } = useSelect( ( select ) => ( {
		postId: select( 'core/editor' ).getEditedPostAttribute( 'id' ),
	} ) );

	useEffect( () => {
		if ( ! datasets.length ) {
			getDatasets( { id: postId } ).then( ( datasetList ) => {
				setDatasets( datasetList );
			} );
		}
	}, [ datasets, postId ] );

	const options = useMemo( () => {
		return [ {
			label: __( 'Inline data', 'datavis' ),
			value: INLINE,
		} ].concat( datasets.map( ( dataset ) => ( {
			label: dataset.filename,
			value: dataset.filename,
		} ) ) ).filter( Boolean );
	}, [ datasets ] );

	const onChangeSelected = useCallback( ( selected ) => {
		setSelectedDataset( selected );
		const selectedDatasetObj = datasets.find( ( dataset ) => dataset.filename === selected );
		if ( selected === INLINE || ! selectedDatasetObj || ! selectedDatasetObj.url ) {
			if ( json.data?.url ) {
				// Wipe out any URL property to set back to inline mode.
				json.data = [];
				setAttributes( { json: { ...json } } );
			}
			return;
		}

		json.data = { url: selectedDatasetObj.url };
		setAttributes( { json: { ...json } } );
	}, [ datasets, json, setAttributes ] );

	const forceChartUpdate = useCallback( () => {
		setAttributes( { json: { ...json } } );
	}, [ json, setAttributes ] );

	return (
		<div>
			<SelectControl
				label={ __( 'Datasets', 'datavis' ) }
				value={ selectedDataset }
				options={ options }
				onChange={ onChangeSelected }
			/>
			<small><em>Todo: "new" button (which would show a form to enter the [required] 'filename'); "delete" button (low priority)</em></small>

			{ selectedDataset !== INLINE ? (
				<CSVEditor
					postId={ postId }
					filename={ selectedDataset }
					onChange={ forceChartUpdate }
				/>
			) : (
				<p>{ __( 'Edit data values as JSON in the Chart Specification tab.', 'datavis' ) }</p>
			) }
		</div>
	);
};

export default DatasetEditor;
