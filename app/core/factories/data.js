define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('dataFactory', ['$http', '$q', '$rootScope', '$timeout', function ($http, $q, $rootScope, $timeout) {
        return function (sortFn) {
            var initialized = false;
            var data = [];
            var observers = {};
            var observerId = 0;

            sortFn = sortFn || function (d) { return d; };

            function init(url, transform) {
                var deferred = $q.defer();

                if (!initialized) {
                    transform = transform || function (d) { return d; };

                    initialized = true;

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

            function addData(d) {
                var uniqueSet = {};
                var item, i;

                for (i = 0; i < d.length; i++) {
                    item = d[i];
                    uniqueSet[item.id] = true;
                }

                var temp = [];

                for (i = 0; i < data.length; i++) {
                    item = data[i];
                    if (!uniqueSet[item.id]) {
                        temp.push(item);
                    }
                }

                data = sortFn(temp.concat(d));
                notifyObservers();
            }

            function all() {
                return data;
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
                observe: observe,
                notifyObservers: notifyObservers
            };
        };
    }]);
});
