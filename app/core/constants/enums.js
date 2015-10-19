/**
 * Interface between database enum names and frontend enum names
 */

define(function (require) {
	'use strict';

	var module = require('./../module');

	var up = {
		creativeTypes: {
			inBannerVideo: 'In-Banner',
			richMedia: 'Rich Media',
			inStream: 'In-Stream',
			display: 'Display'
		},
		creativeEnvironments: {
			all: 'multidevice',
			desktop: 'desktop',
			mobile: 'tablet',
			mraid: 'mobile'
		},
		expandTypes: {
			directional: 'directional',
			pushdown: 'pushdown',
			takeover: 'takeover'
		},
		playModes: {
			rollover: 'rollover',
			click: 'click',
			auto: 'auto'
		}
	};

	// Invert up, place in down
	var down = {};
	var currDownKey, currUpValue;
	for (var outerKey in up) {
		currDownKey = down[outerKey] = {};
		for (var innerKey in up[outerKey]) {
			currUpValue = up[outerKey][innerKey];
			currDownKey[currUpValue] = innerKey;
		}
	}

	var ENUMS = {
		up: up,
		down: down
	};
	module.constant('ENUMS', ENUMS);
	return ENUMS;
});
