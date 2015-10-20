define(function (require) {
    'use strict';

    var module = require('./../module');

    var ng = require('angular');

    module.factory('dataFactory', ['$http', '$q', '$rootScope', '$timeout', 'apiUriGenerator', 'observerFactory', 'dataSyncService', function ($http, $q, $rootScope, $timeout, apiUriGenerator, observerFactory, dataSyncService) {
        return function (sortFn, options) {
            if (typeof options === 'undefined') {
                options = {};
            }

            var DataFactory = function(options) {
                this._initialized = false;
                this._loaded = false;
                this._data = [];
                this._observers = observerFactory();
                this._sortBy = options.sort; // {key: string, sorted: boolean}

                if (options.sortFn) {
                    this._sortFn = options.sortFn;
                }
            };

            DataFactory.prototype = {
                _sortFn: function (d) { return d; },
                init: function(config, transform) {
                    var that = this;
                    var url = apiUriGenerator(config);
                    if (!url) {
                        throw new Error('Malformed API URI object');
                    }

                    var deferred = $q.defer();

                    if (!this._initialized) {
                        transform = transform || function (d) { return d; };
                        var endpoint = config.endpoint;
                        dataSyncService.register(this, endpoint);

                        this._initialized = true;

                        $http.get(url).success(function (d) {
                            that._loaded = true;
                            that.setData(transform.call(that, d), that._sortBy.sorted);
                            deferred.resolve(that._data);
                        });
                    } else {
                        deferred.resolve(this._data);
                    }

                    return deferred.promise;
                },
                setData: function(d, sorted) {
                    if (ng.isArray(d)) {
                        this.addData(d, 'setData', sorted);
                    } else {
                        this._data = sortFn(d);
                        this._observers.notifyObservers();
                    }
                },
                findIndex: function(data, val, key) {
                    var id = String(val[key]);
                    var min = 0;
                    var max = data.length - 1;
                    var item, midpoint;
                    var compareValue;
                    var compareFn = this._sortBy.compareFn || function(a, b) {
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
                    return id.localeCompare(data[min][key]) < 0 ? min - 1 : min;
                },
                addData: function(d, event, sorted) {
                    var item, i, index;
                    if (ng.isArray(d)) {
                        var uniqueSet = {};

                        for (i = 0; i < d.length; i++) {
                            item = d[i];
                            uniqueSet[item.id] = true;
                        }

                        var temp = [];

                        for (i = 0; i < this._data.length; i++) {
                            item = this._data[i];
                            if (!uniqueSet[item.id]) {
                                temp.push(item);
                            }
                        }

                        if (!sorted) {
                            this._data = sortFn(temp.concat(d));
                        } else {
                            this._data = temp.concat(d);
                        }
                    } else {
                        item = this.getById(d.id);
                        if (item) {
                            ng.extend(item, d);
                        } else if(this._sortBy && this._sortBy.key) {
                            index = this.findIndex(this._data, d, this._sortBy.key);
                            this._data.splice(index, 0, d);
                        }
                    }

                    this.filterDeleted();
                    this._observers.notifyObservers(event);
                },
                all: function() {
                    return this._data;
                },
                filterDeleted: function(){
                    if (ng.isArray(this._data)) {
                        var item;
                        for(var i = 0; i < this._data.length; i ++) {
                            item = this._data[i];
                            if(item.deleted === true) {
                                this._data.splice(i, 1);
                            }
                        }
                    }
                },
                filtered: function(filterfn){
                    filterfn = filterfn || function () { return true; };
                    var output = [];
                    var item;

                    for (var i = 0; i < this._data.length; i++) {
                        item = this._data[i];
                        if(filterfn(item)) {
                            output.push(item);
                        }
                    }

                    return output;
                },
                isLoaded: function() {
                    return this._loaded;
                },
                getById: function(id) {
                    for (var i = 0; i < this._data.length; i++) {
                        if (this._data[i].id === id) {
                            return this._data[i];
                        }
                    }
                }
            };

            return new DataFactory(ng.extend(options, { sortFn: sortFn}));
        };
    }]);
});
