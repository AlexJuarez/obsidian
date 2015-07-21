define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('tableIcons', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/tableIcons.html',
            replace: true,
            transclude: true,
            scope: {
                icons: '=tableIcons',
                id: '=id',
                object: '=object',
                classes: '@class'
            },
            controller: ['$scope', 'campaignModal', function ($scope, campaignModal) {
                var icons = $scope.icons;

                for (var i = 0; i < icons.length; i++) {
                    var icon = icons[i];
                    var name = icon.toLowerCase().split('.');
                    if (name.length === 2) {
                        var control = name[0];
                        var action = name[1];

                        if (control === 'campaign') {
                            //capitalized the first letter of the action
                            $scope['show' + action.charAt(0).toUpperCase() + action.slice(1)] = true;
                            $scope[action] = campaignModal[action];
                        }
                    } else {
                        console.warn('Invalid syntax for icons use control.action');
                    }
                }
            }]
        };
    }]);
});
