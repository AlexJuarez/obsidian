/**
 * Created by Alex on 3/1/2015.
 */
/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./mixpo-icons.html');
    require('tpl!./navigation.html');
    require('tpl!./index.html');
    require('tpl!./typography.html');
    require('tpl!./button.html');
    require('tpl!./table.html');
    require('tpl!./dropdown.html');
    require('tpl!./nav.html');

    return app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'HomeCtrl'
            });
    }]);
});
