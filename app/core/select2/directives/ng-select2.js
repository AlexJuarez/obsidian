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
                require: '?ngModel',
                priority: 0.5,
                terminal: true,
                link: function (scope, element, attr, ngModel) {
                    var trackValues = trackValuesFactory();
                    var selectOptions = selectOptionsFactory(attr.ngOptions, element, scope, trackValues);
                    var modelSync;
                    var theme, data, select2;
                    var initialized = false;
                    //set a flag to see if this is a multiselect instance
                    var isMultiple = attr.hasOwnProperty('multiple') && attr.multiple !== 'false';
                    var opts = setUpOptions();
                    var formatModelInsert = opts.formatModelInsert || function (v) {
                            return {
                                value: v.id,
                                name: v.text
                            };
                        };

                    if (attr.ngOptions) {
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
                            isMultiple: isMultiple
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
                        if (!term || data.id === '') {
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

                    function setUpSelect2() {
                        return $timeout(function () {
                            if (!opts.tags) {
                                opts.query = function (query) {
                                    if (attr.query) {
                                        attr.query(data, query.term, query.callback);
                                    } else {
                                        query.callback({results: matches(query.term, data)});
                                    }
                                };
                            }

                            if (isMultiple) {
                                opts.placeholder = opts.placeholder || placeholderMultiselect;
                            } else {
                                //add a element to assume the placeholder value
                                element.append(ng.element('<option />'));
                                opts.placeholder = opts.placeholder || placeholderSelect;
                            }

                            if (!opts.tags) {
                                opts.data = ng.copy(data.slice(0, opts.limit));
                            } else {
                                opts.data = data;
                            }

                            element.select2(opts);
                            var debounce = null;
                            if (modelSync) {
                                element.on('change', function () {
                                    if (!debounce) {
                                        debounce = $timeout(function () {
                                            modelSync.updateModel(element.select2('data'));
                                            debounce = null;
                                        }, 10);
                                    }
                                });
                            }
                        });
                    }

                    function selectValues() {
                        if (modelSync) {
                            var focused;
                            var viewValues = modelSync.get();
                            if (!trackValues.isEmpty()) {
                                if (ng.isArray(viewValues) && isMultiple) {
                                    var values = [];
                                    ng.forEach(viewValues, function (v) {
                                        var trackValue = trackValues.get(v);
                                        if (trackValue) {
                                            values.push(trackValue.index);
                                        }
                                    });

                                    //focus is lost when change is triggered
                                    focused = $(':focus');
                                    element.val(values).trigger('change');
                                    if (focused.length) {
                                        focused.focus();
                                    }
                                } else {
                                    var trackValue = trackValues.get(viewValues);
                                    if (trackValue) {
                                        //focus is lost when change is triggered
                                        focused = $(':focus');
                                        element.val(trackValue.index).trigger('change');
                                        if (focused.length) {
                                            focused.focus();
                                        }
                                    }
                                }
                            }
                        }
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
