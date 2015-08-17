define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('dataFactory', ['$http', '$q', '$rootScope', '$timeout', 'propertyByString', 'apiUriGenerator', function ($http, $q, $rootScope, $timeout, propertyByString, apiUriGenerator) {
        return function (sortFn) {
            var initialized = false;
            var data = [];
            var observers = {};
            var observerId = 0;

            sortFn = sortFn || function (d) { return d; };

            function init(config, transform) {
                var url = apiUriGenerator(config);
                if (!url) {
                    throw new Error('Malformed API URI object');
                }

                var deferred = $q.defer();

                if (!initialized) {
                    initialized = true;
                    transform = transform || function(d) { return d; };

                    $http.get(url).success(function (d) {
                        data = sortFn(transform.call(this, d));
                        deferred.resolve(data);
                        notifyObservers();
                    });
                } else {
                    deferred.resolve(data);
                }

                return deferred.promise;
            }

            function setData(d) {
                data = sortFn(d);
                notifyObservers();
            }

            /**
             * Add records in array newData to the array on data specified by
             * propertyString
             *
             * @param newData {Array<object>} The new data to add
             * @param propertyString {string} The target array to add data
             */
            function addData(newData, propertyString) {
                var target = propertyByString.get(data, propertyString);
                if (typeof target === 'undefined') {
                    console.log('Could not get property ' + propertyString + ' of', data);
                }
                var uniqueNewData = {};
                var item, i;

                for (i = 0; i < newData.length; i++) {
                    item = newData[i];
                    uniqueNewData[item.id] = true;
                }

                var uniqueData = [];

                for (i = 0; i < target.length; i++) {
                    item = target[i];
                    if (!uniqueNewData[item.id]) {
                        uniqueData.push(item);
                    }
                }

                target = uniqueData.concat(newData);
                filterDeleted(target);
                if (propertyString) {
                    propertyByString.set(data, target, propertyString);
                } else {
                    data = target;
                }
                data = sortFn(data);
                notifyObservers();
            }

            function all() {
                return data;
            }

            function filterDeleted(target) {
                if (ng.isArray(target)) {
                    var item;
                    for(var i = 0; i < target.length; i ++) {
                        item = target[i];
                        if(item.deleted === true) {
                            target.splice(i, 1);
                        }
                    }
                }
            }

            function filtered(filterFn){
                filterFn = filterFn || function () { return true; };
                var data = all();
                var output = [];
                var item;

                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    if(filterFn(item)) {
                        output.push(item);
                    }
                }

                return output;
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
                init: init,
                setData: setData,
                addData: addData,
                all: all,
                filtered: filtered,
                observe: observe,
                notifyObservers: notifyObservers
            };
        };
    }]);
});
