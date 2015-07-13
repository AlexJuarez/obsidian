'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativeThumbnailsCtrl', ['$scope', '$window',
        function($scope, $window) {
            
            $scope.openStudio = function(id) {
                console.log( 'thumbnail controller: open studio ' + id );
                $window.open('https://studio.mixpo.com', '_blank');
            };

            $scope.openSettings = function(id) {
                console.log( 'thumbnail controller: open settings ' + id );
            };

            $scope.openPlacements = function(id) {
                console.log( 'thumbnail controller: open placements ' + id );
            };
            
            $scope.copyCreative = function(id) {
                console.log( 'thumbnail controller: copy creative ' + id );
            };

            $scope.deleteCreative = function(id) {
                console.log( 'thumbnail controller: delete creative ' + id );
            };

            $scope.previewCreative = function(id) {
                console.log( 'thumbnail controller: preview creative ' + id );
            };

        }
    ]);
});
