define(function (require) {
    'use strict';

    var module = require('./module');
    var ng = require('angular');

    var store = {};
    var observers = {};

    module.service('storeService', [function () {
        function setData(id, data) {
            store[id] = data;
            notifyObservers(id);
        }

        function all(id) {
            return store[id];
        }

        function observe(id, callback) {
            if (typeof observers[id] === 'undefined') {
                observers[id] = [];
            }
            observers[id].push(callback);
        }

        function notifyObservers(id) {
            ng.forEach(observers[id], function (fn) {
                fn();
            });
        }

        return {
            setData: setData,
            observe: observe,
            all: all
        };
    }]);
});
