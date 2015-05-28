define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    module.factory('dataFactory', ['$http', function ($http) {
        return function (sortFn) {
            var initialized = false;
            var data = [];
            var observers = [];
            sortFn = sortFn || function (d) { return d; };

            function init(url, transform) {
                if (!initialized) {
                    transform = transform || function (d) { return d; };

                    initialized = true;

                    return $http.get(url).success(function (d) {
                        data = sortFn(transform.call(this, d));
                        notifyObservers();
                    });
                }
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

            function observe(callback) {
                observers.push(callback);
            }

            function notifyObservers() {
                ng.forEach(observers, function (fn) {
                    fn();
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
