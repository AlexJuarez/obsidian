define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    var apiConfig = {
        endpoint: 'divisions',
        queryParams: {
            dimensions: ['id', 'name']
        }
    };

    module.service('clientDivisionsService', ['dataFactory', '$q', function (dataFactory, $q) {
        function get(clientId) {
            var deferred = $q.defer();
            if (clientId) {
                var divisions = dataFactory();
                var divisionsApiConfig = ng.copy(apiConfig);
                divisionsApiConfig.queryParams.filters = ['client.id:eq:' + clientId];
                divisions.init(divisionsApiConfig);
                divisions.observe(function() {
                    deferred.resolve(divisions.all().divisions);
                }, undefined, true);
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        return {
            get: get
        };
    }]);
});
