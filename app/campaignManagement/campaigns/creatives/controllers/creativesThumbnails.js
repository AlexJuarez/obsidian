'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesThumbnailsCtrl', ['$scope', '$window',
        function($scope, $window) {

            $scope.openStudio = function(id) {
                $window.open('//staging-studio.mixpo.com/studio?sdf=open&guid=' + id, '_blank');
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
