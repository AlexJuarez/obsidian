/**
 * Created by Alex on 3/1/2015.
 */
/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');

    return app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'HomeCtrl'
            });
    }]);
});
