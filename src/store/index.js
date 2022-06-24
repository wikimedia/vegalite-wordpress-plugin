/* eslint-disable jsdoc/require-jsdoc */
import { createSelector } from 'reselect';

import { createReduxStore, register } from '@wordpress/data';

import * as api from '../util/datasets';

/* eslint-disable jsdoc/require-returns-description */
const actions = {
	/**
	 * @param {Dataset} dataset Dataset to save.
	 * @returns {ReduxAction}
	 */
	createDataset: ( dataset ) => ( {
		type: 'DATASET_CREATE',
		dataset,
	} ),

	/**
	 * @param {Dataset} dataset Dataset to update.
	 * @returns {ReduxAction}
	 */
	updateDataset: ( dataset ) => ( {
		type: 'DATASET_UPDATE',
		dataset,
	} ),

	/**
	 * @param {Dataset} dataset Dataset to delete.
	 * @returns {ReduxAction}
	 */
	deleteDataset: ( dataset ) => ( {
		type: 'DATASET_DELETE',
		dataset,
	} ),

	/**
	 * @param {string} filename Filename of dataset to retrieve.
	 * @returns {ReduxAction}
	 */
	getDataset: ( filename ) => ( {
		type: 'DATASET_GET',
		filename,
	} ),

	/**
	 * @param {string} url Full URL of dataset to retrieve.
	 * @returns {ReduxAction}
	 */
	getDatasetByUrl: ( url ) => ( {
		type: 'DATASET_GET_BY_URL',
		url,
	} ),

	/**
	 * @returns {ReduxAction}
	 */
	getDatasets: () => ( {
		type: 'DATASETS_GET_ALL',
	} ),

	/**
	 * @param {Dataset[]} datasets Array of datasets to save in store.
	 * @returns {ReduxAction}
	 */
	setDatasets: ( datasets ) => ( {
		type: 'DATASETS_SET',
		datasets,
	} ),

	/**
	 * @param {Dataset} dataset Dataset to save in store.
	 * @returns {ReduxAction}
	 */
	setDataset: ( dataset ) => ( {
		type: 'DATASET_SET',
		dataset,
	} ),

	/**
	 * @param {Dataset} dataset Dataset to remove from store.
	 * @returns {ReduxAction}
	 */
	unsetDataset: ( dataset ) => ( {
		type: 'DATASET_UNSET',
		dataset,
	} ),
};
/* eslint-enable jsdoc/require-returns-description */

const controls = {
	/* eslint-disable jsdoc/require-returns */
	DATASETS_GET_ALL: () => api.getDatasets(),
	/** @param {ReduxAction} action Dispatched action */
	DATASET_GET: ( { filename } ) => api.getDataset( filename ),
	/** @param {ReduxAction} action Dispatched action */
	DATASET_GET_BY_URL: ( { url } ) => api.getDatasetByUrl( url ),
	/** @param {ReduxAction} action Dispatched action */
	DATASET_CREATE: ( { dataset } ) => api.createDataset( dataset ),
	/** @param {ReduxAction} action Dispatched action */
	DATASET_UPDATE: ( { dataset } ) => api.updateDataset( dataset ),
	/** @param {ReduxAction} action Dispatched action */
	DATASET_DELETE: ( { dataset } ) => api.deleteDataset( dataset ),
	/* eslint-enable jsdoc/require-returns */
};

/* eslint-disable jsdoc/require-returns */
const resolvers = {
	*getDatasets() {
		/** @type {Dataset[]} */
		const datasets = yield actions.getDatasets();
		return actions.setDatasets( datasets );
	},
	/**
	 * @param {string} filename Filename of a dataset to retrieve.
	 */
	*getDataset( filename ) {
		/** @type {Dataset} */
		const dataset = yield actions.getDataset( filename );
		return actions.setDataset( dataset );
	},
	/**
	 * @param {string} url Public URL of a dataset to retrieve.
	 */
	*getDatasetByUrl( url ) {
		/** @type {Dataset} */
		const dataset = yield actions.getDatasetByUrl( url );
		return actions.setDataset( dataset );
	},
	/**
	 * @param {Dataset} dataset Dataset to create.
	 */
	*createDataset( dataset ) {
		/** @type {Dataset} */
		const savedDataset = yield actions.createDataset( dataset );
		return actions.setDataset( savedDataset );
	},
	/**
	 * @param {Dataset} dataset Dataset to update.
	 */
	*updateDataset( dataset ) {
		/** @type {Dataset} */
		const savedDataset = yield actions.updateDataset( dataset );
		return actions.setDataset( savedDataset );
	},
	/**
	 * @param {Dataset} dataset Dataset to delete.
	 */
	*deleteDataset( dataset ) {
		/** @type {bool} */
		const didDelete = yield actions.deleteDataset( dataset );
		if ( didDelete ) {
			return actions.unsetDataset( dataset );
		}
	},
};
/* eslint-enable jsdoc/require-returns */

/**
 * Redux dataset store.
 *
 * @typedef DatasetStore
 * @property {object.<string, Dataset>} datasets Dataset dictionary keyed by filename.
 */

/** @type {DatasetStore} */
const DEFAULT_STATE = {
	datasets: {},
};

/**
 * Store reducer.
 *
 * @param {DatasetStore} state  State tree
 * @param {object} action Action object.
 * @returns {object} Transformed state tree.
 */
const reducer = ( state = DEFAULT_STATE, action ) => {
	/* eslint-disable default-case */
	switch ( action.type ) {
		case 'DATASETS_SET':
			return {
				...state,
				datasets: {
					...action.datasets.reduce(
						( memo, dataset ) => ( {
							...memo,
							[ dataset.filename ]: dataset,
						} ),
						{}
					),
				},
			};
		case 'DATASET_SET':
			if ( ! action.dataset?.filename ) {
				return state;
			}
			return {
				...state,
				datasets: {
					...state.datasets,
					[ action.dataset.filename ]: {
						...( state.datasets[ action.dataset.filename ] || {} ),
						...action.dataset,
					},
				},
			};
		case 'DATASET_UPDATE':
			if ( ! action.dataset?.filename ) {
				return state;
			}
			return {
				...state,
				datasets: {
					...state.datasets,
					[ action.dataset.filename ]: {
						...( state.datasets[ action.dataset.filename ] || {} ),
						...action.dataset,
					},
				},
			};
		case 'DATASET_DELETE':
			if ( ! action.dataset?.filename ) {
				return state;
			}
			return {
				...state,
				datasets: {
					...state.datasets,
					[ action.dataset.filename ]: undefined,
				},
			};
	}

	return state;
};

const store = createReduxStore( 'csv-datasets', {
	reducer,

	actions,

	selectors: {
		/**
		 * Get array of datasets.
		 *
		 * @param {DatasetStore} state State tree.
		 * @returns {Dataset[]} Array of datasets.
		 */
		getDatasets: createSelector(
			( state ) => state.datasets,
			( datasets ) => Object.values( datasets ).filter( Boolean )
		),

		/**
		 * Retrieve a dataset by filename string.
		 *
		 * @param {DatasetStore} state    State tree.
		 * @param {string}       filename Filename of requested dataset..
		 * @returns {?Dataset} Dataset object, or null if not found.
		 */
		getDataset( state, filename ) {
			return state.datasets[ filename ] || null;
		},

		/**
		 * Retrieve a dataset by its public URL.
		 *
		 * @param {DatasetStore} state State tree.
		 * @param {string}       url   Dataset public URL.
		 * @returns {?Dataset} Dataset object, or null if not found.
		 */
		getDatasetByUrl( state, url ) {
			/** @type {Dataset[]} */
			const datasets = Object.values( state.datasets );
			return datasets.find( ( dataset ) => dataset.url === url ) || null;
		},
	},

	controls,

	resolvers,
} );

register( store );

if ( module.hot ) {
	module.hot.accept();
}
