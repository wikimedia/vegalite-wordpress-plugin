/* eslint-disable no-console */
import React, { useCallback, useEffect, useState, useMemo } from 'react';

// eslint-disable-next-line
import { Icon, TextControl, Button, PanelRow, SelectControl, TextareaControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { createDataset, deleteDataset, getDataset, getDatasets, updateDataset } from '../../util/datasets';

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
	const [ dataset, setDataset ] = useState( { filename } );
	// const [ csvContent, setCsvContent ] = useState( '' );

	useEffect( () => {
		if ( filename !== INLINE && ! dataset?.content ) {
			console.log( 'REQUESTING' );
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
				label={ __( 'Edit CSV dataset', 'datavis' ) }
				value={ dataset?.content || '' }
				onChange={ onChange }
			/>
			<Button className="is-primary" onClick={ onSaveButton }>{ __( 'Save', 'datavis' ) }</Button>
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
 * @param {object} props              React component props.
 * @param {object} props.onAddDataset Callback after new dataset gets saved.
 * @returns {React.ReactNode} Rendered form.
 */
const NewDatasetForm = ( { onAddDataset } ) => {
	const [ filename, setFilename ] = useState( '' );
	const { postId } = useSelect( ( select ) => ( {
		postId: select( 'core/editor' ).getEditedPostAttribute( 'id' ),
	} ) );
	const [ hasFormError, setHasFormError ] = useState( false );

	const onChangeContent = useCallback( ( content ) => {
		setFilename( content );
		setHasFormError( false );
	}, [ setFilename, setHasFormError ] );

	const onSubmit = useCallback( () => {
		if ( ! filename.trim() || ! postId ) {
			setHasFormError( true );
			return;
		}
		const dataset = {
			filename: `${ toLowerKebabCase( filename.replace( /\.csv$/i, '' ) ) }.csv`,
			content: '',
		};
		createDataset( dataset, { id: postId } ).then( onAddDataset );
	}, [ filename, postId, onAddDataset ] );

	const submitOnEnter = useCallback( ( evt ) => {
		if ( evt.code === 'Enter' ) {
			onSubmit();
		}
	}, [ onSubmit ] );

	return (
		<>
			<PanelRow className="datasets-control-row">
				<TextControl
					label={ __( 'CSV dataset name', 'datavis' ) }
					value={ filename }
					onChange={ onChangeContent }
					onKeyDown={ submitOnEnter }
				/>
				<Button
					className="dataset-control-button is-primary"
					onClick={ onSubmit }
				>{ __( 'Save dataset', 'dataset' ) }</Button>
			</PanelRow>
			{ hasFormError ? (
				<p class="dataset-form-error"><em>Name is required when creating a dataset.</em></p>
			) : null }
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
	const [ isAddingNewDataset, setIsAddingNewDataset ] = useState( false );

	const { postId } = useSelect( ( select ) => ( {
		postId: select( 'core/editor' ).getEditedPostAttribute( 'id' ),
	} ) );

	const updateDatasets = useCallback( () => {
		getDatasets( { id: postId } ).then( ( datasetList ) => {
			setDatasets( datasetList );
			if ( json?.data?.url ) {
				const activeDataset = datasetList.find( ( { url } ) => url === json.data.url );
				if ( activeDataset ) {
					setSelectedDataset( activeDataset.filename );
				}
			}
		} );
	}, [ postId, json?.data?.url ] );

	useEffect( () => {
		if ( datasets === defaultDatasets ) {
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

	// TODO: When content is empty, switching from another dataset does not refresh the text area.

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
		setAttributes( {
			json: { ...json },
		} );
	}, [ json, setAttributes ] );

	const onAddNewDataset = useCallback( ( result ) => {
		setIsAddingNewDataset( false );
		if ( result && result.filename ) {
			updateDatasets();
			setSelectedDataset( result.filename );
		}
	}, [ setIsAddingNewDataset, updateDatasets, setSelectedDataset ] );

	const onDeleteDataset = useCallback( () => {
		if ( selectedDataset !== INLINE ) {
			deleteDataset( {
				filename: selectedDataset,
			}, { id: postId } ).then( updateDatasets );
		}
		setSelectedDataset( INLINE );
	}, [ selectedDataset, updateDatasets, setSelectedDataset, postId ] );

	return (
		<div>
			{ isAddingNewDataset ? (
				<NewDatasetForm onAddDataset={ onAddNewDataset } />
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
							onClick={ onDeleteDataset }
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
						{ __( 'New dataset', 'datavis' ) }
					</Button>
				</PanelRow>
			) }

			{ isAddingNewDataset ? null : (
				selectedDataset !== INLINE ? (
					<CSVEditor
						postId={ postId }
						filename={ selectedDataset }
						onSave={ forceChartUpdate }
					/>
				) : (
					<p>{ __( 'Edit data values as JSON in the Chart Specification tab.', 'datavis' ) }</p>
				)
			) }
		</div>
	);
};

export default DatasetEditor;
