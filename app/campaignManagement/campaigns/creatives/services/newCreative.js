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
            if(params === null) {
                deferred.reject('invalid creative');
            } else {
                var url = studioDirectUrl + '?' + $httpParamSerializer(params);
                deferred.resolve(url);
            }
            return deferred.promise;
        };
    }]);
});
