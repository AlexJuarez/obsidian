define(function(require){
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    require('select2');
    var $ = require('jquery');
    var config = $.fn.select2.amd.require('select2/defaults').defaults;

    module.constant('NG_OPTIONS_REGEXP', /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/);

    module.value('select2Config', {
        minimumResultsForSearch: 10,
        dropdownAutoWidth: false,
        tokenSeparators: [',', ' ']
    });

    var attrOptions = ['placeholder', 'minimumResultsForSearch', 'dropdownAutoWidth', 'maximumSelectionLength', 'tokenSeparators', 'tags', 'ajax', 'query', 'width', 'allowClear'];

    var placeholderMultiselect = 'Select some options';
    var placeholderSelect = 'Select an option';

    module.directive('select2', ['$timeout', 'select2Config', 'NG_OPTIONS_REGEXP', '$log', '$compile',
        function ($timeout, defaults, NG_OPTIONS_REGEXP, $log, $compile) {
        return {
            restrict: 'A',
            require: '?ngModel',
            terminal: true,
            link: function(scope, element, attr, ngModel) {
                var match, valuesFn;
                var opts = ng.extend({}, defaults, scope.$eval(attr.options));


                ng.forEach(attr, function(value, key) {
                    if (attrOptions.indexOf(key) > -1) {
                        opts[key] = scope.$eval(value);
                    }
                });

                opts.matcher = function(params, data) {
                    console.log(data);
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
                            classes = curr[0].className.split(" ");
                            for (var i = 0; i < classes.length; i++) {
                                if (classes[i].indexOf('theme') > -1) {
                                    return classes[i];
                                }
                            }
                        }
                        curr = curr.parent();
                    }
                }

                var theme = findTheme();

                if (theme) {
                    opts.theme = theme;
                }

                function setDefaultText() {
                    if (attr.hasOwnProperty('multiple')) {
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

                if (attr.ngOptions) {
                    if (!(match = attr.ngOptions.match(NG_OPTIONS_REGEXP))) {
                        $log.warn('Invalid ngOptions: ', attr.ngOptions);
                    }

                    valuesFn = match[7];

                    scope.$watchCollection(valuesFn, function() {
                        $timeout(function() {
                            setDefaultText();

                            element.trigger('change');
                        });
                    });
                }

                if (ngModel) {
                    var originalRender = ngModel.$render;
                    ngModel.$render = function() {
                        originalRender();
                        $timeout(function() {
                            element.trigger('change');
                        });
                    };

                    var viewWatch = function() {
                        return ngModel.$viewValue;
                    };

                    scope.$watch(viewWatch, ngModel.$render, true);
                }

                scope.$on('$destroy', function() {
                    element.select2('destroy');
                });

                $timeout(function() {
                    setDefaultText();

                    element.select2(opts);
                });
            }
        };
    }]);
});
