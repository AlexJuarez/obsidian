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
    module.service('studioLocation', ['$location', function($location) {
        /**
         * Gets the studio path, 'path' is used to match API of $location
         *
         * @param source hostname, otherwise $location.path() will be used
         * @returns {string} path to studio
         */
        function path(hostname) {
            if(!!!hostname) {
                hostname = $location.path();
            }

            if (hostname.indexOf('studio') > -1) {
                return '//' + hostname;
            } else if (hostname.indexOf('mixpo.com') > -1) {
                return '//' + hostname.replace(/(w*)\.mixpo\.com/, '$1-studio.mixpo.com');
            } else {
                return '//studio.mixpo.com';
            }
        }

        return {
            path: path
        };
    }]);
});
