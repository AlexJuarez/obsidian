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
    module.service('newCreativeService', ['$httpParamSerializer', '$q', 'studioDirectAdapter', 'getStudioPath', function($httpParamSerializer, $q, studioDirectAdapter, getStudioPath) {
       function createStudioDirectUrl(creative) {
            var studioDirectUrl = getStudioPath() + '/studio';
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
