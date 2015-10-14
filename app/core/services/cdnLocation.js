define(function(require) {
	'use strict';

	var module = require('./../module');

	/**
	 * Service return the location of studio using the familiar API of $location
	 *
	 * @memberof app
	 * @ngdoc service
	 * @name studioLocation
	 * @ngInject
	 */
	module.service('cdnLocation', ['$location', function($location) {
		/**
		 * Gets the studio host, 'host' is used to match API of $location
		 *
		 * @returns {string} path to studio
		 */
		function host() {
			var hostname = $location.host();
			if (hostname.indexOf('studio') > -1) {
				return '//' + hostname.replace(/([-]?)studio/, '$1swf');
			} else if (hostname.indexOf('mixpo.com') > -1) {
				return '//' + hostname.replace(/(w*)\.mixpo\.com/, '-swf.mixpo.com');
			} else {
				return '//alpha-swf.mixpo.com';
			}
		}

		return {
			host: host
		};
	}]);
});
