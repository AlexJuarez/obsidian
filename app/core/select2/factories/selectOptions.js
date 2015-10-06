define(function(require) {
    'use strict';

    var module = require('./../../module');

    module.constant('NG_OPTIONS_REGEXP', /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/);
    // 1: value expression (valueFn)
    // 2: label expression (displayFn)
    // 3: group by expression (groupByFn)
    // 4: disable when expression (disableWhenFn)
    // 5: array item variable name
    // 6: object item key variable name
    // 7: object item value variable name
    // 8: collection expression
    // 9: track by expression

    var uid = 0;
    var nextUid = function() {
        return uid++;
    };

    /**
     * Computes a hash of an 'obj'.
     * Hash of a:
     *  string is string
     *  number is number as string
     *  object is either result of calling $$hashKey function on the object or uniquely generated id,
     *         that is also assigned to the $$hashKey property of the object.
     *
     * @param obj
     * @returns {string} hash string such that the same input will have the same hash string.
     *         The resulting string key is in 'type:hashKey' format.
     */

    function hashKey(obj, nextUidFn) {
        var key = obj && obj.$$hashKey;

        if (key) {
            if (typeof key === 'function') {
                key = obj.$$hashKey();
            }
            return key;
        }

        var objType = typeof obj;
        if (objType === 'function' || (objType === 'object' && obj !== null)) {
            key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
        } else {
            key = objType + ':' + obj;
        }

        return key;
    }

    module.factory('selectOptionsFactory', ['$log', '$parse', 'NG_OPTIONS_REGEXP', function($log, $parse, NG_OPTIONS_REGEXP) {
        return function(ngOptions, element, scope, tracked) {
            var getOptions, valuesFn;

            if (ngOptions) {
                var match;
                if (!(match = ngOptions.match(NG_OPTIONS_REGEXP))) {
                    $log.warn('Invalid ngOptions: ', ngOptions);
                }

                // Extract the parts from the ngOptions expression

                // The variable name for the value of the item in the collection
                var valueName = match[5] || match[7];
                // The variable name for the key of the item in the collection
                var keyName = match[6];

                // An expression that generates the viewValue for an option if there is a label expression
                var selectAs = / as /.test(match[0]) && match[1];
                // An expression that is used to track the id of each object in the options collection
                var trackBy = match[9];
                // An expression that generates the viewValue for an option if there is no label expression
                var valueFn = $parse(match[2] ? match[1] : valueName);
                var selectAsFn = selectAs && $parse(selectAs);
                var viewValueFn = selectAsFn || valueFn;
                var trackByFn = trackBy && $parse(trackBy);

                // Get the value by which we are going to track the option
                // if we have a trackFn then use that (passing scope and locals)
                // otherwise just hash the given viewValue
                var getTrackByValueFn = trackBy ?
                    function(value, locals) { return trackByFn(scope, locals); } :
                    function(value) { return hashKey(value); };

                var displayFn = $parse(match[2] || match[1]);
                var groupByFn = $parse(match[3] || '');
                var disableWhenFn = $parse(match[4] || '');
                valuesFn = $parse(match[8]);

                var locals = {};
                var getLocals = keyName ? function(value, key) {
                    locals[keyName] = key;
                    locals[valueName] = value;
                    return locals;
                } : function(value) {
                    locals[valueName] = value;
                    return locals;
                };

                getOptions = function(values) {
                    tracked.reset();
                    var data = [];
                    var groups = {};
                    var value, locals, id, label, viewValue, datum, key;
                    for (key in values) {
                        if(values.hasOwnProperty(key)) {
                            value = values[key];
                            locals = getLocals(value, key);
                            label = displayFn(value, locals);
                            viewValue = viewValueFn(value, locals);
                            id = getTrackByValueFn(viewValue, locals);

                            //
                            tracked.add(id, label, viewValue, value);

                            datum = {
                                id: id,
                                text: label
                            };

                            //disabled
                            if (match[4]) {
                                datum.disabled = disableWhenFn(value, locals);
                            }

                            //groupby
                            if (match[3]) {
                                var group = groupByFn(value, locals);
                                if (!groups[group]) {
                                    groups[group] = [];
                                }
                                groups[group].push(datum);
                            } else {
                                data.push(datum);
                            }
                        }
                    }

                    if (match[3]) {
                        for (key in groups) {
                            if (groups.hasOwnProperty(key)) {
                                datum = {
                                    text: key,
                                    children: groups[key]
                                };

                                data.push(datum);
                            }
                        }
                    }

                    return data;
                };
            } else {
                getOptions = function(values) {
                    tracked.reset();
                    var data = [];

                    if (values) {
                        var id, text, option;
                        for (var i = 0; i < values.length; i++) {
                            option = values[i];
                            text = option.innerText;

                            if (option.hasAttribute('value')) {
                                id = option.getAttribute('value').value;
                            } else {
                                id = text;
                            }

                            data.push({
                                id: id,
                                text: text
                            });

                            tracked.add(id, text, id, id);
                        }
                    }

                    return data;
                };
            }

            return {
                getOptions: getOptions,
                valuesFn: valuesFn
            };
        };
    }]);
});
