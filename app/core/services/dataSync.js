define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.service('dataSyncService', ['$q', function ($q) {
        var data = {};

        function register(dataFactory, endpoint, prepFn) {
            if (!ng.isFunction(prepFn)) {
                prepFn = function (d) { var deferred = $q.defer(); deferred.resolve(d); return deferred.promise; };
            }

            if (!data[endpoint]) {
                data[endpoint] = [];
            }

            data[endpoint].push({ factory: dataFactory, transform: prepFn });
        }

        function update(endpoint, d) {
            var factories = data[endpoint];

            ng.forEach(factories, function(item) {
                item.transform(d).then(function(d){
                    item.factory.addRecord(d);
                });
            });
        }

        return {
            update: update,
            register: register
        };
    }]);
});
