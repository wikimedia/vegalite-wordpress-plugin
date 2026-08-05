/**
 * Jest's jsdom environment does not expose TextEncoder or TextDecoder, which
 * every browser provides. Use Node's spec-compliant implementations.
 */
const { TextDecoder, TextEncoder } = require( 'util' );

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
