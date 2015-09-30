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
        if (objType == 'function' || (objType == 'object' && obj !== null)) {
            key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
        } else {
            key = objType + ':' + obj;
        }

        return key;
    }

    module.value('select2Config', {
        minimumResultsForSearch: 10,
        dropdownAutoWidth: false,
        tokenSeparators: [',', ' ']
    });

    var attrOptions = ['placeholder', 'minimumResultsForSearch', 'dropdownAutoWidth', 'maximumSelectionLength', 'tokenSeparators', 'tags', 'ajax', 'query', 'width', 'allowClear'];

    var placeholderMultiselect = 'Select some options';
    var placeholderSelect = 'Select an option';

    module.directive('select2', ['$timeout', 'select2Config', 'NG_OPTIONS_REGEXP', '$log', '$parse',
        function ($timeout, defaults, NG_OPTIONS_REGEXP, $log, $parse) {
        return {
            restrict: 'A',
            require: '?ngModel',
            terminal: true,
            link: function(scope, element, attr, ngModel) {
                var match, valuesFn, trackBy, theme, select2, trackValues = {}, isMultiple, timer;
                isMultiple = attr.hasOwnProperty('multiple') && attr.multiple !== "false";
                var opts = ng.extend({}, defaults, scope.$eval(attr.options));

                //Add each attribute that is in the white list to the options hash
                ng.forEach(attr, function(value, key) {
                    if (attrOptions.indexOf(key) > -1) {
                        opts[key] = scope.$eval(value);
                    }
                });

                opts.matcher = function(params, data) {
                    // Angular adds a null element with no value when using ngOptions, filter this value
                    if (data.id === '?' || !data.id) {
                        return null;
                    }

                    return config.matcher(params, data);
                };

                if (!opts.width) {
                    opts.width = function() {
                        return element.width() + 40;
                    };
                }

                function findTheme() {
                    var curr = element, classes;
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

                theme = findTheme();

                if (theme) {
                    opts.theme = theme;
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

                    // Get the value by which we are going to track the option
                    // if we have a trackFn then use that (passing scope and locals)
                    // otherwise just hash the given viewValue
                    var getTrackByValueFn =  trackBy ?
                        function(value, locals) { return trackByFn(scope, locals); } :
                        function(value) { return hashKey(value); };

                    var getTrackByValue = function(value, key) {
                        return getTrackByValueFn(value, getLocals(value, key));
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
                    trackValues = {};

                    scope.$watchCollection(valuesFn, function(values) {
                        ng.forEach(values, function(value, key) {
                            var selectValue = getTrackByValue(value, key);
                            trackValues[JSON.stringify(value)] = { index: selectValue, value: value };
                            //add both the hashed value and the select value, both are valid
                            trackValues[selectValue] = { index: selectValue, value: value };
                        });
                        initOrUpdate();
                    });
                } else {
                    //in the event of no ngOptions still want to bind the trackValues to change the model
                    var options = element.find('option');
                    trackValues = {};
                    ng.forEach(options, function(option) {
                        var key;
                        var text = option.innerText;
                        if (option.hasAttribute('value')) {
                            key = option.getAttributeNode('value').value;
                        } else {
                            key = text;
                        }
                        trackValues[key] = { index: key, value: key };
                    });
                }

                function initOrUpdate() {
                    setDefaultText();
                    timer = $timeout(function() {
                        //init select2 once
                        if (!select2) {
                            select2 = element.select2(opts);
                        }
                        if (!ng.equals({}, trackValues) && ngModel) {
                            //if ngModel is an array and is multiple set the element and trigger a change to update select2;
                            if (ng.isArray(ngModel.$viewValue) && isMultiple) {
                                var values = [];
                                ng.forEach(ngModel.$viewValue, function(v) {
                                    var trackValue = trackValues[JSON.stringify(v)];
                                    if (trackValue) {
                                        values.push(trackValue.index);
                                    }
                                });
                                element.val(values).trigger('change');
                            } else {
                                var trackValue = trackValues[ngModel.$viewValue] || trackValues[JSON.stringify(ngModel.$viewValue)];
                                if (trackValue) {
                                    element.val(trackValue.index).trigger('change');
                                }
                            }
                        }
                    });
                }

                function setDefaultText() {
                    if (isMultiple) {
                        opts.placeholder = opts.placeholder || placeholderMultiselect;
                    } else {
                        var option = element.find('option').eq(0);
                        var text = option.text();
                        if (!text) {
                            option.text(opts.placeholder || placeholderSelect);
                            option.val('?');
                        }
                    }
                }

                if (ngModel) {
                    var originalRender = ngModel.$render;
                    ngModel.$render = function(val) {
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
                    if (select2) {
                        element.select2('destroy');
                    }
                });
            }
        };
    }]);
});
