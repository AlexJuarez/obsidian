define(function(require) {
	'use strict';

	var module = require('./../../../module');

	var ng = require('angular');

	/**
	 * The newCreativeService returns a promise that creates a new Ad
	 * from the settings handed to the service and returns the URL
	 * to be opened in a new.
	 *
	 * @memberof app
	 * @ngdoc service
	 * @name newCreativeService
	 * @ngInject
	 */
	module.service('newEditModalTranslation', ['CREATIVE_SETTINGS', function(creativeSettings) {
		function transformModalToDatabase(creative) {
			var allDimensions = getDatabaseDimensions(creative);

			if (!creative.clickthroughUrl.match(/http|https/)) {
				creative.clickthroughUrl = creative.clickthroughUrl.replace(/^(.*)(:)?(\/\/)/, 'http://');
			}
			return {
				expandedWidth: allDimensions.expanded && parseInt(allDimensions.expanded.width, 10),
				expandedHeight: allDimensions.expanded && parseInt(allDimensions.expanded.height, 10),
				embedWidth: parseInt(allDimensions.embed.width, 10),
				embedHeight: parseInt(allDimensions.embed.height, 10),
				clickthroughUrl: creative.clickthroughUrl,
				type: creative.type,
				environment: creativeSettings.environments[creative.environment].id,
				name: creative.name
			};
		}

		function transformDatabaseToModal(dbCreative) {
			var modalCreative = ng.copy(dbCreative);

			// type
			creativeSettings.types.forEach(function(type) {
				if (type.dbName === dbCreative.type) {
					modalCreative.type = type.id;
				}
			});

			// environment
			creativeSettings.environments.forEach(function(environment, index) {
				if (environment.id === dbCreative.device) {
					modalCreative.environment = index;
				}
			});

			var getModalDimensions = function(collection, width, height) {
				var customIndex, isNonExpanding, nonExpandingIndex, foundIndex;
				if (width === null || height === null) {
					isNonExpanding = true;
				}
				collection.forEach(function(item, index) {
					if (item.width === width && item.height === height) {
						foundIndex = index;
					} else if (item.isCustom) {
						customIndex = index;
					} else if (item.isNonExpanding) {
						nonExpandingIndex = index;
					}
				});

				if (isNonExpanding) {
					return nonExpandingIndex;
				} else {
					return foundIndex || customIndex;
				}
			};

			// dimensions
			modalCreative.dimensions = getModalDimensions(
				creativeSettings.dimensions, dbCreative.embedWidth, dbCreative.embedHeight
			);

			modalCreative.customDimensionsWidth = dbCreative.embedWidth;
			modalCreative.customDimensionsHeight = dbCreative.embedHeight;

			// expanded dimensions
			modalCreative.expandedDimensions = getModalDimensions(
				creativeSettings.expandedDimensions, dbCreative.expandedWidth, dbCreative.expandedHeight
			);

			modalCreative.customExpandedDimensionsWidth = dbCreative.expandedWidth;
			modalCreative.customExpandedDimensionsHeight = dbCreative.expandedHeight;

			return modalCreative;
		}

		function getDatabaseDimensions(creative) {
			var allDimensions = {
				embed: {},
				expanded: {}
			};

			var creativeDimensions = creativeSettings.dimensions[creative.dimensions];
			allDimensions.embed.width = creativeDimensions.width;
			allDimensions.embed.height = creativeDimensions.height;

			allDimensions.embed = {
				width: allDimensions.embed.width || creative.customDimensionsWidth,
				height: allDimensions.embed.height || creative.customDimensionsHeight
			};

			if (creative.expandedDimensions) {
				creativeDimensions = creativeSettings.expandedDimensions[creative.expandedDimensions];
				allDimensions.expanded.width = creativeDimensions.width;
				allDimensions.expanded.height = creativeDimensions.height;

				allDimensions.expanded = {
					width: allDimensions.expanded.width || creative.customExpandedDimensionsWidth,
					height: allDimensions.expanded.height || creative.customExpandedDimensionsHeight
				};
			}

			return allDimensions;
		}

		return {
			db2Modal: transformDatabaseToModal,
			modal2Db: transformModalToDatabase
		};
	}]);
});
