define(function (require) {
    'use strict';

    var app = require('./../module');
    var hljs = require('hljs');

    app.directive('highlight', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var code = element.find('code');
                var content = code.html();
                code.html(content.trim());
                hljs.highlightBlock(code[0]);
            }
        };
    }]);
});
