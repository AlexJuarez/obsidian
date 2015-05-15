define(function (require) {
    'use strict';

    var app = require('./../module');
    var hljs = require('hljs');
    var ng = require('angular');
    require('tpl!./code-snippet.html');

    app.directive('createSnippet', ['$templateCache', '$compile', '$timeout', function ($templateCache, $compile, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    //Set the language
                    scope.language = attrs.createSnippet;

                    //get the cached template and compile it
                    var template = $compile($templateCache.get('style-guide/directives/code-snippet.html'))(scope);

                    scope.$apply();

                    var clone = element.clone();
                    clone.removeAttr('create-snippet');
                    clone.removeClass('ng-scope');
                    ng.forEach(clone.children(), function (child) {
                        ng.element(child).removeClass('ng-isolate-scope');
                    });

                    //Select the compiled template code element.
                    var code = ng.element(template[0]).find('code');
                    code.text(clone[0].outerHTML);

                    //Highlight the code element
                    hljs.highlightBlock(code[0]);

                    //append after the element the fruits of our labor
                    element.after(template[0]);
                });
            }
        };
    }]);
});
