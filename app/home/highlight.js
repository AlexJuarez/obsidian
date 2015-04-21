define(function (require) {
    'use strict';

    var app = require('./module');
    var hljs = require('hljs');

    app.directive('createSnippet', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                hljs.highlightBlock(element[0]);
            }

        };
    }]);
});
