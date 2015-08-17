
/**
 * Read, create and update a single record from the database
 */

define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('recordPoolFactory', ['recordFactory', '$q', '$rootScope', '$timeout', function (recordFactory, $q, $rootScope, $timeout) {
        return function (apiConfig) {
            var observers = {};
            var records = {};
            var observerId = 0;

            function getById(recordId) {
                var deferred = $q.defer();

                if (records[recordId]) {
                    deferred.resolve(records[recordId]);
                } else {
                    var newConfig = ng.copy(apiConfig);
                    newConfig.endpoint += '/' + recordId;
                    var record = recordFactory(newConfig);
                    record.init().then(function () {
                        records[recordId] = record;
                        deferred.resolve(record);
                    });

                    record.observe(function() {
                        notifyObservers(record.all());
                    }, undefined, true);
                }

                return deferred.promise;
            }

            function update(recordId, updatedFields) {
                return getById(recordId).then(function(record) {
                    return record.update(record.all().id, updatedFields);
                });
            }

            function _delete(recordId) {
                return getById(recordId).then(function(record) {
                    return record.delete(record.all().id);
                });
            }

            function create(newRecord) {
                var record = recordFactory(apiConfig);
                record.observe(function() {
                    notifyObservers(record.all());
                }, undefined, true);
                return record.create(newRecord);
            }

            function observe(callback, $scope, preventImmediate) {
                var id = observerId++;
                observers[id] = callback;

                if (preventImmediate !== true) {
                    callback();
                }

                if ($scope) {
                    $scope.$on('$destroy', function() {
                        delete observers[id];
                    });
                }
            }

            function notifyObservers(event) {

                for (var x in observers) {
                    observers[x](event);
                }

                $timeout(function () {
                    $rootScope.$apply();
                });
            }

            return {
                _records: records,
                getById: getById,
                update: update,
                delete: _delete,
                create: create,
                observe: observe
            };
        };
    }]);
});
