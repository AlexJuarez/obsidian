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
    module.service('newCreativeService', ['$httpParamSerializer', '$q', 'studioDirectAdapter', function($httpParamSerializer, $q, studioDirectAdapter) {
        function getStudioDirectUrl(protocol, subdomain, params) {
            return protocol + '//' + subdomain + '-studio.mixpo.com/studio?' + $httpParamSerializer(params);
        }

        return function(creative) {
            var deferred = $q.defer();

            var protocol = 'https:'; // Todo: get protocol for studio
            var subdomain = 'staging'; // Todo: get environment subdomain
            var params = studioDirectAdapter(creative);
            var url = getStudioDirectUrl(protocol, subdomain, params);

            deferred.resolve(url);
            return deferred.promise;
        };
    }]);
});
