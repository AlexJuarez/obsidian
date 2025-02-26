//jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./module');
    require('tpl!./mixpo-icons.html');
    require('tpl!./navigation.html');
    require('tpl!./charts.html');
    require('tpl!./index.html');
    require('tpl!./typography.html');
    require('tpl!./button.html');
    require('tpl!./table.html');
    require('tpl!./range-input.html');
    require('tpl!./tabs.html');
    require('tpl!./tab1.html');
    require('tpl!./tab2.html');
    require('tpl!./dropdown.html');
    require('tpl!./checkboxes.html');
    require('tpl!./radio-buttons.html');
    require('tpl!./select2.html');
    require('tpl!./tooltip.html');
    require('tpl!./nav.html');
    require('tpl!./forms.html');
    require('tpl!./validation.html');
    require('tpl!./pacing-chart.html');
    require('tpl!./modal.html');
    require('tpl!./new-client-form.html');
    require('tpl!./new-campaign-form.html');
    require('tpl!./new-account-form.html');
    require('tpl!./quartiles.html');
    require('tpl!./date-picker.html');
    require('tpl!./file-picker.html');
    require('tpl!./creative-thumbnail-view.html');
    require('tpl!./creative-preview.html');
    require('tpl!./notification.html');

    return app.config(['$stateProvider', '$urlRouterProvider', '$anchorScrollProvider', function ($stateProvider, $urlRouterProvider, $anchorScrollProvider) {
        $urlRouterProvider.otherwise('/style-guide');
        $anchorScrollProvider.disableAutoScrolling();

        $urlRouterProvider.when('/style-guide', '/style-guide/tab1' );

        $stateProvider
            .state('style-guide', {
                url: '/style-guide',
                templateUrl: 'style-guide/index.html',
                controller: 'styleGuideCtrl'
            })
            .state('style-guide.tab1', {
                url: '/tab1',
                views: {
                    tabs: {
                        templateUrl: 'style-guide/tab1.html'
                    }
                }
            })
            .state('style-guide.tab2', {
                url: '/tab2',
                views: {
                    tabs: {
                        templateUrl: 'style-guide/tab2.html'
                    }
                }
            });
    }]);
});
