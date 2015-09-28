/**
 * Describe the relationships between creative types, environments, dimensions
 * and expanded dimensions
 */

define(function(require) {
	'use strict';

	var module = require('./../module');

	module.constant('CREATIVE_SETTINGS', {
		types: [
			{id: 'IBV', name: 'In-Banner Video', dbName: 'In-Banner'},
			{id: 'ISV', name: 'In-Stream Video', dbName: 'In-Stream'},
			{id: 'RM', name: 'Rich Media', dbName: 'Rich Media'},
			{id: 'SWF', name: 'Display: SWF', subtype: 'SWF', dbName: 'Display'},
			{id: 'IMG', name: 'Display: Image', subtype: 'IMG', dbName: 'Display'}
		],

		typeSettings: {
			IBV: {
				environments: [1, 2, 3, 4],
				dimensions: [1, 2, 3, 4, 11, 12, 13, 14],
				expandedDimensions: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			},
			ISV: {
				environments: [1, 2],
				dimensions: [6, 7, 8, 9, 10, 14],
				expandedDimensions: undefined
			},
			RM: {
				environments: [1, 2, 3, 4],
				dimensions: [1, 2, 3, 4, 11, 12, 13, 14],
				expandedDimensions: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			},
			SWF: {
				environments: [2],
				dimensions: undefined,
				expandedDimensions: undefined
			},
			IMG: {
				environments: [1, 2, 3, 4],
				dimensions: undefined,
				expandedDimensions: undefined
			}
		},

		environments: {
			1: {id: 1, dbName: 'multidevice', name: 'Multi-Screen (Desktop, Tablet and Phone)'},
			2: {id: 2, dbName: 'desktop', name: 'Desktop'},
			3: {id: 3, dbName: 'tablet', name: 'Tablet & Phone'},
			4: {id: 4, dbName: 'mobile', name: 'Tablet & Phone (In-App/MRAID)'}
		},

		dimensions: {
			1: {id: 1, width: 160, height: 600, name: '160x600'},
			2: {id: 2, width: 180, height: 150, name: '180x150'},
			3: {id: 3, width: 300, height: 250, name: '300x250'},
			4: {id: 4, width: 300, height: 600, name: '300x600'},
			6: {id: 6, width: 480, height: 360, name: '480x360 (4:3)'},
			7: {id: 7, width: 533, height: 300, name: '533x300 (16:9)'},
			8: {id: 8, width: 640, height: 360, name: '640x360 (16:9)'},
			9: {id: 9, width: 640, height: 480, name: '640x480 (4:3)'},
			10: {id: 10, width: 768, height: 432, name: '768x432 (16:9)'},
			11: {id: 11, width: 728, height: 90, name: '728x90'},
			12: {id: 12, width: 970, height: 90, name: '970x90'},
			13: {id: 13, width: 1, height: 1, name: 'Interstitial 1x1'},
			14: {id: 14, isCustom: true, name: 'Custom'}
		},

		expandedDimensions: {
			1: {id: 1, isNonExpanding: true, name: 'Non-Expanding'},
			2: {id: 2, width: 300, height: 600, name: '300x600'},
			3: {id: 3, width: 560, height: 300, name: '560x300'},
			4: {id: 4, width: 600, height: 250, name: '600x250'},
			5: {id: 5, width: 600, height: 600, name: '600x600'},
			6: {id: 6, width: 728, height: 315, name: '728x315'},
			7: {id: 7, width: 970, height: 250, name: '970x250'},
			8: {id: 8, width: 970, height: 415, name: '970x415'},
			9: {id: 9, isCustom: true, name: 'Custom'}
		}
	});
});
