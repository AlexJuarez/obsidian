// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', 'modalState', function ($scope, $modalInstance, modalState) {
        console.log( 'analyticsPreviewCtrl', modalState );
        $scope.name =           modalState.name;
        $scope.placements =     modalState.placements;
        $scope.impressions =    modalState.metrics.impressions;
        $scope.viewrate =       modalState.metrics.viewRate;
        $scope.useractionrate = modalState.metrics.useractionRate;
        $scope.clickthroughrate = modalState.metrics.clickthroughRate;
        $scope.cancel =         cancel;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
