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
			{id: 'SWF', name: 'Display: SWF', dbName: 'Display'},
			{id: 'IMG', name: 'Display: Image', dbName: 'Display'}
		],

		typeSettings: {
			IBV: {
				environments: [0, 1, 2, 3],
				dimensions: [0, 1, 2, 3, 10, 11, 12, 13],
				expandedDimensions: [0, 1, 2, 3, 4, 5, 6, 7, 8]
			},
			ISV: {
				environments: [0, 1],
				dimensions: [5, 6, 7, 8, 9, 13],
				expandedDimensions: undefined
			},
			RM: {
				environments: [0, 1, 2, 3],
				dimensions: [0, 1, 2, 3, 10, 11, 12, 13],
				expandedDimensions: [0, 1, 2, 3, 4, 5, 6, 7, 8]
			},
			SWF: {
				environments: [1],
				dimensions: undefined,
				expandedDimensions: undefined
			},
			IMG: {
				environments: [0, 1, 2, 3],
				dimensions: undefined,
				expandedDimensions: undefined
			}
		},

		environments: [
			{id: 'multidevice', name: 'Multi-Screen (Desktop, Tablet and Phone)'},
			{id: 'desktop', name: 'Desktop'},
			{id: 'tablet', name: 'Tablet & Phone'},
			{id: 'mobile', name: 'Tablet & Phone (In-App/MRAID)'}
		],

		dimensions: [
			{width: 160, height: 600, name: '160x600'},
			{width: 180, height: 150, name: '180x150'},
			{width: 300, height: 250, name: '300x250'},
			{width: 300, height: 600, name: '300x600'},
			{width: 728, height: 90, name: '728x90'},
			{width: 480, height: 360, name: '480x360 (4:3)'},
			{width: 533, height: 300, name: '533x300 (16:9)'},
			{width: 640, height: 360, name: '640x360 (16:9)'},
			{width: 640, height: 480, name: '640x480 (4:3)'},
			{width: 768, height: 432, name: '768x432 (16:9)'},
			{width: 728, height: 90, name: '728x90'},
			{width: 970, height: 90, name: '970x90'},
			{width: 1, height: 1, name: 'Interstitial 1x1'},
			{isCustom: true, name: 'Custom'}
		],

		expandedDimensions: [
			{isNonExpanding: true, name: 'Non-Expanding'},
			{width: 300, height: 600, name: '300x600'},
			{width: 560, height: 300, name: '560x300'},
			{width: 600, height: 250, name: '600x250'},
			{width: 600, height: 600, name: '600x600'},
			{width: 728, height: 315, name: '728x315'},
			{width: 970, height: 250, name: '970x250'},
			{width: 970, height: 415, name: '970x415'},
			{isCustom: true, name: 'Custom'}
		]
	});
});