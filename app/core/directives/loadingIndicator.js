define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./loadingIndicator.html');

    app.directive('loadingIndicator', ['topClients', function (topClients) {
        return {
            restrict: 'A',
            replace: true,
            scope: false,
            // scope: {
            //     isLoaded: '='
            // },
            templateUrl: 'core/directives/loadingIndicator.html',
            controller: ['$scope', function ($scope) {
                topClients.observe(updateTopClients, $scope, true);

                $scope.topClients = topClients.all();
            }]
            // link: function (scope, elem, attr) {

            //     //scope.isLoaded = false;
            //     //console.log( $parse(attr.isLoaded) );
                
            //     scope.$watch(attr.isLoaded, function(newValue) {
            //         console.log( 'watching attr',newValue );
            //         //scope.isLoaded = attr.isLoaded;
            //     });

                
            // }
        };
    }]);
});
