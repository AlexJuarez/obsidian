define(function (require) {
    'use strict';

    var app = require('./../module');
    var template = require('tpl!./loadingIndicator.html');

    app.directive('loadingIndicator', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: false,
            scope: false,
            link: function(scope, element, attrs) {

                var showLoader = scope.$eval(attrs.showLoader);

                if (showLoader) {
                    element.addClass('indicate-loading');
                    var childScope = scope.$new();
                    scope.$watch(attrs.loadingIndicator, function(val) {
                        childScope.isLoaded = val;
                        if (val) {
                            element.removeClass('indicate-loading');
                        }
                    });

                    var loader = $compile(template)(childScope);
                    element.prepend(loader);
                }
            }
        };
    }]);
});
