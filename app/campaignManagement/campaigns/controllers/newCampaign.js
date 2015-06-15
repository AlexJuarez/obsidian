define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('newCampaignCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        //Datepicker functions
        $scope.format = 'MM/dd/yyyy';
        $scope.openPicker = openPicker;

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;

        $scope.campaign =  {
            startDate: new Date(),
            endDate: new Date(),
            objectives: []
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            maxMode: 'day'
        };

        $scope.select = [
            {
                name: 'First Choice',
                value: '1'
            },
            {
                name: 'Second',
                value: '2'
            },
            {
                name: 'Choice #3',
                value: '3'
            },
            {
                name: 'Pick me, pick me, pick me!',
                value: '4'
            },
            {
                name: 'Sheeple',
                value: '5'
            }
        ];

        function openPicker($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[name] = true;
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function ok(errors) {
            console.log(errors);
            $scope.errors = errors;
            $scope.submitted = true;
            console.log('do something');
        }

    }]);
});
