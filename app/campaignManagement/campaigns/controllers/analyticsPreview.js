// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', 'modalState', function ($scope, $modalInstance, modalState) {
        console.log('modalState', modalState );
        $scope.name = modalState.name;
        $scope.placements = modalState.placements;
        $scope.impressions = modalState.impressions;
        $scope.cancel = cancel;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
