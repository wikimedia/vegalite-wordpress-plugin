/* eslint-disable no-console */
import React, { useCallback, useEffect, useState, useMemo } from 'react';

// eslint-disable-next-line
import { Icon, TextControl, Button, PanelRow, SelectControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { createDataset, getDataset, getDatasets, updateDataset } from '../util/datasets';

import './dataset-editor.scss';

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
	const [ dataset, setDataset ] = useState( null );

	useEffect( () => {
		if ( filename !== INLINE && ! dataset?.content ) {
			getDataset( postId, filename ).then( ( datasetResponse ) => {
				if ( datasetResponse.content ) {
					setDataset( datasetResponse );
				}
			} );
		}
	}, [ dataset, postId, filename, setDataset ] );

	const onChange = useCallback( ( content ) => {
		if ( content !== dataset?.content ) {
			setDataset( {
				...dataset,
				content,
			} );
		}
	}, [ dataset, setDataset ] );

	const onSaveButton = useCallback( () => {
		if ( dataset?.content && dataset?.filename ) {
			updateDataset.throttled( dataset, { id: postId } ).then( onSave );
		}
	}, [ dataset, postId, onSave ] );

	return (
		<>
			<TextareaControl
				label={ __( 'Data', 'datavis' ) }
				help={ __( 'Edit dataset as CSV', 'datavis' ) }
				value={ dataset?.content || '' }
				onChange={ onChange }
			/>
			<Button onClick={ onSaveButton }>Save</Button>
		</>
	);
};

/**
 * Sanitize a string for use as a filename.
 *
 * @param {string} str Input string.
 * @returns {string} kebab-case string.
 */
const toLowerKebabCase = ( str ) => str
	.trim()
	.toLowerCase()
	.split( /[^A-Za-z0-9_]+/ )
	.filter( Boolean )
	.join( '-' );

/**
 * Render a New Dataset form.
 *
 * @param {object} props        React component props.
 * @param {object} props.onSave List of available datasets.
 * @returns {React.ReactNode} Rendered form.
 */
const NewDatasetForm = ( { onSave } ) => {
	const [ filename, setFilename ] = useState( '' );
	const { postId } = useSelect( ( select ) => ( {
		postId: select( 'core/editor' ).getEditedPostAttribute( 'id' ),
	} ) );

	const onSubmit = useCallback( () => {
		if ( ! filename.trim() || ! postId ) {
			// TODO: Show an error.
			return;
		}
		const dataset = {
			filename: `${ toLowerKebabCase( filename.replace( /\.csv$/i, '' ) ) }.csv`,
			content: '',
		};
		createDataset( dataset, { id: postId } ).then( ( result ) => {
			console.log( result );
			onSave( result );
		} );
	}, [ filename, postId, onSave ] );

	const submitOnEnter = useCallback( ( evt ) => {
		if ( evt.code === 'Enter' ) {
			onSubmit();
		}
	}, [ onSubmit ] );

	return (
		<PanelRow className="datasets-control-row">
			<TextControl
				label={ __( 'CSV dataset name', 'datavis' ) }
				value={ filename }
				onChange={ setFilename }
				onKeyDown={ submitOnEnter }
			/>
			<Button
				className="dataset-control-button is-primary"
				onClick={ onSubmit }
			>{ __( 'Save dataset', 'dataset' ) }</Button>
		</PanelRow>
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

	const updateDatasets = useCallback( () => {
		getDatasets( { id: postId } ).then( ( datasetList ) => {
			setDatasets( datasetList );
		} );
	}, [ postId ] );

	useEffect( () => {
		if ( ! datasets.length ) {
			updateDatasets();
		}
	}, [ datasets, updateDatasets ] );

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

	const [ isAddingNewDataset, setIsAddingNewDataset ] = useState( false );
	const onAddNewDataset = useCallback( ( result ) => {
		setIsAddingNewDataset( false );
		if ( result && result.filename ) {
			updateDatasets();
			setSelectedDataset( result.filename );
		}
	}, [ setIsAddingNewDataset, updateDatasets, setSelectedDataset ] );

	return (
		<div>
			{ isAddingNewDataset ? (
				<NewDatasetForm onSave={ onAddNewDataset } />
			) : (
				<PanelRow className="datasets-control-row">
					<SelectControl
						label={ __( 'Datasets', 'datavis' ) }
						value={ selectedDataset }
						options={ options }
						onChange={ onChangeSelected }
					/>
					{ selectedDataset !== INLINE ? (
						<Button
							className="dataset-control-button is-tertiary is-destructive"
						>
							<Icon icon="trash" />
							<span className="screen-reader-text">
								{ __( 'Delete dataset', 'datavis' ) }
							</span>
						</Button>
					) : null }
					<Button
						className="dataset-control-button is-primary"
						onClick={ () => setIsAddingNewDataset( true ) }
					>
						{ __( 'New', 'datavis' ) }
					</Button>
				</PanelRow>
			) }

			<small><em>"delete" button (low priority)</em></small>

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
