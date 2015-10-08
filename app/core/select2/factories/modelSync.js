define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    module.factory('modelSyncFactory', ['$log', '$timeout', function ($log) {
        return function (ngModel, tracker, options) {
            options = options || {};
            var formatModel = options.formatModel;
            var valuesFn = options.valuesFn;
            var scope = options.scope;
            var isMultiple = options.isMultiple;

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

            function set(value) {
                var options = ngModel.$options;
                if (ng.isFunction(ngModel.$viewValue) && options && options.getterSetter) {
                    ngModel.$viewValue(value);
                } else {
                    ngModel.$setViewValue(value);
                }
            }

            function updateCollection(values) {
                var newValues = [];
                var trackValue, value;
                var length = values.length;

                while (length--) {
                    value = values[length];
                    trackValue = tracker.get(value.id);
                    if (!trackValue) {
                        newValues.push(formatModel(value));
                        value.element.removeAttribute('data-select2-tag');
                    }
                }

                addValues(newValues);
            }

            /**
             * adds any new values to value model
             * @param newValues
             */
            function addValues(newValues) {
                if (isMultiple && newValues.length && valuesFn) {
                    var values = valuesFn(scope);
                    if (ng.isArray(values)) {
                        [].push.apply(values, newValues);
                    } else {
                        $log.warn('Not sure how to add new values to hash.');
                    }
                }
            }

            return {
                updateCollection: updateCollection,
                _addValues: addValues,
                get: get,
                set: set
            };
        };
    }]);
});
