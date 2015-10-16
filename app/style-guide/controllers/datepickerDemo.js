define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('datepickerDemoCtrl', ['$scope', 'DATE_FORMAT', function ($scope, DATE_FORMAT) {

        $scope.dt = new Date();

        $scope.openPicker = openPicker;

        $scope.format = DATE_FORMAT;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            maxMode: 'day'
        };

        function openPicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        }
    }]);
});
