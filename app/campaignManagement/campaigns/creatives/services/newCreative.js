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
    module.service('newCreativeService', ['$httpParamSerializer', '$q', 'studioDirectAdapter', 'studioLocation', function($httpParamSerializer, $q, studioDirectAdapter, studioLocation) {
        return function(creative) {
            var deferred = $q.defer();
            
            var studioDirectUrl = studioLocation.host() + '/studio';
            var params = studioDirectAdapter(creative);
            // TODO(Hays) create actual creativeToStudioValidator
            if(params === null) {
                deferred.reject('invalid creative');
            } else {
                // TODO(Hays) Convert this logic to use new studio/urlBuilder
                var url = studioDirectUrl + '?' + $httpParamSerializer(params);
                deferred.resolve(url);
            }
            // TODO(Hays) pre-test url with Servlet for server error checking

            return deferred.promise;
        };
    }]);
});
