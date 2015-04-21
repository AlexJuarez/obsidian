define(function (require) {
    'use strict';

    var app = require('./module');
    var hljs = require('hljs');

    app.directive('highlight', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                hljs.highlightBlock(element[0]);
            }

        };
    }]);
});
