// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', '$timeout', 'modalState', function ($scope, $modalInstance, $timeout, modalState) {
        $scope.name =               modalState.name;
        $scope.impressions =        modalState.impressions;
        $scope.creativeData =       modalState.creativeData;
        $scope.cancel =             cancel;

        console.log( '# ad types', $scope.creativeData.length );

        
        // Adjust bootstrap classes based on # of ad types returned
        if ($scope.creativeData.length <= 1) {
            // set to small colClasses
            $scope.colClasses = 'col-xs-12';
        } else if ($scope.creativeData.length <= 2) {
            // set to med colClasses
            $scope.colClasses = 'col-xs-12 col-sm-6';
        } else if ($scope.creativeData.length <= 3) {
            // set to med colClasses
            $scope.colClasses = 'col-xs-12 col-sm-4';
        } else {
            // set to large colClasses
            $scope.colClasses = 'col-xs-12 col-sm-4 col-md-3';    
        }


        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
