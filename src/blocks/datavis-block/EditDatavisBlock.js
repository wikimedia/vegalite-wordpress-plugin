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

export default EditDatavisBlock;
