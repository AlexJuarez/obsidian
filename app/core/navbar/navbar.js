/**
 * Created by alex on 4/15/15.
 */
define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./navbar.html');

    app.directive('navbar', ['$rootScope', '$state', function ($rootScope, $state) {
        return {
            restrict: 'A',
            templateUrl: 'core/navbar/navbar.html',
            replace: true,
            scope: {
                open: '='
            },
            link: function (scope) {
                scope.analytics = analytics;

                function analytics(){
                    if ($state.params.clientId) {
                        $state.go('analytics.campaigns.client')
                    }
                }

                $rootScope.$on('$stateChangeSuccess', function () {
                    scope.open = false;
                });
            }
        };
    }]);
});
