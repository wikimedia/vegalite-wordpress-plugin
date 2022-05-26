/**
 * Placeholder block for a Fact Check claim
 */
import React from 'react';

import { useBlockProps } from '@wordpress/block-editor';

/**
 * Editor UI component for the datavis block.
 *
 * @returns {React.ReactNode} Rendered editorial UI.
 */
const EditDatavisBlock = () => {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<h2>Datavis Block</h2>
		</div>
	);
};

export default EditDatavisBlock;
