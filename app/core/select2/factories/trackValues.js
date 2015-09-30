define(function(require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.factory('trackValuesFactory', [
    function() {
        return function() {
            var tracked = {};

            function reset() {
                tracked = {};
            }

            function add(index, value) {
                tracked[JSON.stringify(value)] = { index: index, value: value };
                tracked[index] = { index: index, value: value };
            }

            function get(index) {
                return tracked[index] || tracked[JSON.stringify(index)];
            }

            function contains(index) {
                return typeof get(index) !== 'undefined';
            }

            function isEmpty(){
                return ng.equals({}, tracked);
            }

            return {
                reset: reset,
                add: add,
                get: get,
                contains: contains,
                isEmpty: isEmpty
            };

        };
    }]);
});
