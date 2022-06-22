/**
 * Edit function for Datavis block.
 */
import React from 'react';

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	TabPanel,
	TextControl,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import ControlledJsonEditor from '../../components/ControlledJsonEditor';
import DatasetEditor from '../../components/DatasetEditor';
import VegaChart from '../../components/VegaChart';
import { setupDatavisBlocks } from '../../index';

import defaultSpecification from './specification.json';

const markOptions = [
	{
		label: __( 'Area', 'datavis' ),
		value: 'area',
	},
	{
		label: __( 'Bar', 'datavis' ),
		value: 'bar',
	},
	{
		label: __( 'Circle', 'datavis' ),
		value: 'circle',
	},
	{
		label: __( 'Line', 'datavis' ),
		value: 'line',
	},
	{
		label: __( 'Point', 'datavis' ),
		value: 'point',
	},
	{
		label: __( 'Rect', 'datavis' ),
		value: 'rect',
	},
	{
		label: __( 'Rule', 'datavis' ),
		value: 'rule',
	},
	{
		label: __( 'Square', 'datavis' ),
		value: 'square',
	},
	{
		label: __( 'Text', 'datavis' ),
		value: 'text',
	},
	{
		label: __( 'Tick', 'datavis' ),
		value: 'tick',
	},
];

/**
 * Sidebar panels
 *
 * @param {object} props                 React component props.
 * @param {object} props.json            Vega Lite specification.
 * @param {Function} props.setAttributes Block editor setAttributes function.
 * @returns {React.ReactNode} Rendered sidebar panel.
 */
const SidebarEditor = ( { json, setAttributes } ) => (
	<InspectorControls>
		<PanelBody
			initialOpen
			title={ __( 'General' ) }
		>
			<TextControl
				label={ __( 'Name', 'datavis' ) }
				value={ json['name'] }
				onChange={ ( name ) => {
					setAttributes( {
						json: {
							...json,
							name,
						},
					} );
				} }
				help={ __( 'Name of the visualization for later reference.', 'datavis' ) }
			/>
			<TextControl
				label={ __( 'Title', 'datavis' ) }
				value={ json['title'] }
				onChange={ ( title ) => {
					setAttributes( {
						json: {
							...json,
							title,
						},
					} );
				} }
				help={ __( 'Title for the plot.', 'datavis' ) }
			/>
			<TextControl
				label={ __( 'Description', 'datavis' ) }
				value={ json['description'] }
				onChange={ ( description ) => {
					setAttributes( {
						json: {
							...json,
							description,
						},
					} );
				} }
				help={ __( 'Description of this mark for commenting purpose.', 'datavis' ) }
			/>
		</PanelBody>
		<PanelBody title={ __( 'Mark' ) }>
			<SelectControl
				label={ __( 'Mark', 'datavis' ) }
				value={ json['mark'] }
				options={ markOptions }
				onChange={ ( mark ) => {
					setAttributes( {
						json: {
							...json,
							mark,
						},
					} );
				} }
			/>
		</PanelBody>
	</InspectorControls>
);

// Tabs to use in the editor view.
const tabs = [
	{
		name: 'spec',
		title: __( 'Chart Specification' ),
		className: 'edit-post-sidebar__panel-tab',
	},
	{
		name: 'data',
		title: __( 'Data' ),
		className: 'edit-post-sidebar__panel-tab',
	},
];

/**
 * Editor UI component for the datavis block.
 *
 * @param {object}   props               React component props.
 * @param {object}   props.attributes    The attributes for the selected block.
 * @param {Function} props.setAttributes The attributes setter for the selected block.
 * @param {boolean}  props.isSelected    Whether the block is selected in the editor.
 * @returns {React.ReactNode} Rendered editorial UI.
 * @class
 */
const EditDatavisBlock = ( { attributes, setAttributes, isSelected } ) => {
	const blockProps = useBlockProps();
	const json = attributes.json || defaultSpecification;

	const blockId = blockProps.id;
	setAttributes( { blockId } );

	PreviewDatavis( blockId );

	return (
		<div { ...blockProps }>
			<VegaChart spec={ json } />
			{ isSelected ? (
				<>
					<TabPanel
						className="my-tab-panel"
						activeClass="active-tab"
						tabs={ tabs }
					>
						{ ( activeTab ) => {
							if ( activeTab.name === 'spec' ) {
								return (
									<ControlledJsonEditor
										value={ json }
										onChange={ ( json ) => setAttributes( { json } ) }
									/>
								);
							}
							if ( activeTab.name === 'data' ) {
								return (
									<DatasetEditor
										json={ json }
										setAttributes={ setAttributes }
									/>
								);
							}
							return null;
						} }
					</TabPanel>
					<SidebarEditor json={ json } setAttributes={ setAttributes } />
				</>
			) : null }
		</div>
	);
};

/**
 * Hacky way to get the Datavis model to render after updates have been made to the block.
 *
 * This is needed due to the lack of an action when the Server Side render is completed. So we create a interval
 * to check if the block element has been updated, if not it run the Datavis setup.
 *
 * @param {string} blockId Block id.
 * @class
 */
const PreviewDatavis = ( blockId ) => {
	let dataVisLoaded = false,
		killCounter = 0;
	let dataVisLoadedInterval = setInterval( function() {
		const element = document.getElementById( blockId+'-datavis' );
		if ( ! element ) {
			return;
		}
		// To prevent multiple reloads, only run preview if the block element has loaded and the Datavis has not been loaded.
		let loadedElement = element.dataset.loaded ?? false,
			loaded = ( loadedElement === 'true' );

		if ( element && ! loaded ) {
			// Element is present but the dataviz configuration has not yet rendered from the server.
			dataVisLoaded = true;
			element.setAttribute( 'data-loaded', true );
		}
		// Element exists and the dataviz configuration has rendered from the server so kick off the processing of the dataviz configuration.
		if ( dataVisLoaded && loaded ) {
			setupDatavisBlocks();
			clearInterval( dataVisLoadedInterval );
		}
		// If after a period of time kill the interval to not fall into an infinite loop.
		if ( killCounter > 10 ) {
			clearInterval( dataVisLoadedInterval );
		}
		killCounter += 1;
	}, 1000 );
};

export default EditDatavisBlock;
