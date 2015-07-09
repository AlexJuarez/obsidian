define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./creativeThumbnails.html');

    app.directive('creativeThumbnails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/directives/creativeThumbnails.html',
            // controller: ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {
            //     var creativeData = $scope.$parent.creatives.data;
            //     console.log( creativeData );
            //     $scope.isDelivering = false;
            //     switch(creativeData.delivering) {
            //     case 'inFlight':
            //         $scope.isDelivering = true;
            //         console.log( $scope.isDelivering );
            //         break;
            //     }
            // }]
            link: function(scope, element) {
                console.log( scope, element );
                var creativeData = scope.$parent.creatives.data;
                console.log( creativeData );
                scope.isDelivering = false;
                switch(creativeData.delivering) {
                case 'inFlight':
                    scope.isDelivering = true;
                    console.log( scope.isDelivering );
                    break;
                }
            }
        };
    }]);

});