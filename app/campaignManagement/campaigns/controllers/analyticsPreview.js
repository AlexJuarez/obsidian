// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', 'modalState', function ($scope, $modalInstance, modalState) {
        console.log( 'analyticsPreviewCtrl', modalState );
        $scope.name =               modalState.name;
        $scope.impressions =        modalState.impressions;
        $scope.creativeData =       modalState.creativeData;
        $scope.cancel =             cancel;


        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
