//jshint maxstatements:50
define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    require('select2');
    var $ = require('jquery');

    function findTheme(element) {
        var curr = element,
            classes;
        while (curr.length) {
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
        tokenSeparators: [','],
        limit: 25,
        searchLimit: 5
    });

    var attrOptions = ['placeholder', 'limit', 'searchLimit', 'minimumResultsForSearch', 'formatSelectionTooBig', 'maximumSelectionLength', 'tokenSeparators', 'tags', 'query', 'width', 'allowClear', 'formatModelInsert'];

    var placeholderMultiselect = 'Select some options';
    var placeholderSelect = 'Select an option';

    module.directive('select2', ['$timeout', 'select2Config', '$parse', 'trackValuesFactory', '$injector', 'selectOptionsFactory', 'modelSyncFactory',
        function ($timeout, defaults, $parse, trackValuesFactory, $injector, selectOptionsFactory, modelSyncFactory) {
            return {
                restrict: 'A',
                require: ['select', '?ngModel'],
                priority: 1,
                link: function (scope, element, attr, ctrls) {
                    var ngModel = ctrls[1];
                    var selectCtrl = ctrls[0];
                    var optionsExpression = attr.ngOptions || attr.s2Options;
                    var trackValues = trackValuesFactory();
                    var selectOptions = selectOptionsFactory(optionsExpression, scope, trackValues);
                    var modelSync;
                    var theme, data, select2;
                    var initialized = false;
                    //set a flag to see if this is a multiselect instance
                    var multiple = attr.hasOwnProperty('multiple') && attr.multiple !== 'false';
                    var opts = setUpOptions();
                    var formatModelInsert = opts.formatModelInsert || function (ele) {
                            var text = ele.text();
                            var id = ele.attr('value') || text;
                            return {
                                value: id,
                                name: text
                            };
                        };

                    if (optionsExpression) {
                        scope.$watchCollection(getValues(), function (values) {
                            data = selectOptions.getOptions(values);
                            initOrUpdate();
                        });
                    } else {
                        var values = element.find('option');
                        data = selectOptions.getOptions(values);
                    }

                    if (ngModel) {
                        if (attr.ngModelOptions) {
                            var ngModelOptions = $injector.get('ngModelOptionsDirective')[0];
                            $injector.invoke(ngModelOptions.controller, ngModel, {$scope: scope, $attrs: attr});
                        }

                        modelSync = modelSyncFactory(ngModel, trackValues, {
                            formatModel: formatModelInsert,
                            valuesFn: getValues(),
                            scope: scope,
                            isMultiple: multiple
                        });

                        var originalRender = ngModel.$render;
                        ngModel.$render = function () {
                            originalRender();
                            initOrUpdate();
                        };

                        scope.$watch(modelSync.get, ngModel.$render, true);
                    } else {
                        initOrUpdate();
                    }

                    function getValues() {
                        return selectOptions.valuesFn;
                    }

                    function setUpOptions() {
                        var opts = ng.extend({}, defaults, scope.$eval(attr.options));

                        //Add each attribute that is in the white list to the options hash
                        ng.forEach(attr, function (value, key) {
                            if (attrOptions.indexOf(key) > -1) {
                                opts[key] = scope.$eval(value);
                            }
                        });

                        if (!opts.width) {
                            opts.width = function () {
                                return element.width() + 40;
                            };
                        }

                        theme = findTheme(element);

                        if (theme) {
                            opts.theme = theme;
                        }

                        return opts;
                    }

                    function matches(term, data) {
                        term = $.trim(term);
                        if (!term || data.id === '' || data.id === '?') {
                            return data.slice(0, opts.limit);
                        }

                        var results = [];

                        var value;
                        for (var i = 0, length = data.length; i < length; i++) {
                            value = data[i];
                            if (value.text.indexOf(term) > -1) {
                                results.push(value);
                            }

                            if (results.length >= opts.searchLimit) {
                                break;
                            }
                        }

                        return results;
                    }

                    //Added for when a keyboard triggers a focusout event
                    /*var isMobile = (function() {
                        try{ document.createEvent("TouchEvent"); return true; }
                        catch(e){ return false; }
                    })();*/

                    function setUpSelect2() {
                        return $timeout(function () {
                            if (!opts.tags && optionsExpression) {
                                opts.query = function (query) {
                                    if (attr.query) {
                                        attr.query(data, query.term, query.callback);
                                    } else {
                                        query.callback({results: matches(query.term, data)});
                                    }
                                };
                            }

                            if (multiple) {
                                opts.placeholder = opts.placeholder || placeholderMultiselect;
                            } else {
                                //add a element to assume the placeholder value
                                opts.placeholder = opts.placeholder || placeholderSelect;
                                if (attr.s2Options) {
                                    element.prepend('<option value="" selected="selected" />');
                                } else if (attr.ngOptions) {
                                    var text = element.children().eq(0).text();
                                    if (!text) {
                                        element.children().eq(0).attr('value', '');
                                    }
                                }
                            }

                            if (attr.s2Options) {
                                if (!opts.tags) {
                                    opts.data = ng.copy(data.slice(0, opts.limit));
                                } else {
                                    opts.data = data;
                                }
                            }

                            element.select2(opts);
                            //var select2 = element.select2(opts).data('select2');
                            //Set up these event listeners for mobile;
                            /*if (isMobile) {
                                select2.$dropdown.on('mousedown', function(e) {
                                    e.stopPropagation();
                                });
                                select2.$container.on('mousedown', function(e) {
                                    e.stopPropagation();
                                });
                                select2.$container.on('focusout', '.select2-search__field', function(e) {
                                    element.select2('close');
                                });
                            }*/
                        });
                    }

                    function selectValues() {
                        if (modelSync) {
                            var focused;
                            var viewValues = modelSync.get();
                            if (!trackValues.isEmpty()) {
                                if (ng.isArray(viewValues) && multiple) {
                                    var values = [];
                                    ng.forEach(viewValues, function (v) {
                                        var trackValue = trackValues.get(v);
                                        if (trackValue) {
                                            values.push(trackValue.index);
                                        }
                                    });

                                    //focus is lost when change is triggered
                                    $timeout(function() {
                                        focused = $(':focus');
                                        element.val(values).trigger('change');
                                        if (focused.length) {
                                            focused.focus();
                                        }
                                    });
                                } else {
                                    var trackValue = trackValues.get(viewValues);
                                    if (trackValue) {
                                        //focus is lost when change is triggered
                                        $timeout(function() {
                                            focused = $(':focus');
                                            //change event triggers a ngModel update
                                            element.val(trackValue.index).trigger('change');
                                            if (focused.length) {
                                                focused.focus();
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }

                    selectCtrl.writeValue = function () {
                        //noop
                    };

                    if (!multiple) {
                        selectCtrl.readValue = function readS2OptionsValue() {
                            var selection = trackValues.get(element.val());

                            if (selection) {
                                return selection.viewValue;
                            }
                            return null;
                        };
                    } else {
                        selectCtrl.readValue = function readS2OptionsMultiple() {
                            var values = element.val() || [];
                            var viewValues = [];
                            var collection = getValues()(scope);
                            var isArray = ng.isArray(collection);

                            for (var i = 0; i < values.length; i++) {
                                var value = values[i];
                                var trackedValue = trackValues.get(value);
                                if (trackedValue) {
                                    viewValues.push(trackedValue.viewValue);
                                } else if (opts.tags && isArray) {
                                    var ele = element.find('option[value="' + value + '"]');
                                    if (ele.length && ele[0].hasAttribute('data-select2-tag')) {
                                        ele[0].removeAttribute('data-select2-tag');
                                        var formatted = formatModelInsert(ele);
                                        trackValues.add(value, value, formatted, value);
                                        collection.push(formatted);
                                        viewValues.push(formatted);
                                    }
                                }
                            }

                            return viewValues;
                        };
                    }


                    function initOrUpdate() {
                        if (!initialized) {
                            initialized = true;
                            select2 = setUpSelect2();
                        }

                        select2.then(function () {
                            selectValues();
                        });
                    }

                    //On destroy clean up the timeout/ select2 element
                    scope.$on('$destroy', function () {
                        if (select2) {
                            $timeout.cancel(select2);
                        }
                    });
                }
            };
        }]);
});
