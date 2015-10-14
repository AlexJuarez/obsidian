define(function (require) {
	'use strict';

	var module = require('./../../module');

	module.service('adTags', ['placements', 'placementRecordService', 'adTagService', '$interpolate', '$q', 'cdnLocation', function (placements, placementRecordService, adTagService, $interpolate, $q, cdnLocation) {
		var tagTemplates = [];
		adTagService.init();
		adTagService.observe(function() {
			tagTemplates = adTagService.all();
		});

		function pullTags() {
			var placementIds = placements.getSelectedPlacementIds();
			if (placementIds.length === 0) {
				window.alert('No ad tags to pull!');
				return;
			}
			var tags = '';
			var placementPromises = [];

			placementIds.forEach(function(placementId) {
				placementPromises.push(placementRecordService.fetch(placementId));
			});

			$q.all(placementPromises).then(function(placements) {
				placements.forEach(function(resp) {
					var placement = resp.data;
					tags += getPlacementTagText(placement);
				});

				if (placements.length > 0) {
					var firstPlacementName = placements[0].data.name;
					download(firstPlacementName + '_tags.txt', tags);
				}
			});
		}

		function pullTag(placement) {
			var tagTemplate = getPlacementTagTemplate(placement);
			if (tagTemplate) {
				// Interpolate in "all-or-nothing" mode to avoid missing variables
				var adTag = $interpolate(tagTemplate.template || tagTemplates[0].template, false, null, true);
				return adTag(getPlacementInterpolateObject(placement, tagTemplate));
			} else {
				return '';
			}
		}

		function getPlacementTagTemplate(placement) {
			var placementTagTemplate = false;
			tagTemplates.forEach(function(tagTemplate) {
				if (tagTemplate.id === placement.adTagId) {
					placementTagTemplate = tagTemplate;
				}
			});

			return placementTagTemplate;
		}

		function getPlacementInterpolateObject(placement, adTagType) {
			var object = {
				width: placement.embedWidth,
				height: placement.embedHeight,
				id: placement.targetId, // The creative guid / entry point for multi-creative

				// TODO: ad real url here
				prerenderUrl: 'http://www.google.com', // Image to show before load
				clickthroughUrl: placement.clickthroughUrl,

				// TODO: add real data here
				version: '1.1.1', // The current build version
				folder: placement.targetId.slice(0, 2), // The first 2 letters of the id
				domain: cdnLocation.host().replace('//', '')
			};

			if (adTagType.attributes && adTagType.attributes.clicktag) {
				object.clicktag = adTagType.attributes.clicktag;
			}

			return object;
		}

		function getPlacementTagText(placement) {
			var tagTemplate = getPlacementTagTemplate(placement);
			if (tagTemplate) {
				// Interpolate in "all-or-nothing" mode to avoid missing variables
				var adTag = $interpolate(tagTemplate.template || tagTemplates[0].template, false, null, true);
				var tag = '';

				tag += 'Title: ' + placement.name + '\n';
				tag += 'Identifier: ' + placement.id + '\n';
				tag += 'Primary URL: ' + placement.clickthroughUrl + '\n';
				tag += 'Play Mode: ' + placement.playMode + '\n';
				tag += 'Ad Tag: \n';
				tag += adTag(getPlacementInterpolateObject(placement, tagTemplate));
				tag += '\n\n---\n\n';

				return tag;
			} else {
				return '';
			}
		}

		function download(filename, text) {
			var pom = document.createElement('a');
			pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			pom.setAttribute('download', filename);

			if(document.createEvent) {
				var event = document.createEvent('MouseEvents');
				event.initEvent('click', true, true);
				pom.dispatchEvent(event);
			}
			else {
				pom.click();
			}
		}

		return {
			pullTags: pullTags,
			pullTag: pullTag
		};
	}]);
});
