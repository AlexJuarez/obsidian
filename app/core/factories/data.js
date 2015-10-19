define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('dataFactory', ['$http', '$q', '$rootScope', '$timeout', 'apiUriGenerator', 'observerFactory', function ($http, $q, $rootScope, $timeout, apiUriGenerator, observerFactory) {
        return function (sortFn) {
            var initialized = false;
            var loaded = false;
            var data = [];
            var observers = observerFactory();

            sortFn = sortFn || function (d) { return d; };

            function init(config, transform) {
                var url = apiUriGenerator(config);
                if (!url) {
                    throw new Error('Malformed API URI object');
                }

                var deferred = $q.defer();

                if (!initialized) {
                    transform = transform || function (d) { return d; };

                    initialized = true;

                    $http.get(url).success(function (d) {
                        loaded = true;
                        setData(transform.call(this, d));
                        deferred.resolve(data);
                    });
                } else {
                    deferred.resolve(data);
                }

                return deferred.promise;
            }

            function setData(d) {
                if (ng.isArray(d)) {
                    addData(d);
                } else {
                    data = sortFn(d);
                    observers.notifyObservers();
                }
            }

            function findIndex() {

            }

            function addData(d, event) {
                if (ng.isArray(d)) {
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
                } else {

                }

                filterDeleted();
                observers.notifyObservers(event);
            }

            function all() {
                return data;
            }

            function filterDeleted() {
                if (ng.isArray(data)) {
                    var item;
                    for(var i = 0; i < data.length; i ++) {
                        item = data[i];
                        if(item.deleted === true) {
                            data.splice(i, 1);
                        }
                    }
                }
            }

            function filtered(filterfn){
                filterfn = filterfn || function () { return true; };
                var output = [];
                var item;

                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    if(filterfn(item)) {
                        output.push(item);
                    }
                }

                return output;
            }

            function isLoaded() {
                return loaded;
            }

            function getById(id) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
                        return data[i];
                    }
                }
            }

            return {
                _observers: observers._observers,
                init: init,
                setData: setData,
                addData: addData,
                isLoaded: isLoaded,
                getById: getById,
                all: all,
                filtered: filtered,
                observe: observers.observe,
                notifyObservers: observers.notifyObservers
            };
        };
    }]);
});
