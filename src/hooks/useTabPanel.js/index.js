/**
 * Edit function for Datavis block.
 */
import React, { useCallback, useState } from 'react';

import {
	TabPanel as CoreTabPanel,
} from '@wordpress/components';

/**
 * Hook to simplify use of WP's TabsPanel component.
 *
 * @param {object[]} tabs Array of { name, title, class } tab definitions.
 * @returns {object} { activeTab, TabPanel }.
 */
const useTabs = ( tabs ) => {
	const [ activeTab, setActiveTab ] = useState( tabs[ 0 ].name );

	const TabPanel = useCallback( () => (
		<CoreTabPanel
			className="my-tab-panel"
			activeClass="active-tab"
			onSelect={ setActiveTab }
			tabs={ tabs }
		>
			{ ( tab ) => <p key={ tab.name }>{ tab.title }</p> }
		</CoreTabPanel>
	), [ tabs ] );

	return {
		activeTab,
		TabPanel: TabPanel,
	};
};

export default useTabs;
