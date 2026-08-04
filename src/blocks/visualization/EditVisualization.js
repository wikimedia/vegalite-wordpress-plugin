/**
 * Edit function for Vega-Lite block.
 */
import React, { useCallback, useEffect, useMemo } from 'react';

import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	TabPanel,
	TextControl,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import SelectChartType from '../../chart-transforms/chart-type';
import { ResizableChartPreview } from '../../chart-transforms/dimensions';
import { ConditionalEncodingFields } from '../../chart-transforms/encoding';
import ControlledJsonEditor from '../../components/ControlledJsonEditor';
import DatasetEditor from '../../components/DatasetEditor';
import { decodeSpec, encodeSpec } from '../../util/spec';
import sufficientlyUniqueId from '../../util/sufficiently-unique-id';

import defaultSpecification from './specification.json';
import './edit-visualization.scss';

/**
 * Sidebar panels
 *
 * @param {object} props                 React component props.
 * @param {object} props.json            Vega Lite specification.
 * @param {Function} props.setAttributes Block editor setAttributes function.
 * @returns {React.ReactNode} Rendered sidebar panel.
 */
const SidebarEditor = ( { json, setAttributes } ) => {
	// TODO: Load a dataset into the store by URL if the URL in the json isn't in our store already.

	return (
		<InspectorControls>
			<PanelBody
				initialOpen
				title={ __( 'General', 'datavis' ) }
			>
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
				<SelectChartType json={ json } setAttributes={ setAttributes } />
			</PanelBody>
			<PanelBody title={ __( 'Layout', 'datavis' ) }>
				<ConditionalEncodingFields json={ json } setAttributes={ setAttributes } />
			</PanelBody>
		</InspectorControls>
	);
};

// Tabs to use in the editor view.
const tabs = [
	{
		name: 'spec',
		title: __( 'Chart Specification', 'datavis' ),
		className: 'edit-post-sidebar__panel-tab',
	},
	{
		name: 'data',
		title: __( 'Data', 'datavis' ),
		className: 'edit-post-sidebar__panel-tab',
	},
];

/**
 * Editor UI component for the Vega-Lite block.
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

	// attributes.json is only reachable if a block hasn't been migrated to the
	// encoded >= v0.7 format. Prefer it if present so that old specs still load
	// and allow editing.
	const json = useMemo(
		() => decodeSpec( attributes.chartSpec ) || attributes.json || defaultSpecification,
		[ attributes.chartSpec, attributes.json ]
	);

	// Every editor component below reads a spec object and writes it back as
	// setAttributes( { json } ). Encode that object here so consumers do not
	// need to worry about spec storage format.
	const setSpecAttributes = useCallback( ( nextAttributes ) => {
		if ( ! ( 'json' in nextAttributes ) ) {
			setAttributes( nextAttributes );
			return;
		}

		const { json: nextSpec, ...rest } = nextAttributes;
		setAttributes( {
			...rest,
			chartSpec: encodeSpec( nextSpec ),
			// Discard any legacy attribute this block was still carrying.
			json: undefined,
		} );
	}, [ setAttributes ] );

	// Ensure every visualization gets a unique chart ID.
	useEffect( () => {
		if ( attributes.chartId ) {
			return;
		}
		setAttributes( {
			chartId: sufficientlyUniqueId(),
		} );
	}, [ attributes.chartId, setAttributes ] );

	return (
		<div { ...blockProps }>
			<ResizableChartPreview
				id={ attributes.id }
				json={ json }
				setAttributes={ setSpecAttributes }
				showHandles={ isSelected }
			/>

			{ isSelected ? (
				<>
					<TabPanel
						className="visualization-block-tabs"
						activeClass="active-tab"
						tabs={ tabs }
					>
						{ ( activeTab ) => {
							if ( activeTab.name === 'spec' ) {
								return (
									<ControlledJsonEditor
										value={ json }
										onChange={ ( json ) => setSpecAttributes( { json } ) }
									/>
								);
							}
							if ( activeTab.name === 'data' ) {
								return (
									<DatasetEditor
										json={ json }
										setAttributes={ setSpecAttributes }
									/>
								);
							}
							return null;
						} }
					</TabPanel>
					<SidebarEditor json={ json } setAttributes={ setSpecAttributes } />
				</>
			) : null }
		</div>
	);
};

export default EditDatavisBlock;
