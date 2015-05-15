define(function (require) {
    'use strict';

    var module = require('./../module');

    var store = {};

    module.service('storeService', ['dataFactory', function (dataFactory) {
        function setData(id, data) {
            if (typeof store[id] === 'undefined') {
                store[id] = dataFactory();
            }
            store[id].setData(data);
            store[id].notifyObservers();
        }

        function all(id) {
            return store[id].all();
        }

        function observe(id, callback) {
            if (typeof store[id] === 'undefined') {
                store[id] = dataFactory();
            }
            store[id].observe(callback);
        }

        return {
            setData: setData,
            observe: observe,
            all: all
        };
    }]);
});
