/**
 * Entrypoint for the editor-side bundle. The block-editor-hmr npm package is
 * used to automatically detect and load any block files inside the blocks/
 * directory with hot-reloading enabled.
 */
import { autoloadBlocks } from '@humanmade/webpack-helpers/hmr';
import { JsonEditor } from 'jsoneditor-react';
import React, { useEffect, useRef } from 'react';

import 'jsoneditor-react/es/editor.min.css';

/**
 * Callback function to handle DevServer hot updates.
 *
 * @param {object}   context     Webpack ContextModule.
 * @param {Function} loadModules Callback to run on modules in context.
 */
const reloadOnHMRUpdate = ( context, loadModules ) => {
	if ( module.hot ) {
		module.hot.accept( context.id, loadModules );
	}
};

autoloadBlocks(
	{
		/**
		 * Load in all files matching ./blocks/{folder name}/index.js
		 *
		 * @returns {object} Webpack ContextModule for matched files.
		 */
		getContext() {
			return require.context( './blocks', true, /index\.js$/ );
		},
	},
	reloadOnHMRUpdate
);

/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param */
/**
 * Create a JSONEditor where the reference is tracked in order to update the editor component value outside of the editor.
 *
 * @param {object} value Value to use in the JSON Editor.
 * @param {Function} onChange Callback.
 * @returns {Element} JSONEditor component where the reference is tracked.
 * @class
 */
export const ControlledJsonEditor = ( { value, onChange } ) => {
	const jsonEditorRef = useRef();
	useEffect(
		() => {
			const editor = jsonEditorRef && jsonEditorRef.current && jsonEditorRef.current.jsonEditor;
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
/* eslint-enable jsdoc/check-param-names */
/* eslint-enable jsdoc/require-param */
