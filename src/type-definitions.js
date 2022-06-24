/**
 * This module defines JSDoc types which are used throughout the application.
 * No actual logic should be defined in this module. VS Code and other editors
 * should be able to detect and utilize these types even if it is not imported.
 */

/**
 * API representation of a CSV dataset stored in post meta.
 *
 * @typedef {object} Dataset
 * @property {string} filename  Dataset CSV filename.
 * @property {string} url       Public URL of CSV.
 * @property {number} rows      CSV row count.
 * @property {number} fields    Array of field description objects from this data.
 * @property {string} [content] Dataset CSV contents. Only present on single-dataset endpoints.
 * @property {string} [data]    Dataset content as JSON. Only present on single-dataset endpoints.
 */

/**
 * @typedef {object} ReduxAction Redux action object. Can have other arbitrary properties.
 * @property {string} type Redux action name.
 */

/**
 * @typedef {object} DatasetReduxAction
 * @property {string}  type    Redux action name.
 * @property {Dataset} dataset Dataset object related to request action.
 */
