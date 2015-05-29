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
    require('tpl!./range-input.html');
    require('tpl!./dropdown.html');
    require('tpl!./checkboxes.html');
    require('tpl!./radio-buttons.html');
    require('tpl!./multi-select.html');
    require('tpl!./tooltip.html');
    require('tpl!./nav.html');
    require('tpl!./forms.html');
    require('tpl!./validation.html');
    require('tpl!./pacing-chart.html');
    require('tpl!./modal.html');
    require('tpl!./myModalContent.html');
    require('tpl!./quartiles.html');

    return app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('style-guide', {
                url: '/style-guide',
                templateUrl: 'style-guide/index.html',
                controller: 'styleGuideCtrl'
            });
    }]);
});
