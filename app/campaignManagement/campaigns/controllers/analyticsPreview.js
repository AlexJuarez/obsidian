// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../analytics-preview.html');

    app.controller('analyticsPreviewCtrl', ['$scope', '$modalInstance', 'modalState', function ($scope, $modalInstance, modalState) {
        $scope.name = modalState.name;
        $scope.cancel = cancel;
        $scope.impressions = modalState.impressions;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }]);
});
