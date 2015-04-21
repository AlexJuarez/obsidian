define(function (require) {
    'use strict';

    var app = require('./module');
    var hljs = require('hljs');
    var ng = require('angular');
    require('tpl!./code-snippet.html');

    app.directive('createSnippet', ['$templateCache', '$compile', function ($templateCache, $compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                //Set the language
                scope.language = attrs.code;

                //get the cached template and compile it
                var template = $compile($templateCache.get('home/code-snippet.html'))(scope);

                var clone = element.clone();
                clone.removeAttr('create-snippet');

                //Select the compiled template code element.
                ng.element(template[0]).find('code').text(clone[0].outerHTML);

                //Highlight the code element
                hljs.highlightBlock(template[0]);

                //append after the element the fruits of our labor
                element.after(template[0]);
            }

        };
    }]);
});
