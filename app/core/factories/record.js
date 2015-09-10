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
            var idUrl = apiUriGenerator(apiConfig.update);

            function init() {
                return record.init(apiConfig.update);
            }

            function create(newRecord) {
                return $http.post(apiUriGenerator(apiConfig.create), newRecord)
                    .success(function(newRecord) {
                        record.setData(newRecord);
                    }
                );
            }

            function update(updatedFields) {
                return $http.put(idUrl, updatedFields)
                    .success(function() {
                        var newRecord = ng.merge(record.all(), updatedFields);
                        record.setData(newRecord);
                    }
                );
            }

            function _delete() {
                return $http.put(idUrl, { deleted: true })
                    .success(function() {
                        var newRecord = ng.merge(record.all(), { deleted: true });
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
                delete: _delete,
                update: update
            };
        };
    }]);
});
