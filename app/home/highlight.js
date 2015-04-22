define(function (require) {
    'use strict';

    var app = require('./module');
    var hljs = require('hljs');

    app.directive('highlight', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var content = element.find('code').text();
                element.find('code').text(content.trim());
                hljs.highlightBlock(element[0]);
            }
        };
    }]);
});
