import { decodeSpec, encodeSpec } from './spec';

/**
 * Spec using characters outside the Basic Latin range: Japanese for three-byte
 * UTF-8, emoji for four-byte UTF-16 (UTF-8 'surrogate pair').
 *
 * @type {object}
 */
const multiByteSpec = {
	$schema: 'https://vega.github.io/schema/vega-lite/v6.json',
	data: { url: 'data/movies.json' },
	width: 200,
	height: 100,
	transform: [ {
		density: 'IMDB Rating',
		bandwidth: 0.3,
	} ],
	mark: 'area',
	encoding: {
		x: {
			field: 'value',
			title: '美味しさ',
			type: 'quantitative',
		},
		y: {
			field: 'density',
			title: '🤤🤤🤤',
			type: 'quantitative',
		},
	},
};

describe( 'encodeSpec / decodeSpec', () => {
	it( 'correctly encodes and decodes an ASCII spec', () => {
		const spec = {
			mark: 'bar',
			encoding: { x: { field: 'a > b' } },
		};

		expect( decodeSpec( encodeSpec( spec ) ) ).toEqual( spec );
	} );

	it( 'correctly encodes and decodes non-ASCII and emoji characters', () => {
		const decoded = decodeSpec( encodeSpec( multiByteSpec ) );

		expect( decoded ).toEqual( multiByteSpec );
		expect( decoded.encoding.x.title ).toBe( '美味しさ' );
		expect( decoded.encoding.y.title ).toBe( '🤤🤤🤤' );
	} );

	it( 'encodes multi-byte characters within the Base64 alphabet', () => {
		// The point of encoding is to keep the attribute value safe to embed in
		// block comment HTML, so nothing outside Base64 may survive encoding.
		expect( encodeSpec( multiByteSpec ) ).toMatch( /^[A-Za-z0-9+/]+={0,2}$/ );
	} );

	it( 'correctly encodes and decodes multi-byte characters spanning the internal chunk boundary', () => {
		// encodeSpec builds its binary string in 0x8000-byte chunks. Chunks are
		// cut on byte boundaries, so a single character's bytes can land in two
		// different chunks; sweep the padding length to cover each alignment.
		for ( let padding = 0x8000 - 8; padding <= 0x8000; padding++ ) {
			const spec = {
				description: `${ 'x'.repeat( padding ) }🤤美`,
				mark: 'area',
			};

			expect( decodeSpec( encodeSpec( spec ) ) ).toEqual( spec );
		}
	} );

	it( 'returns null for an empty attribute value', () => {
		expect( decodeSpec( '' ) ).toBeNull();
		expect( decodeSpec( null ) ).toBeNull();
		expect( decodeSpec( undefined ) ).toBeNull();
	} );

	it( 'returns null when the value is not a valid encoded spec', () => {
		// eslint-disable-next-line no-console
		console.error = jest.fn();

		expect( decodeSpec( 'not base64 at all!' ) ).toBeNull();
	} );
} );
