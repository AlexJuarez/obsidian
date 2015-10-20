define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.factory('modelSyncFactory', [function() {
        return function (ngModel) {
            /**
             * if ngModelOptions is set with getterSetter
             * viewValue could be a function
             * @returns {*}
             */
            function get() {
                var options = ngModel.$options;
                if (ng.isFunction(ngModel.$viewValue) && options && options.getterSetter) {
                    return ngModel.$viewValue();
                } else {
                    return ngModel.$viewValue;
                }
            }

            return {
                get: get
            };
        };
    }]);
});
