/**
 * Read, create and update a single record from the database
 */

define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('recordFactory', ['$http', '$q', '$rootScope', '$timeout', 'dataFactory', 'apiUriGenerator', function ($http, $q, $rootScope, $timeout, dataFactory, apiUriGenerator) {
        return function (apiConfig) {
            var record = dataFactory();
            var url = apiUriGenerator(apiConfig);

            function init() {
                return record.init(apiConfig);
            }

            function create(newRecord) {
                return $http.post(url, newRecord)
                    .success(function(newRecord) {
                        record.setData(newRecord);
                    }
                );
            }

            function update(recordId, updatedFields) {
                return $http.put(url, updatedFields)
                    .success(function() {
                        var newRecord = ng.merge(record.all(), updatedFields);
                        record.setData(newRecord);
                    }
                );
            }

            return {
                _record: record,
                init: init,
                observe: record.observe,
                all: record.all,
                create: create,
                update: update
            };
        };
    }]);
});
