define(function(require) {
    'use strict';

    var module = require('./../../../module');

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
    module.service('newCreativeService', ['$httpParamSerializer', '$q', 'studioDirectAdapter', '$location', function($httpParamSerializer, $q, studioDirectAdapter, $location) {
        // For testing purposes
        function getStudioUrl(domain) {
            if (domain.indexOf('studio') > -1) {
                return '//' + domain;
            } else if (domain.indexOf('mixpo.com') > -1) {
                return '//' + domain.replace(/(w*)\.mixpo\.com/, '$1-studio.mixpo.com');
            } else {
                return '//studio.mixpo.com';
            }
        }

        function createStudioDirectUrl(creative) {
            var studioDirectUrl = getStudioUrl($location.absUrl()) + '/studio';
            var params = studioDirectAdapter(creative);
            return studioDirectUrl + '?' + $httpParamSerializer(params);
        }

        return function(creative) {
            var deferred = $q.defer();
            var url = createStudioDirectUrl(creative);
            deferred.resolve(url);
            return deferred.promise;
        };
    }]);
});
