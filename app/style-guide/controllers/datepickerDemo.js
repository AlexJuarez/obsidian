define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('datepickerDemoCtrl', ['$scope', function ($scope) {

        $scope.dt = new Date();

        $scope.openPicker = openPicker;

        $scope.format = 'dd.MM.yyyy';

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
