/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';
    var app = require('./app');

    return app.config(['$urlRouterProvider', '$anchorScrollProvider', function ($urlRouterProvider, $anchorScrollProvider) {
        $urlRouterProvider.otherwise('/style-guide');
        $anchorScrollProvider.disableAutoScrolling();
    }]);
});
