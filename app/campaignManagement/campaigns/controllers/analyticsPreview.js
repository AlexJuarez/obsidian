define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', '$timeout', 'modalState', 'ENUMS', function ($scope, $modalInstance, $timeout, modalState, ENUMS) {

        $scope.name =               modalState.name;
        $scope.impressions =        modalState.impressions;
        $scope.cancel =             cancel;
        $scope.creativeTypes =      ENUMS.up.creativeTypes;

        modalState.data.observe(update, $scope);

        function update(){
            $scope.creativeData = modalState.data.all();
        }

        // Adjust bootstrap classes based on # of ad types returned
        if ($scope.creativeData.length <= 1) {
            // set to xs colClasses
            $scope.colClasses = 'col-xs-12';
        } else if ($scope.creativeData.length <= 2) {
            // set to med colClasses
            $scope.colClasses = 'col-xs-12 col-sm-6';
        } else if ($scope.creativeData.length <= 3) {
            // set to large colClasses
            $scope.colClasses = 'col-xs-12 col-sm-6 col-md-4';
        } else {
            // set to x-large colClasses
            $scope.colClasses = 'col-xs-12 col-sm-6 col-md-3';
        }


        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
