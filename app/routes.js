/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';
    var app = require('./app');

    return app.config(['$urlRouterProvider', '$anchorScrollProvider', '$httpProvider', function ($urlRouterProvider, $anchorScrollProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('domainInterceptor');
        $urlRouterProvider.otherwise('/style-guide');
        $anchorScrollProvider.disableAutoScrolling();
    }]);
});
