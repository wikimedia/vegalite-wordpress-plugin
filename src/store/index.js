/* eslint-disable jsdoc/require-jsdoc */
import { createSelector } from 'reselect';

import { createReduxStore, register } from '@wordpress/data';

import { getDatasets } from '../util/datasets';

const DEFAULT_STATE = {
	datasets: {},
	postType: '',
	postId: 0,
};

/*
select( 'datasets' ).getDatasets();

select( 'datasets' ).getDatasetByUrl( '...' );
select( 'datasets' ).getDatasetByFilename(  );
*/

const actions = {
	setPost: ( id, type ) => ( {
		type: 'POST_SET',
		post: {
			id,
			type,
		},
	} ),

	createDataset: ( dataset ) => ( {
		type: 'DATASET_CREATE',
		dataset,
	} ),

	updateDataset: ( dataset ) => ( {
		type: 'DATASET_UPDATE',
		dataset,
	} ),

	deleteDataset: ( dataset ) => ( {
		type: 'DATASET_DELETE',
		dataset,
	} ),

	getDataset: ( filename ) => ( {
		type: 'DATASET_GET',
		filename,
	} ),

	getDatasetByUrl: ( url ) => ( {
		type: 'DATASET_GET_BY_URL',
		url,
	} ),

	setDatasets: ( datasets ) => ( {
		type: 'DATASETS_SET',
		datasets,
	} ),

	fetchDatasets: () => ( {
		type: 'DATASET_FETCH_ALL',
	} ),
};

const controls = {
	DATASET_FETCH_ALL: () => getDatasets(),
};

const resolvers = {
	*getDatasets() {
		const datasets = yield actions.fetchDatasets();
		return actions.setDatasets( datasets );
	},
}

/* eslint-disable default-case */
const store = createReduxStore( 'csv-datasets', {
	/**
	 * Store reducer.
	 *
	 * @param {object} state  State tree
	 * @param {object} action Action object.
	 * @returns {object} Transformed state tree.
	 */
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'POST_SET':
				return {
					...state,
					postType: action.post.type,
					postId: action.post.id,
				};
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
		}

		return state;
	},

	actions,

	selectors: {
		/**
		 * Get array of datasets.
		 *
		 * @param {object} state State tree.
		 * @returns {object[]} Array of datasets.
		 */
		getDatasets: createSelector(
			( state ) => state.datasets,
			( datasets ) => Object.values( datasets )
		),

		/**
		 * Retrieve a dataset by filename string.
		 *
		 * @param {object} state State tree.
		 * @param {string} url   Dataset public URL.
		 * @returns {object} Dataset object.
		 */
		getDatasetByFilename( state, url ) {
			return {};
		},
		getDatasetByUrl( state, url ) {},
		getPrice( state, item ) {
			const { prices, discountPercent } = state;
			const price = prices[ item ];

			return price * ( 1 - 0.01 * discountPercent );
		},
	},

	controls,

	resolvers,
} );

register( store );

if ( module.hot ) {
	module.hot.accept();
}
