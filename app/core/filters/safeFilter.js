define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('safe', ['$sce', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        };
    }]);
});
