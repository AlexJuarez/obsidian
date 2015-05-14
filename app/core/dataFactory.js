define(function (require) {
    'use strict';

    var module = require('./module');
    var ng = require('angular');

    module.factory('dataFactory', ['$http', function ($http) {
        return function (sortFn) {
            var initialized = false;
            var data = [];
            var observers = [];
            sortFn = sortFn || function (d) { return d; };

            function init(url, transform) {
                if (initialized) {
                    throw 'service has already been initialized';
                }

                initialized = true;

                return $http.get(url).success(function (d) {
                    data = sortFn(transform.call(this, d));
                    notifyObservers();
                });
            }

            function setData(d) {
                data = sortFn(d);
                notifyObservers();
            }

            function addData(d) {
                data = sortFn(data.concat(d));
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
