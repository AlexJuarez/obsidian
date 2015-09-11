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
                scope.transition = transition;
                scope.$state = $state;

                function transition(area){
                    if (!$state.includes(area)){
                        if ($state.params.clientId) {
                            $state.go(area + '.campaigns.client', {clientId: $state.params.clientId});
                        } else if ($state.params.divisionId) {
                            $state.go(area + '.campaigns.division', {divisionId: $state.params.divisionId});
                        } else if ($state.params.accountId) {
                            $state.go(area + '.campaigns.account', {accountId: $state.params.accountId});
                        } else if ($state.params.campaignId) {
                            $state.go(area +'.campaigns.detail', {campaignId: $state.params.campaignId});
                        } else {
                            $state.go(area);
                        }
                    }
                }

                $rootScope.$on('$stateChangeSuccess', function () {
                    scope.open = false;
                });
            }
        };
    }]);
});
