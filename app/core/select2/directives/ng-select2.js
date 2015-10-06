//jshint maxstatements:40
define(function(require){
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    require('select2');
    var $ = require('jquery');
    var config = $.fn.select2.amd.require('select2/defaults').defaults;

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

    function findTheme(element) {
        var curr = element,
            classes;
        while(curr.length) {
            if (curr[0].className) {
                classes = curr[0].className.split(' ');
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].indexOf('theme') > -1) {
                        return classes[i];
                    }
                }
            }
            curr = curr.parent();
        }
    }

    module.value('select2Config', {
        minimumResultsForSearch: 10,
        dropdownAutoWidth: false,
        tokenSeparators: [',']
    });

    var attrOptions = ['placeholder', 'minimumResultsForSearch', 'dropdownAutoWidth', 'maximumSelectionLength', 'tokenSeparators', 'tags', 'ajax', 'width', 'allowClear', 'formatModelInsert'];

    var placeholderMultiselect = 'Select some options';
    var placeholderSelect = 'Select an option';

    module.directive('select2', ['$timeout', 'select2Config', 'NG_OPTIONS_REGEXP', '$log', '$parse', 'trackValuesFactory', '$injector',
        function ($timeout, defaults, NG_OPTIONS_REGEXP, $log, $parse, trackValuesFactory, $injector) {
        return {
            restrict: 'A',
            require: '?ngModel',
            priority: 0.5,
            terminal: true,
            link: function(scope, element, attr, ngModel) {
                var id = nextUid();
                var trackValues = trackValuesFactory();
                var match, valuesFn, trackBy, theme, select2, isMultiple, timer, data = [];
                var getModelFn = $parse(attr.ngModel);
                var getModel = function() { return getModelFn(scope); };
                var setModel = function(value) { return getModelFn.assign(scope, value) };

                var limit = scope.$eval(attr.limit) || 25;
                var searchLimit = scope.$eval(attr.searchLimit) || 25;
                //set a flag to see if this is a multiselect instance
                isMultiple = attr.hasOwnProperty('multiple') && attr.multiple !== 'false';
                var opts = setUpOptions();

                function setUpOptions() {
                    var opts = ng.extend({}, defaults, scope.$eval(attr.options));

                    //Add each attribute that is in the white list to the options hash
                    ng.forEach(attr, function(value, key) {
                        if (attrOptions.indexOf(key) > -1) {
                            opts[key] = scope.$eval(value);
                        }
                    });

                    if (!opts.width) {
                        opts.width = function() {
                            return element.width() + 40;
                        };
                    }

                    theme = findTheme(element);

                    if (theme) {
                        opts.theme = theme;
                    }

                    return opts;
                }

                if (attr.ngOptions) {
                    if (!(match = attr.ngOptions.match(NG_OPTIONS_REGEXP))) {
                        $log.warn('Invalid ngOptions: ', attr.ngOptions);
                    }

                    valuesFn = $parse(match[8]);
                    trackBy = match[9];
                    var keyName = match[6];
                    var valueName = match[5] || match[7];
                    var trackByFn = trackBy && $parse(trackBy);
                    var displayFn = $parse(match[2] || match[1]);

                    // Get the value by which we are going to track the option
                    // if we have a trackFn then use that (passing scope and locals)
                    // otherwise just hash the given viewValue
                    var getTrackByValueFn =  trackBy ?
                        function(value, locals) { return trackByFn(scope, locals); } :
                        function(value) { return hashKey(value); };

                    var getTrackByValue = function(value, key) {
                        return getTrackByValueFn(value, getLocals(value, key));
                    };

                    var getDisplayValue = function(value, key) {
                        return displayFn(value, getLocals(value, key));
                    };

                    var locals = {};
                    var getLocals = keyName ? function(value, key) {
                        locals[keyName] = key;
                        locals[valueName] = value;
                        return locals;
                    } : function(value) {
                        locals[valueName] = value;
                        return locals;
                    };

                    //Make a map of angular models -> values
                    scope.$watchCollection(valuesFn, function(values) {
                        updateValues(values, getTrackByValue, getDisplayValue);
                        initOrUpdate();
                    });
                } else {
                    //in the event of no ngOptions still want to bind the trackValues to change the model
                    var options = element.find('option');
                    trackValues.reset();
                    data = [];
                    ng.forEach(options, function(option) {
                        var key;
                        var text = option.innerText;
                        if (option.hasAttribute('value')) {
                            key = option.getAttributeNode('value').value;
                        } else {
                            key = text;
                        }
                        data.push({
                            id: key,
                            text: text
                        });
                        trackValues.add(key, key);
                    });
                }

                var formatModelInsert = opts.formatModelInsert || function(v) {
                        return {
                            value: v.id,
                            name: v.text
                        };
                    };

                function updateValues(values, getTrackByValue, getDisplayValue) {
                    data = [];
                    trackValues.reset();
                    var value;
                    for (var key in values) {
                        if (values.hasOwnProperty(key)) {
                            value = values[key];
                            var selectValue = getTrackByValue(value, key);
                            var displayValue = getDisplayValue(value, key);
                            data.push({
                                id: selectValue,
                                text: displayValue
                            });
                            trackValues.add(selectValue, value);
                        }
                    }
                }

                function updateModel() {
                    var options = element.select2('data');
                    var newValues = [];
                    var oldValues = [];
                    var length = options.length;
                    var v;
                    while(length--) {
                        v = options[length];
                        var trackValue = trackValues.get(v.id);
                        if (!trackValue) {
                            newValues.push(formatModelInsert(v));
                            //remove the select2 attribute or else things fall out of sync
                        } else {
                            oldValues.push(trackValue.value);
                        }
                    }

                    if (isMultiple) {
                        var values = valuesFn(scope);
                        if (newValues.length) {
                            if (ng.isArray(values)) {
                                [].push.apply(values, newValues);
                            } else {
                                $log.warn('Not sure how to add new values to hash.');
                            }
                        }
                        ngModel.$setViewValue(oldValues.concat(newValues));
                    } else {
                        console.log(id + ' ngModel viewValue: ', oldValues[0]);
                        setModel(oldValues[0]);
                    }
                    scope.$apply();
                }

                function matches(term, data) {
                    term = $.trim(term);
                    if (!term) return data.slice(0, limit);

                    var results = [];

                    var value;
                    for(var i = 0, length = data.length; i < length; i++) {
                        value = data[i];
                        if (value.text.indexOf(term) > -1) {
                            results.push(value);
                        }

                        if (results.length >= limit) {
                            break;
                        }
                    }

                    return results;
                }

                function setUpSelect2() {
                    return $timeout(function() {
                        opts.query = function(query) {
                            if (attr.query) {
                                attr.query(data, query.term, query.callback);
                            } else {
                                query.callback({ results: matches(query.term, data) });
                            }
                        };

                        if (isMultiple) {
                            opts.placeholder = opts.placeholder || placeholderMultiselect;
                        } else {
                            opts.placeholder = opts.placeholder || placeholderSelect
                        }

                        opts.data = data.slice(0, limit);
                        select2 = element.select2(opts);
                        var debouce = null;
                        element.on('change', function() {
                            if (!debouce) {
                                debouce = $timeout(function() {
                                    updateModel();
                                    debouce = null;
                                }, 10);
                            }
                        });
                    });
                }

                function selectValues() {
                    var focused;
                    if (!trackValues.isEmpty() && ngModel) {
                        if (ng.isArray(ngModel.$viewValue) && isMultiple) {
                            var values = [];
                            ng.forEach(ngModel.$viewValue, function(v) {
                                var trackValue = trackValues.get(v);
                                if (trackValue) {
                                    values.push(trackValue.index);
                                }
                            });

                            //focus is lost when change is triggered
                            focused = $(':focus');
                            element.select2('val', values);
                            if (focused.length) {
                                focused.focus();
                            }
                        } else {
                            var trackValue = trackValues.get(ngModel.$viewValue);
                            if (trackValue) {
                                //focus is lost when change is triggered
                                focused = $(':focus');
                                element.select2('val', trackValue.index);
                                if (focused.length) {
                                    focused.focus();
                                }
                            }
                        }
                    }
                }

                function initOrUpdate() {
                    if (!select2) {
                        timer = setUpSelect2();
                        timer.then(function() {
                            selectValues();
                        });
                    } else {
                        selectValues();
                    }
                }

                if (ngModel) {
                    if (attr.ngModelOptions) {
                        var ngModelOptions = $injector.get('ngModelOptionsDirective')[0];
                        $injector.invoke(ngModelOptions.controller, ngModel, { $scope: scope, $attrs: attr });
                    }

                    var originalRender = ngModel.$render;
                    ngModel.$render = function(val) {
                        console.log('ngModel value: ', val);
                        originalRender();
                        initOrUpdate();
                    };

                    var viewWatch = function() {
                        return ngModel.$viewValue;
                    };

                    scope.$watch(viewWatch, ngModel.$render, true);
                } else {
                    initOrUpdate();
                }

                //On destroy clean up the timeout/ select2 element
                scope.$on('$destroy', function() {
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                });
            }
        };
    }]);
});
