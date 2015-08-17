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
                return $http.put(idUrl(recordId), updatedFields)
                    .success(function() {
                        var newRecord = ng.merge(record.all(), updatedFields);
                        record.setData(newRecord);
                    }
                );
            }

            function _delete(recordId) {
                return $http.put(idUrl(recordId), { deleted: true })
                    .success(function() {
                        var newRecord = ng.merge(record.all(), { deleted: true });
                        record.setData(newRecord);
                    }
                );
            }

            function idUrl(recordId) {
                var idConfig = ng.copy(apiConfig);
                idConfig.endpoint += '/' + recordId;
                return apiUriGenerator(apiConfig);
            }

            return {
                _record: record,
                init: init,
                observe: record.observe,
                all: record.all,
                create: create,
                delete: _delete,
                update: update
            };
        };
    }]);
});
