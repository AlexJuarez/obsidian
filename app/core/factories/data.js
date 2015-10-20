define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    var uid = 0;
    function nextUid() {
        return uid++;
    }

    module.factory('dataFactory', ['$http', '$q', '$rootScope', '$timeout', 'apiUriGenerator', 'observerFactory', 'dataSyncService', function ($http, $q, $rootScope, $timeout, apiUriGenerator, observerFactory, dataSyncService) {
        return function (sortFn, options) {
            if (typeof options === 'undefined') {
                options = {}; //{ compareFn: function(){}, sync: string (create, update), prepFn: function(){} }
            }

            var id = nextUid();
            var initialized = false;
            var loaded = false;
            var data = [];
            var observers = observerFactory();
            var sortKey;
            var prepFn = options.prepFn || function (d) { var deferred = $q.defer(); deferred.resolve(d); return deferred.promise; };

            sortFn = sortFn || function (d) { return d; };

            var dataFactory = {
                _id: id,
                _observers: observers._observers,
                init: init,
                setData: setData,
                addData: addData,
                addRecord: addRecord,
                isLoaded: isLoaded,
                getById: getById,
                all: all,
                filtered: filtered,
                observe: observers.observe,
                notifyObservers: observers.notifyObservers
            };

            function getSortKey(config) {
                var key;
                if (config && config.queryParams) {
                    key = config.queryParams.order;
                    if (key) {
                        key = key.split(':')[0];
                    }
                }

                return key;
            }

            function init(config, transform) {
                var url = apiUriGenerator(config);
                if (!url) {
                    throw new Error('Malformed API URI object');
                }

                var deferred = $q.defer();

                if (!initialized) {
                    transform = transform || function (d) { return d; };

                    sortKey = getSortKey(config);
                    if (sortKey && options.sync) {
                        var endpoint = config.endpoint;
                        dataSyncService.register(dataFactory, endpoint);
                    }

                    initialized = true;

                    $http.get(url).success(function (d) {
                        loaded = true;
                        setData(transform.call(this, d), sortKey);
                        deferred.resolve(data);
                    });
                } else {
                    deferred.resolve(data);
                }

                return deferred.promise;
            }

            function setData(d, sortKey) {
                if (sortKey) {
                    addData(d);
                } else {
                    data = sortFn(d);
                    observers.notifyObservers();
                }
            }

            function findIndex(data, val, key) {
                var id = String(val[key]);
                var min = 0;
                var max = data.length - 1;
                var item, midpoint;
                var compareValue;
                var compareFn = options.compareFn || function(a, b) {
                        return a.localeCompare(b);
                    };

                while (min < max) {
                    midpoint = Math.floor((min + max)/2);
                    item = String(data[midpoint][key]);
                    compareValue = compareFn(id, item);

                    if (compareValue > 0) {
                        min = midpoint + 1;
                    } else if (compareValue < 0) {
                        max = midpoint;
                    } else {
                        min = max = midpoint;
                    }
                }

                //check the min value
                if (data[min] && id.localeCompare(data[min][key]) < 0 ) {
                    return min - 1;
                } else {
                    return min;
                }
            }

            function addRecord(d) {
                var item, index;
                if (sortKey && typeof d !== 'undefined' && typeof d.id !== 'undefined') {
                    item = getById(d.id);
                    if (item) {
                        prepFn(d).then(function(d) {
                            ng.extend(item, d);
                        });
                    } else if (options.sync === 'create') {
                        index = findIndex(data, d, sortKey);
                        prepFn(d).then(function(d) {
                            data.splice(index, 0, d);
                        });
                    }

                    filterDeleted();
                    observers.notifyObservers();
                }
            }

            function addData(d, event) {
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

            return dataFactory;
        };
    }]);
});
