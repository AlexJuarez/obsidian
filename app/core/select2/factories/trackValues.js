define(function(require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.factory('trackValuesFactory', [
    function() {
        return function() {
            var Tracked = function() {
                this._data = {};
            };

            Tracked.prototype.reset = function() {
                this._data = {};
            };

            Tracked.prototype.add = function(index, label, viewValue, value) {
                var o = { index: index, label: label, viewValue: viewValue, value: value };
                this._data[index] = this._data[JSON.stringify(viewValue)] = o;
            };

            Tracked.prototype.get = function(index) {
                return this._data[index] || this._data[JSON.stringify(index)];
            };

            Tracked.prototype.contains = function(index) {
                return typeof this.get(index) !== 'undefined';
            };

            Tracked.prototype.isEmpty = function(){
                return ng.equals({}, this._data);
            };

            return new Tracked();
        };
    }]);
});
